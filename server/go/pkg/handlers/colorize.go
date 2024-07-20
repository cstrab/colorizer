package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/cstrab/colorizer/server/go/pkg/log"
	"github.com/cstrab/colorizer/server/go/pkg/types"
	"github.com/cstrab/colorizer/server/go/pkg/utils"
)

func setCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Disposition")
}

func ColorizeImages(w http.ResponseWriter, r *http.Request, numWorkers int) {
	setCorsHeaders(w)
	logger := log.GetLogger()
	logger.Info("%s - \"%s %s %s\"", r.RemoteAddr, r.Method, r.URL.Path, r.Proto)

	file, header, err := r.FormFile("file")
	if err != nil {
		logger.Error("Failed to retrieve file: %v", err)
		http.Error(w, "Failed to retrieve file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if filepath.Ext(header.Filename) != ".zip" {
		logger.Error("Invalid file format. Expected .zip, got %s", filepath.Ext(header.Filename))
		http.Error(w, "Invalid file format. Please upload a .zip file.", http.StatusBadRequest)
		return
	}

	colorExtension := r.FormValue("color_extension")
	if colorExtension == "" {
		logger.Error("Color extension is required but not provided.")
		http.Error(w, "Color extension is required.", http.StatusBadRequest)
		return
	}

	colorMappingJSON := r.FormValue("color_mapping")
	if colorMappingJSON == "" {
		logger.Error("Color mapping is required but not provided.")
		http.Error(w, "Color mapping is required.", http.StatusBadRequest)
		return
	}

	var colorMappings []types.ColorMapping
	if err := json.Unmarshal([]byte(colorMappingJSON), &colorMappings); err != nil {
		logger.Error("Failed to parse color mapping: %v", err)
		http.Error(w, "Invalid color mapping format.", http.StatusBadRequest)
		return
	}

	outputZipBuffer, err := utils.ProcessImages(file, header.Size, colorExtension, colorMappings, numWorkers)
	if err != nil {
		logger.Error("Failed to process images: %v", err)
		http.Error(w, "Failed to process images", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s%s.zip\"", strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename)), colorExtension))

	if _, err := io.Copy(w, outputZipBuffer); err != nil {
		logger.Error("Failed to stream response: %v", err)
		http.Error(w, "Failed to stream response", http.StatusInternalServerError)
		return
	}

	logger.Info("%s - \"%s %s %s\" %d %s", r.RemoteAddr, r.Method, r.URL.Path, r.Proto, http.StatusOK, http.StatusText(http.StatusOK))
}

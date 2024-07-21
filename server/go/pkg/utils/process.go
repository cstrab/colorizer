package utils

import (
	"archive/zip"
	"bytes"
	"compress/flate"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io"
	"path/filepath"
	"strings"
	"sync"

	"github.com/cstrab/colorizer/server/go/pkg/log"
	"github.com/cstrab/colorizer/server/go/pkg/types"
)

func ProcessImages(file io.ReaderAt, size int64, colorExtension string, colorMappings []types.ColorMapping, numWorkers int) (*bytes.Buffer, error) {
	logger := log.GetLogger()
	logger.Info("Processing images with %d workers", numWorkers)
	zipReader, err := zip.NewReader(file, size)
	if err != nil {
		return nil, fmt.Errorf("failed to read zip file: %v", err)
	}

	outputZipBuffer := new(bytes.Buffer)
	outputZipWriter := zip.NewWriter(outputZipBuffer)
	outputZipWriter.RegisterCompressor(zip.Deflate, func(out io.Writer) (io.WriteCloser, error) {
		return flate.NewWriter(out, flate.BestCompression)
	})

	var wg sync.WaitGroup
	errChan := make(chan error, len(zipReader.File))
	fileChan := make(chan *zip.File, len(zipReader.File))

	var zipWriterMutex sync.Mutex

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go worker(&wg, fileChan, errChan, outputZipWriter, &zipWriterMutex, colorExtension, colorMappings)
	}

	for _, zipFile := range zipReader.File {
		fileChan <- zipFile
	}
	close(fileChan)

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return nil, err
		}
	}

	if err := outputZipWriter.Close(); err != nil {
		return nil, fmt.Errorf("failed to close output zip writer: %v", err)
	}

	return outputZipBuffer, nil
}

func worker(wg *sync.WaitGroup, fileChan <-chan *zip.File, errChan chan<- error, outputZipWriter *zip.Writer, zipWriterMutex *sync.Mutex, colorExtension string, colorMappings []types.ColorMapping) {
	logger := log.GetLogger()
	defer wg.Done()

	for zipFile := range fileChan {
		logger.Info("Processing image: %s", zipFile.Name)
		inputFile, err := zipFile.Open()
		if err != nil {
			errChan <- fmt.Errorf("failed to open file %s in zip: %v", zipFile.Name, err)
			continue
		}

		img, _, err := image.Decode(inputFile)
		inputFile.Close()
		if err != nil {
			errChan <- fmt.Errorf("failed to decode image %s: %v", zipFile.Name, err)
			continue
		}

		logger.Info("Replacing colors")
		processedImage := replaceColors(img, colorMappings)

		fileName := zipFile.Name
		ext := filepath.Ext(fileName)
		newFileName := strings.TrimSuffix(fileName, ext) + colorExtension + ext

		zipWriterMutex.Lock()
		outputFile, err := outputZipWriter.Create(newFileName)
		if err != nil {
			zipWriterMutex.Unlock()
			errChan <- fmt.Errorf("failed to create file in output zip: %v", err)
			continue
		}

		encoder := &png.Encoder{
			CompressionLevel: png.BestCompression,
		}
		if err := encoder.Encode(outputFile, processedImage); err != nil {
			zipWriterMutex.Unlock()
			errChan <- fmt.Errorf("failed to encode and write image to output file %s: %v", newFileName, err)
			continue
		}
		zipWriterMutex.Unlock()
	}
}

func replaceColors(img image.Image, colorMapping []types.ColorMapping) image.Image {
	bounds := img.Bounds()
	newImg := image.NewRGBA(bounds)

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			oldColor := img.At(x, y)
			r, g, b, a := oldColor.RGBA()
			newColor := color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), uint8(a >> 8)}

			for _, mapping := range colorMapping {
				initialColor := parseHexColor(mapping.InitialColor)
				targetColor := parseHexColor(mapping.TargetColor)

				if newColor == initialColor {
					newColor = targetColor
					break
				}
			}
			newImg.Set(x, y, newColor)
		}
	}

	return newImg
}

func parseHexColor(hexColor string) color.RGBA {
	hexColor = strings.TrimPrefix(hexColor, "#")
	var r, g, b, a uint8
	if len(hexColor) == 6 {
		fmt.Sscanf(hexColor, "%02x%02x%02x", &r, &g, &b)
		return color.RGBA{r, g, b, 255}
	}
	fmt.Sscanf(hexColor, "%02x%02x%02x%02x", &r, &g, &b, &a)
	return color.RGBA{r, g, b, a}
}

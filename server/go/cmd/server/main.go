package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/cstrab/colorizer/server/go/pkg/handlers"
	"github.com/cstrab/colorizer/server/go/pkg/log"
	"github.com/gorilla/mux"
)

const apiPrefix = "/api"

func main() {
	host := flag.String("host", "localhost", "Host address")
	port := flag.Int("port", 8080, "Port number")
	logLevel := flag.String("log-level", "info", "Log level")
	numWorkers := flag.Int("num-workers", 4, "Number of process workers")
	flag.Parse()

	level, err := log.ParseLogLevel(*logLevel)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Invalid log level: %v\n", err)
		os.Exit(1)
	}

	logger := log.New(os.Stdout, "", log.DefaultLoggerFlag, level)
	log.SetLogger(logger)

	r := mux.NewRouter()

	r.HandleFunc(apiPrefix+"/colorize", func(w http.ResponseWriter, r *http.Request) {
		handlers.ColorizeImages(w, r, *numWorkers)
	}).Methods("POST")

	addr := fmt.Sprintf("%s:%d", *host, *port)
	logger.Info("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		logger.Error("Server error: %v", err)
		os.Exit(1)
	}
}

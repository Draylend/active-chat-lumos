package main

import (
	"component-server/internal/middleware"
	"component-server/internal/server"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	componentLibrary := flag.String("component-dir", "../component-library", "Path to components")
	port := flag.Int("port", 8090, "Port to run server on")
	flag.Parse()

	// check if component dir exists
	info, err := os.Stat(*componentLibrary)
	if err != nil {
		if os.IsNotExist(err) {
			log.Fatalf("FATAL: Component directory \"%s\" does not exist", *componentLibrary)
		}
		log.Fatalf("FATAL: Error accessing directory \"%s\"", *componentLibrary)
	}
	if !info.IsDir() {
		log.Fatalf("FATAL: \"%s\" is not a directory", *componentLibrary)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/components/{id}", server.GetActivity(*componentLibrary))

	wrappedMux := middleware.Cors(mux)

	addr := fmt.Sprintf(":%d", *port)
	log.Printf("Starting server on port %d with component-dir path %s\n", *port, *componentLibrary)
	log.Fatal(http.ListenAndServe(addr, wrappedMux))
}

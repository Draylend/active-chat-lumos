package main

import (
	"component-server/internal/server"
	"flag"
	"fmt"
	"net/http"
)

func main() {
	componentLibrary := flag.String("component-dir", "../component-library", "Path to components")
	port := flag.Int("port", 8090, "Port to run server on")
	flag.Parse()

	mux := http.NewServeMux()

	mux.HandleFunc("/components/{id}", server.GetActivity(*componentLibrary))

	addr := fmt.Sprintf(":%d", *port)

	http.ListenAndServe(addr, mux)
}

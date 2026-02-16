package main

import (
	"flag"
	"log"
	"net/http"

	"example/lumos/internal/middleware" /* import CORS*/
	"example/lumos/internal/server"
)

func main() {
	componentDir := flag.String("component-dir", "../component-library", "path to component library")
	port := flag.String("port", "8090", "port to listen on")

	flag.Parse()

	mux := http.NewServeMux()
	server.RegisterRoutes(mux, *componentDir)

	handler := middleware.WithCORS(mux)

	log.Printf("Listening on :%s (component-dir=%s)\n", *port, *componentDir)
	log.Fatal(http.ListenAndServe(":"+*port, handler))
}

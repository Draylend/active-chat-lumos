package server

/*save files from componentDir*/
/* 1. translate URL 2. file path 3. serve files*/
import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"mime" /*milestone 1 feedback change */
)

func ComponentHandler(componentDir string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		path := strings.TrimPrefix(r.URL.Path, "/components/")
		path = strings.TrimPrefix(path, "/")

		/* Get /components/mcq --> <componentDir>/mcq/index.js*/
		/* Get /components/mcq/static/header.svg --> <componentDir>/mcq/static/header.svg*/
		if path == "" {
			http.NotFound(w, r)
			log.Printf("No component path provided")
			return
		}

		parts := strings.Split(path, "/")
		componentName := parts[0]

		var(
			fsPath	string
			isMainJS	bool
		)

		if len(parts) == 1 {
			fsPath = filepath.Join(componentDir, componentName, "index.js")
			isMainJS = true
		} else {
			/*only allow static*/
			if parts[1] != "static" {
				http.NotFound(w, r)
				return
			}
			/*milestone 1&2 feedback: */
			/* added a length check to ensure /static requests include a file path,
			preventing malformed requests and potential slice errors*/
			if len(parts) < 3 {
				http.Error(w, "missing static asset path", http.StatusBadRequest)
				return
			}

			rest := parts[2:]
			fsPath = filepath.Join(append([]string{componentDir, componentName, "static"}, rest...)...)
		}

		/*path traversal*/
		cleanBase := filepath.Clean(componentDir)
		cleanPath := filepath.Clean(fsPath)
		if !strings.HasPrefix(cleanPath, cleanBase+string(os.PathSeparator)) && cleanPath != cleanBase {
			http.Error(w, "invalid path", http.StatusBadRequest)
			log.Printf("Invalid path")
			return
		}

		/*404 if not found*/
		if _, err := os.Stat(cleanPath); err != nil {
			http.NotFound(w, r)
			log.Printf("Failed to serve component. Component not found")
			return
		}

		/* milestone 1 feeback change here: */
		/* make sure the correct MIME for JS module*/
		if isMainJS {
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		} else {
			/* ensure Go knows common types: svg, wasm,..*/
			if ctype := mime.TypeByExtension(filepath.Ext(cleanPath)); ctype != "" {
				w.Header().Set("Content-Type", ctype)
			}
		}

		http.ServeFile(w, r, cleanPath)
		log.Printf("Served %s component\n", componentName)
	})
}

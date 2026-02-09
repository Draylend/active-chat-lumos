package server

/*save files from componentDir*/
/* 1. translate URL 2. file path 3. serve files*/
import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func ComponentHandler(componentDir string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		
		path := strings.TrimPrefix(r.URL.Path, "/components/")
		path = strings.TrimPrefix(path, "/")

		/* Get /components/mcq --> <componentDir>/mcq/index.js*/
		/* Get /components/mcq/static/header.svg --> <componentDir>/mcq/static/header.svg*/
		if path == "" {
			http.NotFound(w, r)
			return
		}

		parts := strings.Split(path, "/")
		componentName := parts[0]

		var fsPath string
		if len(parts) == 1 {
			fsPath = filepath.Join(componentDir, componentName, "index.js")
		} else {
			/*only allow static*/
			if parts[1] != "static" {
				http.NotFound(w, r)
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
			return
		}

		/*404 if not found*/
		if _, err := os.Stat(cleanPath); err != nil {
			http.NotFound(w, r)
			return
		}

		http.ServeFile(w, r, cleanPath)
	})
}

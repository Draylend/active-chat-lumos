package server

/* 1. translate URL 2. file path 3. serve files*/
import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"mime" /*milestone 1 feedback change */
	"fmt" /*m4*/
)

func ComponentHandler(componentDir string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		path := strings.TrimPrefix(r.URL.Path, "/components/")
		path = strings.TrimPrefix(path, "/")


		if path == "" {
			http.NotFound(w, r)
			log.Printf("No component path provided")
			return
		}

		parts := strings.Split(path, "/")
		rawName := parts[0]
		componentName := strings.TrimSuffix(rawName, ".js")

		/*m4.1: validate component name using standard library*/
		if componentName == "" || !filepath.IsLocal(componentName) {
			http.Error(w, "invalid component name", http.StatusBadRequest)
			return
		}

		var fsPath	string
		isEntryModule := false

		/* case 1: static asset*/
		if len(parts) >= 2 && parts[1] == "static" {
			if len(parts) < 3 {
				http.Error(w, "missing static asset path", http.StatusBadRequest)
				return
			}

			rest := parts[2:]
			staticRelPath := filepath.Join(rest...)
			if !filepath.IsLocal(staticRelPath) {
				http.Error(w, "invalid path", http.StatusBadRequest)
				log.Printf("Invalid static path attempt: %q", r.URL.Path)
				return
			}

			fsPath = filepath.Join(componentDir, componentName, "static", staticRelPath)

			} else {
				/* case 2: js file*/
				if len(parts) != 2 {
					http.NotFound(w, r)
					return
				}
	
				jsFile := parts[1]
				if !filepath.IsLocal(jsFile) || filepath.Ext(jsFile) != ".js" {
					http.Error(w, "invalid path", http.StatusBadRequest)
					log.Printf("Invalid JS path attempt: %q", r.URL.Path)
					return
				}
	
				if jsFile == "index.js" {
					isEntryModule = true
				}
	
				fsPath = filepath.Join(componentDir, componentName, jsFile)
		}


		/*path traversal*/
		cleanBase := filepath.Clean(componentDir)
		cleanPath := filepath.Clean(fsPath)
		if !strings.HasPrefix(cleanPath, cleanBase+string(os.PathSeparator)) && cleanPath != cleanBase {
			http.Error(w, "invalid path", http.StatusBadRequest)
			log.Printf("Invalid path attempt: %q", r.URL.Path)
			return
		}

		/*m4: return a fallback, 404 if not found*/
		if _, err := os.Stat(cleanPath); err != nil {
			if isEntryModule {
				serveInvalidActivityFallback(w, componentName)
				log.Printf("Fallback served for missing component: %s", componentName)
				return
			}

			http.NotFound(w, r)
			log.Printf("File not found: %s", cleanPath)
			return
		}

		if ctype := mime.TypeByExtension(filepath.Ext(cleanPath)); ctype != "" {
			w.Header().Set("Content-Type", ctype)
		}

		http.ServeFile(w, r, cleanPath)
		log.Printf("Served %s\n", cleanPath)
	})
}


/*m4: fallback module, can render visible message*/
func serveInvalidActivityFallback(w http.ResponseWriter, tagName string) {
	w.Header().Set("Content-Type", "application/javascript")
	w.WriteHeader(http.StatusOK)

	js := fmt.Sprintf(`
console.warn("Component '%s' not found.");

class InvalidActivity extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<div style='padding:10px;border:1px solid red;border-radius:6px;'>Invalid activity: %s</div>";
  }
}

customElements.define("%s", InvalidActivity);

export {};
`, tagName, tagName, tagName)

	w.Write([]byte(js))
}

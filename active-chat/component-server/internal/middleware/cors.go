package middleware

/* add CORS header to every response so frontend is allowed to call backend*/
import (
	"log"
	"net/http"
)

func WithCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		/*the browser sometimes send preflight request*/
		/*so if option "preflight, end early, if not, pass to next handler */
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Printf("%s method not allowed\n", r.Method)
			return
		}

		next.ServeHTTP(w, r)
	})
}

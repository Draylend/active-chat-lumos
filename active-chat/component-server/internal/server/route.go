package server

/*connect URL paths to handlers*/
/*map the endpoints means making a catalog of the endpoints 
and the capabilities (individual APIs / methods) they provide.*/
import "net/http"

func RegisterRoutes(mux *http.ServeMux, componentDir string) {
	mux.Handle("/components/", ComponentHandler(componentDir))
}

package server

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
)

type Response struct {
	Id      string `json:"id"`
	Content string `json:"content"`
}

func GetActivity(componentDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// get id parameter from url
		id := req.PathValue("id")

		// get file path
		filePath := filepath.Join(componentDir, filepath.Base(id), "index.js")

		// read the file
		content, err := os.ReadFile(filePath)
		// check if file exists
		if err != nil {
			http.Error(w, "Component not found", http.StatusNotFound)
			return
		}

		resp := Response{
			Id:      id,
			Content: string(content),
		}

		// encode and return json
		e := json.NewEncoder(w)
		e.Encode(resp)
	}
}

// func main() {
// 	http.HandleFunc("/component/{id}", getActivity)
// }

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprint(w, "hello\n")
}

func headers(w http.ResponseWriter, req *http.Request) {
	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Fprintf(w, "%v: %v\n", name, h)
		}
	}
}

func test(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	name := req.URL.Query().Get("name")
	if name == "" {
		name = "Guest"
	}

	userAgent := req.Header.Get("User-Agent")

	fmt.Fprintf(w, "Hello %s! You are using: %s", name, userAgent)
}

type Response struct {
	Html  string   `json:"greg"`
	Items []string `json:"items"`
}

func getActivity(w http.ResponseWriter, req *http.Request) {
	response := Response{Html: "this is the url", Items: []string{"2", "4"}}

	e := json.NewEncoder(w)

	e.Encode(response)

}

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/headers", headers)

	http.HandleFunc("/test", test)
	http.HandleFunc("/components/{id}", getActivity)

	http.ListenAndServe(":8090", nil)
}

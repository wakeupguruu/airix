package utils

import (
	"encoding/json"
	"net/http"
)

func ResponseWithJSON(w http.ResponseWriter, status int, data any){
	w.Header().Set("Content-Type", "application/json");
	w.WriteHeader(status);
	json.NewEncoder(w).Encode(data);
}

func ResponseWithError(w http.ResponseWriter, status int, message string){
	ResponseWithJSON(w, status, map[string]string{"error": message});
}
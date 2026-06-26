package handlers

import (
	"net/http"

	"github.com/wakeupguruu/airix/internal/utils"
);


func HandlerReadiness(w http.ResponseWriter , r *http.Request){
	utils.ResponseWithJSON(w,200,map[string]string{"status": "ok"});
}
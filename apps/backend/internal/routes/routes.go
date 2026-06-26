package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/wakeupguruu/airix/internal/handlers"
)

func SetupRouter(r *chi.Mux){
	r.Get("/health", handlers.HandlerReadiness)
}
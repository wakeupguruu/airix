package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/handlers"
)

func SetupRoutes(r *chi.Mux, q *db.Queries, redisClient *redis.Client) {
	// Health check
	r.Get("/health", handlers.HandlerReadiness)

	// Initialize Handlers
	authHandler := handlers.NewAuthHandler(q, redisClient)

	// Group: /auth
	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
	})
}
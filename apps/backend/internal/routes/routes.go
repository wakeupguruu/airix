package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/handlers"
)

func SetupRoutes(r *chi.Mux, q *db.Queries, redisClient *redis.Client) {
	// Health check
	r.Get("/health", handlers.HandlerReadiness)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(q, redisClient)
	userHandler := handlers.NewUserHandler(q)
	settingsHandler := handlers.NewSettingsHandler(q)

	// Public: /auth
	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
	})

	// Protected: all routes below require a valid JWT
	r.Group(func(r chi.Router) {
		r.Use(auth.RequireAuth)

		// User profile
		r.Get("/users/me", userHandler.GetProfile)
		r.Patch("/users/me", userHandler.UpdateProfile)

		// Settings
		r.Get("/users/me/settings", settingsHandler.GetSettings)
		r.Put("/users/me/settings", settingsHandler.UpdateSettings)
	})
}
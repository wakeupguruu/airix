package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/config"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/handlers"
)

func SetupRoutes(r *chi.Mux, q *db.Queries, redisClient *redis.Client, s3Client *config.S3Client, aiClient *config.AIClient) {
	// Health check
	r.Get("/health", handlers.HandlerReadiness)

	// Initialize handlers
	authHandler        := handlers.NewAuthHandler(q, redisClient)
	userHandler        := handlers.NewUserHandler(q, s3Client)
	settingsHandler    := handlers.NewSettingsHandler(q)
	workspaceHandler   := handlers.NewWorkspaceHandler(q, s3Client, aiClient)
	maintenanceHandler := handlers.NewMaintenanceHandler(q, s3Client, aiClient)

	//  Public
	r.Route("/auth", func(r chi.Router) {
		r.Post("/register",        authHandler.Register)
		r.Post("/login",           authHandler.Login)
		r.Post("/refresh",         authHandler.Refresh)
		r.Post("/forgot-password", authHandler.ForgotPassword)
		r.Post("/reset-password",  authHandler.ResetPassword)
	})

	//  Protected
	r.Group(func(r chi.Router) {
		r.Use(auth.RequireAuth)

		// User 
		r.Get("/users/me",          userHandler.GetProfile)
		r.Patch("/users/me",        userHandler.UpdateProfile)
		r.Post("/users/me/avatar",  userHandler.UploadAvatar)

		// Settings 
		r.Get("/users/me/settings", settingsHandler.GetSettings)
		r.Put("/users/me/settings", settingsHandler.UpdateSettings)

		// Workspaces 
		r.Route("/workspaces", func(r chi.Router) {
			r.Post("/",   workspaceHandler.CreateWorkspace)
			r.Get("/",    workspaceHandler.ListWorkspaces)

			r.Route("/{id}", func(r chi.Router) {
				r.Get("/",    workspaceHandler.GetWorkspace)
				r.Patch("/",  workspaceHandler.UpdateWorkspace)
				r.Delete("/", workspaceHandler.DeleteWorkspace)

				// Chat history
				r.Get("/chats", workspaceHandler.GetChats)

				// AI features (via gRPC to Python AI backend)
				r.Post("/chat/design",    workspaceHandler.DesignChat)
				r.Post("/generate",       workspaceHandler.Generate)
				r.Get("/generate/status", workspaceHandler.GenerateStatus)
				r.Post("/concept",        workspaceHandler.ConceptImages)

				
				r.Post("/models/import", workspaceHandler.ImportModel)
				r.Get("/models",         workspaceHandler.ListModels)
			})
		})

		// Maintenance 
		r.Route("/maintenance", func(r chi.Router) {
			r.Post("/", maintenanceHandler.CreateManagement)
			r.Get("/",  maintenanceHandler.ListManagements)

			r.Route("/{id}", func(r chi.Router) {
				r.Get("/",    maintenanceHandler.GetManagement)
				r.Patch("/",  maintenanceHandler.UpdateManagement)
				r.Delete("/", maintenanceHandler.DeleteManagement)

				// Chat history
				r.Get("/chats", maintenanceHandler.GetChats)

				// AI analysis (gRPC call commented inside handler)
				r.Post("/analyse", maintenanceHandler.Analyse)

				// File upload for sensor data (CSV/PDF)
				r.Post("/upload", maintenanceHandler.UploadSensorFile)
			})
		})
	})
}
package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/wakeupguruu/airix/internal/config"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/routes"
)

func main() {
	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	pool := config.ConnectDB()                                                                                 
    defer pool.Close()

	redisClient := config.ConnectRedis()                                                                         
    defer redisClient.Close()

	s3Client, err := config.ConnectS3()
	if err != nil {
		log.Fatalf("failed to connect s3: %v", err)
	}

	// ── AI gRPC client (uncomment when Python AI backend is ready) ───────────
	// aiClient := config.ConnectAI()
	// defer aiClient.Close()

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1 := chi.NewRouter()
	
	q := db.New(pool)
	 routes.SetupRoutes(v1, q, redisClient, s3Client)
	
	router.Mount("/api/v1", v1)



	srv := &http.Server{
		Handler:      	router,
		Addr:         	":" + port,                                                                                
        ReadTimeout: 	30 * time.Second,                                                                          
        WriteTimeout:	60 * time.Second,                                                                          
        IdleTimeout:	90 * time.Second, 
	}

	log.Print("Server is Starting...");
	
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
        log.Fatal(err)
    }
}

package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)


func ConnectDB() *pgxpool.Pool{
	url := os.Getenv("DATABASE_URL");
	if url == ""{
		log.Fatal("No Database url provided");
	}

	pool, err := pgxpool.New(context.Background(), url)

	if err != nil {
		log.Fatalf("failed to create database pool: %v", err)
	}
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("database unreachable — check DATABASE_URL and that Postgres is running: %v", err)
	}

	log.Println("database connected")


	return pool
	
}
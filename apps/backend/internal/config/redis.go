package config                                                                                               
                                                                                                                 
import (                                                                                                     
	"context"                                                                                                   
	"log"                                                                                                   
	"os"                                                                                                        
																												
	"github.com/redis/go-redis/v9"                                                                              
)                                                                                                            
																												
func ConnectRedis() *redis.Client { 
	url := os.Getenv("REDIS_URL")                                                                               
	if url == "" {                                                                                              
		log.Fatal("REDIS_URL must be set")                                                                          
	}    																									
	opt, err := redis.ParseURL(url)                                                                             
	if err != nil {                                                                                             
		log.Fatalf("failed to parse redis url: %v", err)                                                            
	}   
	client := redis.NewClient(opt)                                                                              
                                                                                                                 
	                                                                              
	if err := client.Ping(context.Background()).Err(); err != nil {                                             
		log.Fatalf("failed to connect to redis: %v", err)                                                           
	}                                                                                                           
																												
	log.Println("Connected to Redis")                                                                        
	return client 
}
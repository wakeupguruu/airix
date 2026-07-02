package config

import (
	"log"
	"os"

	aipb "github.com/wakeupguruu/airix/internal/pb/ai"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)


type AIClient struct {
	Conn   *grpc.ClientConn
	Client aipb.AIServiceClient
}


func ConnectAI() *AIClient {
	addr := os.Getenv("GRPC_AI_ADDR")
	if addr == "" {
		addr = "localhost:50051"
	}


	conn, err := grpc.NewClient(addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		// concept images come back as base64 data URIs — well beyond the 4MB default
		grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(64*1024*1024)),
	)
	if err != nil {
		log.Fatalf("failed to connect to AI gRPC server at %s: %v", addr, err)
	}

	log.Printf("Connected to AI gRPC server at %s", addr)

	return &AIClient{
		Conn:   conn,
		Client: aipb.NewAIServiceClient(conn),
	}
}


func (a *AIClient) Close() {
	if err := a.Conn.Close(); err != nil {
		log.Printf("error closing AI gRPC connection: %v", err)
	}
}

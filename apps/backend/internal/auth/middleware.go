package auth

import (
	"context"                                                                                                    
    "net/http"                                                                                                   
    "os"                                                                                                         
    "strings"                                                                                                    
                                                                                                                 
    "github.com/wakeupguruu/airix/internal/utils"
)

type contextKey string
const ClaimsKey contextKey = "claims"

func RequireAuth(next http.Handler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			utils.ResponseWithError(w, 401, "unauthorized")
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := ValidateToken(tokenStr, os.Getenv("JWT_SECRET"))
		if err != nil {
			utils.ResponseWithError(w, 401, "invalid token")
			return
		}
		ctx := context.WithValue(r.Context(),ClaimsKey,claims)
		next.ServeHTTP(w, r.WithContext(ctx))

	})
}
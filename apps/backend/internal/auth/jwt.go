package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)


type Claims struct{
	UserId string `json:"user_id"`
	Email string `json:"email"`
	jwt.RegisteredClaims                                                                             
}

func GenerateAccessToken(userID, email string) (string , error) {
	claims := &Claims{
		UserId: userID,
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims);
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateRefreshToken(userID string) (string, error) {
	claims := Claims{
		UserId: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_REFRESH_SECRET")))
}

func ValidateToken(tokenStr, secret string) (*Claims, error){
	

	token , err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil 
	})

	if err != nil || !token.Valid {
		return nil, err
	}
	return  token.Claims.(*Claims), nil
}
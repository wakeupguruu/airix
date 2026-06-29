package handlers

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/redis/go-redis/v9"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	Q *db.Queries
	Redis *redis.Client
}

func NewAuthHandler(q *db.Queries, rClient *redis.Client) *AuthHandler {                     
    return &AuthHandler{Q: q, Redis: rClient}                                                                   
}

type RegisterReq struct {
	Username string `json:"username" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type LoginReq struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RefreshReq struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterReq

	if valid := utils.DecodeAndValidate(w, r, &req); !valid {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}


	_, err := h.Q.GetUserByEmail(r.Context(), req.Email)
	if err == nil {
		utils.ResponseWithError(w, 400, "email already exists")
		return
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		utils.ResponseWithError(w, 500, "internal server error")
		return
	}


	_, err = h.Q.GetUserByUsername(r.Context(), req.Username)
	if err == nil {
		utils.ResponseWithError(w, 400, "username already exists")
		return
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		utils.ResponseWithError(w, 500, "internal server error")
		return
	}


	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ResponseWithError(w, 500, "internal server error")
		return
	}

	
	user, err := h.Q.CreateUser(r.Context(), db.CreateUserParams{
		Username: req.Username,
		Email:    req.Email,
		Password: pgtype.Text{String: string(hash), Valid: true},
		Plan:     "starter",
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create user")
		return
	}

	
	accessToken, err := auth.GenerateAccessToken(user.ID.String(), user.Email)
	if err != nil {
		utils.ResponseWithError(w, 500, "internal server error")
		return
	}
	refreshToken, err := auth.GenerateRefreshToken(user.ID.String())
	if err != nil {
		utils.ResponseWithError(w, 500, "internal server error")
		return
	}


	err = h.Redis.Set(r.Context(), "refresh_token:"+user.ID.String(), refreshToken, 7*24*time.Hour).Err()
	if err != nil {                                                                                              
        utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save session")   
        return             
    }


	utils.ResponseWithJSON(w, 201, map[string]interface{}{
		"user":          ToUserResponse(user),
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}


func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginReq
	if valid := utils.DecodeAndValidate(w, r, &req); !valid {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}


	user, err := h.Q.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			utils.ResponseWithError(w, http.StatusUnauthorized, "invalid credentials")
		} else {
			utils.ResponseWithError(w, http.StatusInternalServerError, "internal server error")
		}
		return
	}


	err = bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(req.Password))
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}


	accessToken, err := auth.GenerateAccessToken(user.ID.String(), user.Email)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to generate token")
		return
	}
	refreshToken, err := auth.GenerateRefreshToken(user.ID.String())
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to generate token")
		return
	}


	err = h.Redis.Set(r.Context(), "refresh_token:"+user.ID.String(), refreshToken, 7*24*time.Hour).Err()
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save session")
		return
	}


	utils.ResponseWithJSON(w, 200, map[string]interface{}{
		"user":          ToUserResponse(user),
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}


func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req RefreshReq
	if valid := utils.DecodeAndValidate(w, r, &req); !valid {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}


	claims, err := auth.ValidateToken(req.RefreshToken, os.Getenv("JWT_REFRESH_SECRET"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid or expired refresh token")
		return
	}

	
	storedToken, err := h.Redis.Get(r.Context(), "refresh_token:"+claims.UserId).Result()
	if err == redis.Nil || storedToken != req.RefreshToken {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid or revoked refresh token")
		return
	} else if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "internal server error")
		return
	}


	accessToken, err := auth.GenerateAccessToken(claims.UserId, claims.Email)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to generate token")
		return
	}


	utils.ResponseWithJSON(w, 200, map[string]interface{}{
		"access_token": accessToken,
	})
}


// Generate a 6-digit secure random OTP
func generateOTP() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}


func (h *AuthHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := h.Q.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		if err == pgx.ErrNoRows {
			utils.ResponseWithJSON(w, http.StatusOK, map[string]string{"message": "If this email is registered, an OTP has been sent."})
			return
		}
		utils.ResponseWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	otp, err := generateOTP()
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "Failed to generate OTP")
		return
	}

	redisKey := fmt.Sprintf("otp:%s", user.Email)
	err = h.Redis.Set(r.Context(), redisKey, otp, 15*time.Minute).Err()
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "Failed to store OTP")
		return
	}

	htmlBody := utils.GetOTPHTMLTemplate(otp)
	err = utils.SendEmail(user.Email, "Airix Password Reset", htmlBody)
	if err != nil {
		log.Println("Email error:", err)
		utils.ResponseWithError(w, http.StatusInternalServerError, "Failed to send email")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, map[string]string{"message": "If this email is registered, an OTP has been sent."})
}

type ResetPasswordRequest struct {
	Email       string `json:"email"`
	OTP         string `json:"otp"`
	NewPassword string `json:"new_password"`
}


func (h *AuthHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	
	redisKey := fmt.Sprintf("otp:%s", req.Email)
	storedOTP, err := h.Redis.Get(r.Context(), redisKey).Result()
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "Invalid or expired OTP")
		return
	}

	
	if storedOTP != req.OTP {
		utils.ResponseWithError(w, http.StatusUnauthorized, "Incorrect OTP")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "Failed to process new password")
		return
	}
	hashedPassword := string(hash)

	user, err := h.Q.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "User not found")
		return
	}

	err = h.Q.UpdateUserPassword(r.Context(), db.UpdateUserPasswordParams{
		ID:       user.ID,
		Password: pgtype.Text{String: hashedPassword, Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "Failed to update password in database")
		return
	}

	h.Redis.Del(r.Context(), redisKey)

	utils.ResponseWithJSON(w, http.StatusOK, map[string]string{"message": "Password updated successfully"})
}

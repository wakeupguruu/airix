package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/config"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/utils"
)

type UserHandler struct {
	Q  *db.Queries
	S3 *config.S3Client
}

func NewUserHandler(q *db.Queries, s3 *config.S3Client) *UserHandler {
	return &UserHandler{Q: q, S3: s3}
}


type UpdateProfileReq struct {
	FullName      string `json:"full_name"`
	ContactNumber string `json:"contact_number"`
}


func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	userID, err := uuid.Parse(claims.UserId)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token claims")
		return
	}

	user, err := h.Q.GetUserByID(r.Context(), userID)
	if err != nil {
		if err == pgx.ErrNoRows {
			utils.ResponseWithError(w, http.StatusNotFound, "user not found")
		} else {
			utils.ResponseWithError(w, http.StatusInternalServerError, "internal server error")
		}
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, ToUserResponse(user))
}


func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	userID, err := uuid.Parse(claims.UserId)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token claims")
		return
	}

	var req UpdateProfileReq
	if valid := utils.DecodeAndValidate(w, r, &req); !valid {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	user, err := h.Q.UpdateUser(r.Context(), db.UpdateUserParams{
		ID:            userID,
		FullName:      pgtype.Text{String: req.FullName, Valid: req.FullName != ""},
		ContactNumber: pgtype.Text{String: req.ContactNumber, Valid: req.ContactNumber != ""},
		ProfileImage:  pgtype.Text{Valid: false},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to update profile")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, ToUserResponse(user))
}



func (h *UserHandler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	userID, err := uuid.Parse(claims.UserId)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token claims")
		return
	}

	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "file too large")                    
		return 
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "missing avatar field")              
        return
	}
	defer file.Close()

	valideEXT := filepath.Ext(header.Filename)
	if valideEXT != ".jpg" && valideEXT != ".JPG" && valideEXT != ".png" && valideEXT != ".PNG" && valideEXT != ".webp" && valideEXT != ".WEBP" {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid file format, only JPG, PNG, WEBP allowed")
		return
	}

	key := fmt.Sprintf("airix/%s/avatar/%s", userID.String(), header.Filename)

	currentUser, err := h.Q.GetUserByID(r.Context(), userID)
	if err == nil && currentUser.ProfileImage.Valid {
		baseURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/", os.Getenv("BUCKET_NAME"), os.Getenv("AWS_REGION"))
		oldKey := strings.TrimPrefix(currentUser.ProfileImage.String, baseURL)
            if oldKey != currentUser.ProfileImage.String {
                _ = h.S3.DeleteFile(r.Context(), oldKey) 
            }
        }

	s3Url, err := h.S3.UploadFile(r.Context(), key, file)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to upload to S3")
		return
	}

	
	user, err := h.Q.UpdateUserProfileImage(r.Context(), db.UpdateUserProfileImageParams{
		ID:           userID,
		ProfileImage: pgtype.Text{String: s3Url, Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to update user profile image")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, ToUserResponse(user))
}
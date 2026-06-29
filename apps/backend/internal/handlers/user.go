package handlers

import (
	"net/http"

	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/utils"
)

type UserHandler struct {
	Q *db.Queries
}

func NewUserHandler(q *db.Queries) *UserHandler {
	return &UserHandler{Q: q}
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

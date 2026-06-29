package handlers

import (
	"log"
	"net/http"

	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/utils"
)

type SettingsHandler struct {
	Q *db.Queries
}

func NewSettingsHandler(q *db.Queries) *SettingsHandler {
	return &SettingsHandler{Q: q}
}

type UpdateSettingsReq struct {
	Theme                string `json:"theme" validate:"required,oneof=light dark system"`
	AutoSave             bool   `json:"auto_save"`
	NotificationsEnabled bool   `json:"notifications_enabled"`
}

func (h *SettingsHandler) GetSettings(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	userID, err := uuid.Parse(claims.UserId)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token claims")
		return
	}

	settings, err := h.Q.GetSettingsByUserID(r.Context(), userID)
	if err == pgx.ErrNoRows {
		settings, err = h.Q.CreateSettings(r.Context(), db.CreateSettingsParams{
			UserID:               userID,
			Theme:                "system",
			AutoSave:             true,
			NotificationsEnabled: true,
		})
		if err != nil {
			log.Print(err)
			utils.ResponseWithError(w, http.StatusInternalServerError, "failed to initialize settings")
			return
		}
	} else if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, settings)
}


func (h *SettingsHandler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)

	userID, err := uuid.Parse(claims.UserId)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token claims")
		return
	}

	var req UpdateSettingsReq
	if valid := utils.DecodeAndValidate(w, r, &req); !valid {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	settings, err := h.Q.UpdateSettings(r.Context(), db.UpdateSettingsParams{
		UserID:               userID,
		Theme:                req.Theme,
		AutoSave:             req.AutoSave,
		NotificationsEnabled: req.NotificationsEnabled,
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to update settings")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, settings)
}

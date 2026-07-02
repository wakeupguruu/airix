package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/wakeupguruu/airix/internal/config"
	"github.com/wakeupguruu/airix/internal/db"
	"github.com/wakeupguruu/airix/internal/utils"
)

type MaintenanceHandler struct {
	Q  *db.Queries
	S3 *config.S3Client
	// AI *config.AIClient // uncomment when Python AI backend is ready
}

func NewMaintenanceHandler(q *db.Queries, s3 *config.S3Client) *MaintenanceHandler {
	return &MaintenanceHandler{Q: q, S3: s3}
}


type CreateManagementReq struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Type        string          `json:"type"` 
	SensorData  json.RawMessage `json:"sensor_data"`
}

type UpdateManagementReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AnalyseReq struct {
	Prompt         string `json:"prompt"`
	AttachmentText string `json:"attachment_text"`
}


func (h *MaintenanceHandler) CreateManagement(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	var req CreateManagementReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	validTypes := map[string]bool{"DRONE": true, "AIRCRAFT": true, "FIGHTER_JET": true, "OTHER": true}
	if !validTypes[req.Type] {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid type: must be DRONE, AIRCRAFT, FIGHTER_JET, or OTHER")
		return
	}

	var sensorData []byte
	if req.SensorData != nil {
		sensorData = []byte(req.SensorData)
	}

	management, err := h.Q.CreateManagement(r.Context(), db.CreateManagementParams{
		UserID:      userID,
		Name:        req.Name,
		Description: pgtype.Text{String: req.Description, Valid: req.Description != ""},
		Type:        req.Type,
		SensorData:  sensorData,
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create management record")
		return
	}

	utils.ResponseWithJSON(w, http.StatusCreated, management)
}


func (h *MaintenanceHandler) ListManagements(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	q        := r.URL.Query()
	typeFilter := q.Get("type")
	search    := q.Get("search")
	page     := int32(1)
	limit    := int32(20)

	rows, err := h.Q.GetManagementsFiltered(r.Context(), db.GetManagementsFilteredParams{
		UserID:    userID,
		Type:      pgtype.Text{String: typeFilter, Valid: typeFilter != ""},
		Search:    pgtype.Text{String: search, Valid: search != ""},
		LimitVal:  limit,
		OffsetVal: (page - 1) * limit,
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to list managements")
		return
	}

	total, err := h.Q.CountManagementsFiltered(r.Context(), db.CountManagementsFilteredParams{
		UserID: userID,
		Type:   pgtype.Text{String: typeFilter, Valid: typeFilter != ""},
		Search: pgtype.Text{String: search, Valid: search != ""},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to count managements")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
		"managements": rows,
		"total":       total,
		"page":        page,
		"limit":       limit,
	})
}


func (h *MaintenanceHandler) GetManagement(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	management, err := h.Q.GetManagementByID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "management record not found")
		return
	}
	if management.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, management)
}


func (h *MaintenanceHandler) UpdateManagement(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	existing, err := h.Q.GetManagementByID(r.Context(), id)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req UpdateManagementReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	management, err := h.Q.UpdateManagement(r.Context(), db.UpdateManagementParams{
		ID:          id,
		Name:        req.Name,
		Description: pgtype.Text{String: req.Description, Valid: req.Description != ""},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to update management record")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, management)
}


func (h *MaintenanceHandler) DeleteManagement(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	existing, err := h.Q.GetManagementByID(r.Context(), id)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	if err := h.Q.DeleteManagement(r.Context(), id); err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to delete management record")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, map[string]string{"message": "management record deleted"})
}


func (h *MaintenanceHandler) GetChats(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	existing, err := h.Q.GetManagementByID(r.Context(), id)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	chats, err := h.Q.GetManagementChatsByManagementID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to fetch chats")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, chats)
}


func (h *MaintenanceHandler) Analyse(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	managementID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	management, err := h.Q.GetManagementByID(r.Context(), managementID)
	if err != nil || management.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req AnalyseReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Prompt == "" {
		utils.ResponseWithError(w, http.StatusBadRequest, "prompt is required")
		return
	}

	
	userChat, err := h.Q.CreateManagementChat(r.Context(), db.CreateManagementChatParams{
		ManagementID:   managementID,
		UserID:         userID,
		Role:           "user",
		Type:           "text",
		Content:        req.Prompt,
		Status:         pgtype.Text{String: "done", Valid: true},
		AttachmentText: pgtype.Text{String: req.AttachmentText, Valid: req.AttachmentText != ""},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save message")
		return
	}

	
	assistantChat, err := h.Q.CreateManagementChat(r.Context(), db.CreateManagementChatParams{
		ManagementID: managementID,
		UserID:       userID,
		Role:         "assistant",
		Type:         "analysis",
		Content:      "",
		Status:       pgtype.Text{String: "pending", Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create analysis row")
		return
	}

	// ── AI gRPC call (uncomment when Python AI backend is ready) ──────────────
	// history, _ := h.Q.GetManagementChatsByManagementID(r.Context(), managementID)
	// msgs := make([]*aipb.ChatMessage, 0, len(history))
	// for _, c := range history {
	//     msgs = append(msgs, &aipb.ChatMessage{Role: c.Role, Content: c.Content})
	// }
	// sensorJSON, _ := json.Marshal(management.SensorData)
	// aiResp, err := h.AI.Client.MaintenanceAnalyse(r.Context(), &aipb.MaintenanceAnalyseRequest{
	//     ManagementId:       managementID.String(),
	//     VehicleType:        management.Type,
	//     History:            msgs,
	//     Prompt:             req.Prompt,
	//     AttachmentText:     req.AttachmentText,
	//     PreviousSensorData: string(sensorJSON),
	//     ChatId:             assistantChat.ID.String(),
	// })
	// if err != nil {
	//     h.Q.UpdateManagementChatStatus(r.Context(), db.UpdateManagementChatStatusParams{
	//         ID:     assistantChat.ID,
	//         Status: pgtype.Text{String: "failed", Valid: true},
	//     })
	//     utils.ResponseWithError(w, http.StatusInternalServerError, "AI analysis failed")
	//     return
	// }
	// // Update chat row with AI response
	// updated, _ := h.Q.UpdateManagementChatStatus(r.Context(), db.UpdateManagementChatStatusParams{
	//     ID:               assistantChat.ID,
	//     Status:           pgtype.Text{String: "done", Valid: true},
	//     Content:          aiResp.Content,
	//     AnalysisSnapshot: []byte(aiResp.AnalysisSnapshot),
	// })
	// // Also update the management record's analysis_result for latest snapshot
	// h.Q.UpdateManagementAnalysis(r.Context(), db.UpdateManagementAnalysisParams{
	//     ID:             managementID,
	//     AnalysisResult: []byte(aiResp.AnalysisSnapshot),
	// })
	// utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
	//     "user_message":      userChat,
	//     "assistant_message": updated,
	// })
	// return
	// ─────────────────────────────────────────────────────────────────────────

	utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
		"user_message":      userChat,
		"assistant_message": assistantChat,
		"note":              "AI backend not connected yet — stub response",
	})
}


func (h *MaintenanceHandler) UploadSensorFile(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	managementID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid management id")
		return
	}

	existing, err := h.Q.GetManagementByID(r.Context(), managementID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	if err := r.ParseMultipartForm(50 << 20); err != nil { // 50MB max
		utils.ResponseWithError(w, http.StatusBadRequest, "file too large (max 50MB)")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "missing 'file' field")
		return
	}
	defer file.Close()

	
	key := "airix/" + userID.String() + "/assets/" + managementID.String() + "/" + header.Filename
	s3URL, err := h.S3.UploadFile(r.Context(), key, file)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to upload file to S3")
		return
	}

	
	chat, err := h.Q.CreateManagementChat(r.Context(), db.CreateManagementChatParams{
		ManagementID:  managementID,
		UserID:        userID,
		Role:          "user",
		Type:          "file",
		Content:       header.Filename,
		Status:        pgtype.Text{String: "done", Valid: true},
		AttachmentUrl: pgtype.Text{String: s3URL, Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save file record")
		return
	}

	utils.ResponseWithJSON(w, http.StatusCreated, map[string]interface{}{
		"s3_url":  s3URL,
		"chat_id": chat.ID,
		"message": "File uploaded. Pass attachment_text to /analyse after extracting CSV/PDF content.",
	})
}

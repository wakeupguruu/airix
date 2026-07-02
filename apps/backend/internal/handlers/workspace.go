package handlers

import (
	"encoding/json"
	"net/http"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/wakeupguruu/airix/internal/auth"
	"github.com/wakeupguruu/airix/internal/config"
	"github.com/wakeupguruu/airix/internal/db"
	aipb "github.com/wakeupguruu/airix/internal/pb/ai"
	"github.com/wakeupguruu/airix/internal/utils"
)

type WorkspaceHandler struct {
	Q  *db.Queries
	S3 *config.S3Client
	AI *config.AIClient
}

func NewWorkspaceHandler(q *db.Queries, s3 *config.S3Client, ai *config.AIClient) *WorkspaceHandler {
	return &WorkspaceHandler{Q: q, S3: s3, AI: ai}
}


type CreateWorkspaceReq struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type UpdateWorkspaceReq struct {
	Name      string          `json:"name"`
	Status    string          `json:"status"`
	SceneJSON json.RawMessage `json:"scene_json"` 
}

type DesignChatReq struct {
	Prompt    string          `json:"prompt"`
	SceneJSON json.RawMessage `json:"scene_json"`
}

type GenerateReq struct {
	Mode     string `json:"mode"`      
	Prompt   string `json:"prompt"`    
	ImageURL string `json:"image_url"` 
}

type ConceptReq struct {
	Prompt string `json:"prompt"`
}


func claimsUserID(r *http.Request) (uuid.UUID, error) {
	claims := r.Context().Value(auth.ClaimsKey).(*auth.Claims)
	return uuid.Parse(claims.UserId)
}



func (h *WorkspaceHandler) CreateWorkspace(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	var req CreateWorkspaceReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	validTypes := map[string]bool{"blank": true, "image_to_model": true, "text_to_model": true, "concept_studio": true}
	if !validTypes[req.Type] {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid type: must be blank, image_to_model, text_to_model, or concept_studio")
		return
	}

	workspace, err := h.Q.CreateWorkspace(r.Context(), db.CreateWorkspaceParams{
		UserID: userID,
		Name:   req.Name,
		Type:   req.Type,
		Status: "draft",
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create workspace")
		return
	}

	utils.ResponseWithJSON(w, http.StatusCreated, workspace)
}


func (h *WorkspaceHandler) ListWorkspaces(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	q := r.URL.Query()
	typeFilter  := q.Get("type")
	statusFilter := q.Get("status")
	search      := q.Get("search")
	page        := int32(1)
	limit       := int32(20)

	rows, err := h.Q.GetWorkspacesFiltered(r.Context(), db.GetWorkspacesFilteredParams{
		UserID:    userID,
		Type:      pgtype.Text{String: typeFilter, Valid: typeFilter != ""},
		Status:    pgtype.Text{String: statusFilter, Valid: statusFilter != ""},
		Search:    pgtype.Text{String: search, Valid: search != ""},
		LimitVal:  limit,
		OffsetVal: (page - 1) * limit,
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to list workspaces")
		return
	}

	total, err := h.Q.CountWorkspacesFiltered(r.Context(), db.CountWorkspacesFilteredParams{
		UserID: userID,
		Type:   pgtype.Text{String: typeFilter, Valid: typeFilter != ""},
		Status: pgtype.Text{String: statusFilter, Valid: statusFilter != ""},
		Search: pgtype.Text{String: search, Valid: search != ""},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to count workspaces")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
		"workspaces": rows,
		"total":      total,
		"page":       page,
		"limit":      limit,
	})
}


func (h *WorkspaceHandler) GetWorkspace(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	workspace, err := h.Q.GetWorkspaceByID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "workspace not found")
		return
	}

	if workspace.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, workspace)
}


func (h *WorkspaceHandler) UpdateWorkspace(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "workspace not found")
		return
	}
	if existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req UpdateWorkspaceReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	var sceneJSON []byte
	if req.SceneJSON != nil {
		sceneJSON = []byte(req.SceneJSON)
	}

	workspace, err := h.Q.UpdateWorkspace(r.Context(), db.UpdateWorkspaceParams{
		ID:        id,
		Name:      req.Name,
		Status:    req.Status,
		SceneJson: sceneJSON,
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to update workspace")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, workspace)
}


func (h *WorkspaceHandler) DeleteWorkspace(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "workspace not found")
		return
	}
	if existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	if err := h.Q.DeleteWorkspace(r.Context(), id); err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to delete workspace")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, map[string]string{"message": "workspace deleted"})
}



func (h *WorkspaceHandler) GetChats(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	
	existing, err := h.Q.GetWorkspaceByID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusNotFound, "workspace not found")
		return
	}
	if existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	chats, err := h.Q.GetWorkspaceChatsByWorkspaceID(r.Context(), id)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to fetch chats")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, chats)
}


func (h *WorkspaceHandler) DesignChat(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req DesignChatReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Prompt == "" {
		utils.ResponseWithError(w, http.StatusBadRequest, "prompt is required")
		return
	}

	
	userChat, err := h.Q.CreateWorkspaceChat(r.Context(), db.CreateWorkspaceChatParams{
		WorkspaceID:   workspaceID,
		UserID:        userID,
		Role:          "user",
		Type:          "text",
		Content:       req.Prompt,
		ModelSnapshot: req.SceneJSON,
		Status:        pgtype.Text{String: "done", Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save message")
		return
	}

	
	assistantChat, err := h.Q.CreateWorkspaceChat(r.Context(), db.CreateWorkspaceChatParams{
		WorkspaceID: workspaceID,
		UserID:      userID,
		Role:        "assistant",
		Type:        "text",
		Content:     "",
		Status:      pgtype.Text{String: "pending", Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create assistant row")
		return
	}

	history, _ := h.Q.GetWorkspaceChatsByWorkspaceID(r.Context(), workspaceID)
	msgs := make([]*aipb.ChatMessage, 0, len(history))
	for _, c := range history {
		if c.Role == "user" || c.Role == "assistant" {
			msgs = append(msgs, &aipb.ChatMessage{Role: c.Role, Content: c.Content})
		}
	}
	if len(msgs) > 10 {
		msgs = msgs[len(msgs)-10:]
	}
	aiResp, err := h.AI.Client.DesignChat(r.Context(), &aipb.DesignChatRequest{
		History:     msgs,
		Prompt:      req.Prompt,
		SceneJson:   string(req.SceneJSON),
		WorkspaceId: workspaceID.String(),
		ChatId:      assistantChat.ID.String(),
	})
	if err != nil {
		h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
			ID: assistantChat.ID, Status: pgtype.Text{String: "failed", Valid: true},
		})
		utils.ResponseWithError(w, http.StatusInternalServerError, "AI service unavailable")
		return
	}
	updated, _ := h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
		ID:      assistantChat.ID,
		Status:  pgtype.Text{String: "done", Valid: true},
		Content: aiResp.Content,
	})
	utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
		"user_message":       userChat,
		"assistant_message":  updated,
		"type":               aiResp.Type,
		"follow_up_question": aiResp.FollowUpQuestion,
		"job_id":             aiResp.JobId,
	})
}


func (h *WorkspaceHandler) Generate(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req GenerateReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Mode != "text_to_model" && req.Mode != "image_to_model" {
		utils.ResponseWithError(w, http.StatusBadRequest, "mode must be text_to_model or image_to_model")
		return
	}

	
	chatType := req.Mode
	content  := req.Prompt
	if req.Mode == "image_to_model" {
		content = req.ImageURL
	}

	pendingChat, err := h.Q.CreateWorkspaceChat(r.Context(), db.CreateWorkspaceChatParams{
		WorkspaceID: workspaceID,
		UserID:      userID,
		Role:        "user",
		Type:        chatType,
		Content:     content,
		ImageUrl:    pgtype.Text{String: req.ImageURL, Valid: req.ImageURL != ""},
		Status:      pgtype.Text{String: "pending", Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to create job record")
		return
	}

	aiResp, err := h.AI.Client.Generate(r.Context(), &aipb.GenerateRequest{
		Mode:        req.Mode,
		Prompt:      req.Prompt,
		ImageUrl:    req.ImageURL,
		ChatId:      pendingChat.ID.String(),
		WorkspaceId: workspaceID.String(),
	})
	if err != nil {
		h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
			ID: pendingChat.ID, Status: pgtype.Text{String: "failed", Valid: true},
		})
		utils.ResponseWithError(w, http.StatusInternalServerError, "AI generation failed")
		return
	}
	h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
		ID:      pendingChat.ID,
		Status:  pgtype.Text{String: aiResp.Status, Valid: true},
		Content: "Generation started",
	})
	utils.ResponseWithJSON(w, http.StatusAccepted, map[string]interface{}{
		"job_id":  aiResp.JobId,
		"chat_id": pendingChat.ID,
		"status":  aiResp.Status,
	})
}


// GenerateStatus polls the AI backend for a generation job. When the job is
// done it stores the model and marks the chat row.
// GET /workspaces/{id}/generate/status?job_id=...&chat_id=...
func (h *WorkspaceHandler) GenerateStatus(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	jobID := r.URL.Query().Get("job_id")
	chatID, err := uuid.Parse(r.URL.Query().Get("chat_id"))
	if jobID == "" || err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "job_id and chat_id query params required")
		return
	}

	aiResp, err := h.AI.Client.GenerateStatus(r.Context(), &aipb.GenerateStatusRequest{
		JobId:  jobID,
		ChatId: chatID.String(),
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "AI status poll failed")
		return
	}

	resp := map[string]interface{}{
		"status":    aiResp.Status,
		"model_url": aiResp.ModelUrl,
		"chat_id":   chatID,
	}

	switch aiResp.Status {
	case "done":
		model, err := h.Q.CreateWorkspaceModel(r.Context(), db.CreateWorkspaceModelParams{
			WorkspaceID: workspaceID,
			UserID:      userID,
			Name:        pgtype.Text{String: "AI generated model", Valid: true},
			S3Url:       aiResp.ModelUrl,
			Source:      "ai_generated",
		})
		if err == nil {
			h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
				ID:            chatID,
				Status:        pgtype.Text{String: "done", Valid: true},
				Content:       "Generation complete",
				ResultModelID: pgtype.UUID{Bytes: model.ID, Valid: true},
			})
			resp["model_id"] = model.ID
		}
	case "failed":
		h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
			ID:      chatID,
			Status:  pgtype.Text{String: "failed", Valid: true},
			Content: "Generation failed",
		})
	}

	utils.ResponseWithJSON(w, http.StatusOK, resp)
}


func (h *WorkspaceHandler) ConceptImages(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	var req ConceptReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Prompt == "" {
		utils.ResponseWithError(w, http.StatusBadRequest, "prompt is required")
		return
	}

	
	pendingChat, err := h.Q.CreateWorkspaceChat(r.Context(), db.CreateWorkspaceChatParams{
		WorkspaceID: workspaceID,
		UserID:      userID,
		Role:        "user",
		Type:        "text",
		Content:     req.Prompt,
		Status:      pgtype.Text{String: "pending", Valid: true},
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save chat")
		return
	}

	aiResp, err := h.AI.Client.ConceptImages(r.Context(), &aipb.ConceptImagesRequest{
		Prompt:      req.Prompt,
		WorkspaceId: workspaceID.String(),
		ChatId:      pendingChat.ID.String(),
	})
	if err != nil {
		h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
			ID: pendingChat.ID, Status: pgtype.Text{String: "failed", Valid: true},
		})
		utils.ResponseWithError(w, http.StatusInternalServerError, "AI service unavailable")
		return
	}
	h.Q.UpdateWorkspaceChatStatus(r.Context(), db.UpdateWorkspaceChatStatusParams{
		ID:      pendingChat.ID,
		Status:  pgtype.Text{String: "done", Valid: true},
		Content: req.Prompt,
	})
	utils.ResponseWithJSON(w, http.StatusOK, map[string]interface{}{
		"images":  aiResp.Images,
		"chat_id": pendingChat.ID,
	})
}


func (h *WorkspaceHandler) ImportModel(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	if err := r.ParseMultipartForm(100 << 20); err != nil { 
		utils.ResponseWithError(w, http.StatusBadRequest, "file too large (max 100MB)")
		return
	}

	file, header, err := r.FormFile("model")
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "missing 'model' file field")
		return
	}
	defer file.Close()

	
	ext := filepath.Ext(header.Filename)
	validExts := map[string]bool{".glb": true, ".obj": true, ".fbx": true, ".gltf": true}
	if !validExts[ext] {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid file type: only .glb, .obj, .fbx, .gltf allowed")
		return
	}

	
	key := "airix/" + userID.String() + "/assets/" + workspaceID.String() + "/" + header.Filename
	s3URL, err := h.S3.UploadFile(r.Context(), key, file)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to upload model to S3")
		return
	}

	
	modelName := r.FormValue("name")
	if modelName == "" {
		modelName = header.Filename
	}

	model, err := h.Q.CreateWorkspaceModel(r.Context(), db.CreateWorkspaceModelParams{
		WorkspaceID: workspaceID,
		UserID:      userID,
		Name:        pgtype.Text{String: modelName, Valid: true},
		S3Url:       s3URL,
		Source:      "manual",
	})
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to save model record")
		return
	}

	utils.ResponseWithJSON(w, http.StatusCreated, model)
}


func (h *WorkspaceHandler) ListModels(w http.ResponseWriter, r *http.Request) {
	userID, err := claimsUserID(r)
	if err != nil {
		utils.ResponseWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}

	workspaceID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		utils.ResponseWithError(w, http.StatusBadRequest, "invalid workspace id")
		return
	}

	existing, err := h.Q.GetWorkspaceByID(r.Context(), workspaceID)
	if err != nil || existing.UserID != userID {
		utils.ResponseWithError(w, http.StatusForbidden, "access denied")
		return
	}

	models, err := h.Q.GetWorkspaceModelsByWorkspaceID(r.Context(), workspaceID)
	if err != nil {
		utils.ResponseWithError(w, http.StatusInternalServerError, "failed to fetch models")
		return
	}

	utils.ResponseWithJSON(w, http.StatusOK, models)
}

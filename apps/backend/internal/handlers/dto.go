package handlers

import (
	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/wakeupguruu/airix/internal/db"
)

// UserResponse is a Data Transfer Object (DTO) that defines exactly what
// fields of a User are safely exposed to the client. This specifically
// omits the Password field which should never be sent over the wire.
type UserResponse struct {
	ID            uuid.UUID          `json:"id"`
	Username      string             `json:"username"`
	FullName      pgtype.Text        `json:"full_name"`
	Email         string             `json:"email"`
	ContactNumber pgtype.Text        `json:"contact_number"`
	GoogleID      pgtype.Text        `json:"google_id"`
	ProfileImage  pgtype.Text        `json:"profile_image"`
	Plan          string             `json:"plan"`
	CreatedAt     pgtype.Timestamptz `json:"created_at"`
	UpdatedAt     pgtype.Timestamptz `json:"updated_at"`
}

// ToUserResponse converts a database User model to an API UserResponse DTO.
func ToUserResponse(user db.User) UserResponse {
	return UserResponse{
		ID:            user.ID,
		Username:      user.Username,
		FullName:      user.FullName,
		Email:         user.Email,
		ContactNumber: user.ContactNumber,
		GoogleID:      user.GoogleID,
		ProfileImage:  user.ProfileImage,
		Plan:          user.Plan,
		CreatedAt:     user.CreatedAt,
		UpdatedAt:     user.UpdatedAt,
	}
}

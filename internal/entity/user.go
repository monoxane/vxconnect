package entity

import (
	"time"

	"gorm.io/plugin/soft_delete"
)

type LoginBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Username string   `json:"username"`
	Token    string   `json:"token"`
	Role     string   `json:"role"`
	Zones    []string `json:"zones"`
}

type User struct {
	ID           string                `json:"id" gorm:"<-:create"`
	Username     string                `json:"username" gorm:"unique;<-:create"`
	PasswordHash string                `json:"-"`
	Role         string                `json:"role"`
	Zones        []string              `json:"zones" gorm:"serializer:json"`
	CreatedAt    time.Time             `json:"created_at"`
	UpdatedAt    time.Time             `json:"updated_at"`
	DeletedAt    soft_delete.DeletedAt `json:"deleted_at"`
}

type NewUserBody struct {
	User
	Password string `json:"password"`
}

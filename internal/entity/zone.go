package entity

import (
	"time"

	"gorm.io/plugin/soft_delete"
)

type Zone struct {
	ID        string                `json:"id" gorm:"primaryKey"`
	Name      string                `json:"name" gorm:"unique;<-:create"`
	CreatedAt time.Time             `json:"created_at"`
	UpdatedAt int                   `json:"updated_at"`
	DeletedAt soft_delete.DeletedAt `json:"deleted_at"`
}

type Record struct {
	ID        string    `json:"id" gorm:"primaryKey;<-:create"`
	ZoneID    string    `json:"zone_id" gorm:"<-:create"`
	Name      string    `json:"name" gorm:"unique;<-:create"`
	Type      string    `json:"type"`
	Target    string    `json:"target"`
	TTL       int       `json:"ttl"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt int       `json:"updated_at"`
}

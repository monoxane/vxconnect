package persistance

import (
	"github.com/monoxane/vxconnect/internal/entity"
)

type Store interface {
	Migrate() error

	GetUsers() ([]*entity.User, error)
	GetUserById(id string) (*entity.User, error)
	GetUserByUsername(username string) (*entity.User, error)
	CreateUser(user *entity.User) error
	SaveUser(user *entity.User) error
	DeleteUser(id string) error
}

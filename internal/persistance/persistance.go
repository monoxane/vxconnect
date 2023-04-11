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

	GetZones() ([]*entity.Zone, error)
	GetZoneByID(id string) (*entity.Zone, error)
	CreateZone(zone *entity.Zone) error
	SaveZone(zone *entity.Zone) error
	DeleteZone(id string) error
	DeleteZoneRecords(id string) error

	GetZoneRecords(zone string) ([]*entity.Record, error)
	GetRecordByID(id string) (*entity.Record, error)
	CreateRecord(record *entity.Record) error
	SaveRecord(record *entity.Record) error
	DeleteRecord(id string) error
}

package persistance

import (
	"errors"
	"fmt"

	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/logging"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type MariaDBStore struct {
	hostname     string
	port         int
	username     string
	password     string
	databaseName string
	connection   *gorm.DB
	log          logging.Logger
}

func NewMariaDBStore(host string, port int, user, pass, name string) (*MariaDBStore, error) {
	store := &MariaDBStore{
		hostname:     host,
		port:         port,
		username:     user,
		password:     pass,
		databaseName: name,
		log:          logging.Log.With().Str("package", "persistance").Str("store", "mariadb").Str("host", host).Logger(),
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", store.username, store.password, store.hostname, store.port, store.databaseName)
	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("unable to connect to MariaDB server: %s", err)
	}

	store.connection = conn

	store.log.Info().Msg("connected to Mariadb server")

	return store, nil
}

func (s *MariaDBStore) Migrate() error {
	var err error
	err = s.connection.AutoMigrate(&entity.User{})
	err = s.connection.AutoMigrate(&entity.Zone{})
	err = s.connection.AutoMigrate(&entity.Record{})

	if err != nil {
		return fmt.Errorf("unable to migrate entity: %s", err)
	}

	s.log.Info().Msg("migrated entities")
	return nil
}

func (s *MariaDBStore) CreateUser(user *entity.User) error {
	result := s.connection.Create(user)

	return result.Error
}

func (s *MariaDBStore) GetUsers() ([]*entity.User, error) {
	users := []*entity.User{}
	result := s.connection.Find(&users)

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for users: %s", result.Error)
	}

	return users, nil
}

func (s *MariaDBStore) GetUserById(id string) (*entity.User, error) {
	user := &entity.User{}
	result := s.connection.First(user, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("user not found: %s", result.Error)
	}

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for user by id: %s", result.Error)
	}

	return user, nil
}

func (s *MariaDBStore) GetUserByUsername(username string) (*entity.User, error) {
	user := &entity.User{}
	result := s.connection.First(user, "username = ?", username)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("username not found: %s", result.Error)
	}

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for user by username: %s", result.Error)
	}

	return user, nil
}

func (s *MariaDBStore) SaveUser(user *entity.User) error {
	result := s.connection.Save(user)

	return result.Error
}

func (s *MariaDBStore) DeleteUser(id string) error {
	result := s.connection.Delete(&entity.User{}, "id = ?", id)

	return result.Error
}

func (s *MariaDBStore) GetZones() ([]*entity.Zone, error) {
	zones := []*entity.Zone{}
	result := s.connection.Find(&zones)

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for zones: %s", result.Error)
	}

	return zones, nil
}

func (s *MariaDBStore) GetZoneByID(id string) (*entity.Zone, error) {
	zone := &entity.Zone{}
	result := s.connection.First(zone, "id = ?", id)

	if result.Error != nil {
		return nil, result.Error
	}

	return zone, nil
}

func (s *MariaDBStore) CreateZone(zone *entity.Zone) error {
	result := s.connection.Create(zone)

	return result.Error
}

func (s *MariaDBStore) SaveZone(zone *entity.Zone) error {
	result := s.connection.Save(zone)

	return result.Error
}

func (s *MariaDBStore) DeleteZone(id string) error {
	result := s.connection.Delete(&entity.Zone{}, "id = ?", id)

	return result.Error
}

func (s *MariaDBStore) DeleteZoneRecords(zone string) error {
	result := s.connection.Delete(&entity.Record{}, "zone_id = ?", zone)

	return result.Error
}

func (s *MariaDBStore) GetZoneRecords(zone string) ([]*entity.Record, error) {
	records := []*entity.Record{}
	result := s.connection.Find(&records, "zone_id = ?", zone)

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for zone records: %s", result.Error)
	}

	return records, nil
}

func (s *MariaDBStore) GetRecordByID(id string) (*entity.Record, error) {
	record := &entity.Record{}
	result := s.connection.First(&record, "id = ?", id)

	if result.Error != nil {
		return nil, fmt.Errorf("unable to query DB for zone records: %s", result.Error)
	}

	return record, nil
}

func (s *MariaDBStore) CreateRecord(record *entity.Record) error {
	result := s.connection.Create(record)

	return result.Error
}

func (s *MariaDBStore) SaveRecord(record *entity.Record) error {
	result := s.connection.Save(record)

	return result.Error
}

func (s *MariaDBStore) DeleteRecord(id string) error {
	result := s.connection.Delete(&entity.Record{}, "id = ?", id)

	return result.Error
}

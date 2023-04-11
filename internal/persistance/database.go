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

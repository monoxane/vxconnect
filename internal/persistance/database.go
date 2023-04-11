package persistance

import (
	"fmt"

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
}

func NewMariaDBStore(host string, port int, user, pass, database string) (*MariaDBStore, error) {
	store := &MariaDBStore{
		hostname: host,
		port:     port,
		username: user,
		password: pass,
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", store.username, store.password, store.hostname, store.port, store.databaseName)
	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("unable to connect to MariaDB server: %s", err)
	}

	store.connection = conn

	return store, nil
}

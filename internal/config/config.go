package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

var (
	AppMode  string = "PROD"
	LogLevel string = "INFO"

	JWTSecret string

	PersistenceDriver string
	MariaDBHost       string
	MariaDBPort       int
	MariaDBUsername   string
	MariaDBPassword   string
	DatabaseName      string
)

func Load() bool {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
		} else {
			fmt.Printf("Error reading configuration file: %s\n", err)
			return false
		}
	}

	if viper.IsSet("APP_MODE") {
		AppMode = viper.GetString("APP_MODE")
		log.Printf("[ENV] Application Mode: %s", AppMode)
	}

	if viper.IsSet("LOG_LEVEL") {
		LogLevel = viper.GetString("LOG_LEVEL")
		log.Printf("[ENV] Log Level: %s", LogLevel)
	}

	if viper.IsSet("JWT_SECRET") {
		JWTSecret = viper.GetString("JWT_SECRET")
		log.Printf("[ENV] JWT Secret Set")
	} else {
		log.Printf("[ENV] MISSING JWT_SECRET")
		return false
	}

	if viper.IsSet("PERSISTENCE_DRIVER") {
		PersistenceDriver = viper.GetString("PERSISTENCE_DRIVER")

		switch PersistenceDriver {
		case "mariadb":
			if viper.IsSet("MARIADB_HOST") {
				MariaDBHost = viper.GetString("MARIADB_HOST")
				log.Printf("[ENV] MariaDB Host Set")
			} else {
				log.Printf("[ENV] MISSING MARIADB_HOST")
				return false
			}

			if viper.IsSet("MARIADB_PORT") {
				MariaDBPort = viper.GetInt("MARIADB_PORT")
				log.Printf("[ENV] MariaDB Port Set")
			} else {
				log.Printf("[ENV] MISSING MARIADB_PORT")
				return false
			}

			if viper.IsSet("MARIADB_USERNAME") {
				MariaDBUsername = viper.GetString("MARIADB_USERNAME")
				log.Printf("[ENV] MariaDB Username Set")
			} else {
				log.Printf("[ENV] MISSING MARIADB_USERNAME")
				return false
			}

			if viper.IsSet("MARIADB_PASSWORD") {
				MariaDBPassword = viper.GetString("MARIADB_PASSWORD")
				log.Printf("[ENV] MariaDB Password Set")
			} else {
				log.Printf("[ENV] MISSING MARIADB_PASSWORD")
				return false
			}

			if viper.IsSet("DB_NAME") {
				DatabaseName = viper.GetString("DB_NAME")
				log.Printf("[ENV] MariaDB DB Name Set")
			} else {
				log.Printf("[ENV] MISSING DB_NAME")
				return false
			}

		default:
			log.Printf("[ENV] UNKNOWN PERSISTENCE DRIVER %s", PersistenceDriver)
			return false
		}
	} else {
		log.Printf("[ENV] NO PERSISTENCE DRIVER SPECIFIED")
		return false
	}

	return true
}

package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

var (
	AppMode  string = "PROD"
	LogLevel string = "INFO"
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

	return true
}

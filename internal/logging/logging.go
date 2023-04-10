package logging

import (
	"fmt"
	"os"

	"github.com/monoxane/dman/internal/config"

	"github.com/rs/zerolog"
	zlog "github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

type Logger = zerolog.Logger

var (
	Log Logger
)

var CallerPrettyfierFunc = func(pointer uintptr, file string, line int) string {
	var short string
	for i := len(file) - 1; i > 0; i-- {
		if file[i] == '/' {
			short = file[i+1:]
			break
		}
	}
	return fmt.Sprintf("%s:%d", short, line)
}

func Configure() {
	zerolog.TimeFieldFormat = "2006-01-02 15:04:05.000000"

	switch config.AppMode {
	case "DEV":
		Log = zlog.With().Caller().Timestamp().Logger().Output(zerolog.ConsoleWriter{Out: os.Stderr,
			TimeFormat: "2006-01-02 15:04:05.000000", FormatCaller: func(i interface{}) string {
				if s, ok := i.(string); ok {
					for i := len(s) - 1; i > 0; i-- {
						if s[i] == '/' {
							return s[i+1:]
						}
					}
				}

				return fmt.Sprintf("%s", i)
			}})
	default:
		zerolog.CallerFieldName = "caller"
		zerolog.CallerMarshalFunc = CallerPrettyfierFunc
		Log = zerolog.New(os.Stdout).With().Timestamp().Caller().Logger()
	}

	switch config.LogLevel {
	case "DEBUG":
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	case "INFO":
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	case "ERROR":
		zerolog.SetGlobalLevel(zerolog.ErrorLevel)
	default:
		fmt.Printf("%s is an invalid log level, setting to INFO\n", config.LogLevel)
	}

	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	Log.Info().Str("log_level", config.LogLevel).Str("app_mode", config.AppMode).Msg("logging configured")
}

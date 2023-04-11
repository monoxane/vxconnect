package entity

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
	Id           string   `json:"id"`
	Username     string   `json:"username" gorm:"unique,index"`
	PasswordHash string   `json:"-"`
	Role         string   `json:"role"`
	Zones        []string `json:"zones" gorm:"serializer:json"`
}

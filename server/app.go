package main

import (
	"log"

	"github.com/goa-go/goa"
	"github.com/goa-go/jwt"
	"github.com/goa-go/router"

	"clouds/config"
	"clouds/controllers/file"
	"clouds/controllers/user"
)

func main() {
	app := goa.New()
	r := router.New()

	r.POST("/api/users/register", user.Register)
	r.POST("/api/users/login", user.Login)
	r.POST("/api/users/checkToken", user.CheckToken)

	r.GET("/api/files", file.Get)
	r.POST("/api/files/upload", file.Upload)
	r.POST("/api/files/folder", file.NewFolder)
	r.DELETE("/api/files/:id", file.Delete)
	r.GET("/api/files/download", file.Download)

	app.Use(jwt.New(jwt.Options{
		Secret: config.TokenSecret,
		Unless: []string{"/api/users/login", "/api/users/register", "/api/users/checkToken"},
	}))
	app.Use(r.Routes())
	log.Fatal(app.Listen(":3001"))
}

package main

import (
	"log"

	"github.com/goa-go/goa"
	"github.com/goa-go/router"

	"clouds/controllers/file"
	"clouds/controllers/user"
)

func main() {
	app := goa.New()
	r := router.New()

	r.GET("/api", func(c *goa.Context) {
		c.String("Hello Goa!")
	})

	r.POST("/api/users/register", user.Register)
	r.POST("/api/users/login", user.Login)

	r.GET("/api/files", file.Get)
	r.POST("/api/files/upload", file.Upload)
	r.POST("/api/files/folder", file.NewFolder)
	r.DELETE("/api/files/:id", file.Delete)
	r.GET("/api/files/download", file.Download)

	app.Use(r.Routes())
	log.Fatal(app.Listen(":3001"))
}

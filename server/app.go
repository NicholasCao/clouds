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
	r.POST("/api/user/register", user.Register)
	r.POST("/api/user/login", user.Login)
	r.POST("/api/file/upload", file.Upload)
	r.DELETE("/api/file/upload", file.Delete)
	app.Use(r.Routes())
	log.Fatal(app.Listen(":3001"))
}

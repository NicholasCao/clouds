package main

import (
	"io"
	"log"
	"os"

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
	r.POST("/api/upload", func(c *goa.Context) {
		file, header, err := c.FormFile("file")
		log.Println("upload", c.PostForm("path"), c.PostForm("user"))
		if err != nil {
			//
		}
		dst, err := os.Create("store/" + header.Filename)
		if err != nil {
			//
		}
		_, err = io.Copy(dst, file)
		if err != nil {
			//
		}
		c.String("ok")
	})
	r.POST("/api/user/register", user.Register)
	r.POST("/api/user/login", user.Login)
	r.POST("/api/file/upload", file.Upload)
	r.DELETE("/api/file/upload", file.Delete)
	app.Use(r.Routes())
	log.Fatal(app.Listen(":3001"))
}

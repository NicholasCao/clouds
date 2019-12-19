package file

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"clouds/db"
	"github.com/goa-go/goa"
	"gopkg.in/mgo.v2/bson"
)

type file struct {
	ID   bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	User string        `json:"user" bson:"user"`
	Path string        `json:"path" bson:"path"`
	Name string        `json:"name" bson:"name"`
}

type fileDetail struct {
	Type         string `json:"type" bson:"type"`
	Size         string `json:"size" bson:"size"`
	LastModified string `json:"last_modified" bson:"last_modified"`
}

type f struct {
	ID           bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	User         string        `json:"user" bson:"user"`
	Path         string        `json:"path" bson:"path"`
	Name         string        `json:"name" bson:"name"`
	Type         string        `json:"type" bson:"type"`
	Size         string        `json:"size" bson:"size"`
	LastModified string        `json:"last_modified" bson:"last_modified"`
}

// Get files.
func Get(c *goa.Context) {
	user := c.Query("user")
	path := c.Query("path")
	result := &[]f{}
	err := db.FindAll("file", bson.M{
		"user": user,
		"path": path,
	}, nil, result)
	if err != nil {
		c.Status(500)
		c.JSON(goa.M{
			"msg": "get files failed: " + err.Error(),
		})
	} else {
		c.JSON(goa.M{
			"msg":    "success",
			"result": result,
		})
	}
}

// Upload a file.
// If file already exists, Upload replaces it.
func Upload(c *goa.Context) {
	uploadFile, header, err := c.FormFile("file")
	user := c.PostForm("user")
	path := c.PostForm("path")
	lastModified := c.PostForm("lastModified")

	if err != nil {
		c.Status(500)
		c.JSON(goa.M{
			"msg": "upload failed: " + err.Error(),
		})
	}
	dst, err := os.Create("store/" + getFileName(user, path, header.Filename))
	if err != nil {
		c.Status(500)
		c.JSON(goa.M{
			"msg": "upload failed: " + err.Error(),
		})
	} else {
		_, err = io.Copy(dst, uploadFile)
		if err != nil {
			c.Status(500)
			c.JSON(goa.M{
				"msg": "upload failed: " + err.Error(),
			})
		} else {
			// change lastModified
			mtime, _ := time.ParseInLocation("2006-01-02 15:04:05", lastModified, time.Local)
			os.Chtimes("store/"+getFileName(user, path, header.Filename), time.Now(), mtime)
			f := file{
				User: user,
				Path: path,
				Name: header.Filename,
			}
			fd := fileDetail{
				Type:         getFileType(header.Filename),
				Size:         getFileSize(header.Size),
				LastModified: lastModified,
			}
			err = db.Upsert("file", f, bson.M{
				"$set": fd,
			})
			if err != nil {
				c.JSON(goa.M{
					"msg": "upload failed: " + err.Error(),
				})
			}
			c.JSON(goa.M{
				"msg": "success",
			})
		}
	}
}

// Download a file.
func Download(c *goa.Context) {
	user := c.Query("user")
	path := c.Query("path")
	fileName := c.Query("name")

	fileServer := http.FileServer(http.Dir("store"))
	c.URL.Path = getFileName(user, path, fileName)
	c.SetHeader("Content-Disposition", "attachment")
	fileServer.ServeHTTP(c.ResponseWriter, c.Request)
	c.Handled = true
}

// NewFolder creates a folder.
func NewFolder(c *goa.Context) {
	folder := &file{}
	c.ParseJSON(folder)

	err := db.Insert("file", f{
		User: folder.User,
		Path: folder.Path,
		Name: folder.Name,
		Type: "folder",
	})
	if err != nil {
		c.Status(500)
		c.JSON(goa.M{
			"msg": "create folder failed: " + err.Error(),
		})
	} else {
		c.JSON(goa.M{
			"msg": "success",
		})
	}
}

// Delete a file.
func Delete(c *goa.Context) {
	c.String("delete")
}

func getFileName(user, path, filename string) string {
	return user + strings.Replace(path, "/", "-", -1) + filename
}

func getFileType(fileName string) string {
	mime := path.Ext(fileName)[1:]
	switch mime {
	case "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx", "pdf", "wps":
		return "docs"
	case "png", "jpg", "gif", "pic", "bmp", "tif", "svg":
		return "picture"
	case "avi", "mpg", "mov", "mp4":
		return "video"
	case "wav", "mp3", "aif", "au", "ram", "wma", "mmf", "amr", "aac", "flac":
		return "music"
	default:
		return "file"
	}
}

func getFileSize(fileSize int64) string {
	size := float32(fileSize)
	sizes := []string{"B", "KB", "M", "G", "T"}
	i := 0
	for {
		if size < 1024 {
			return fmt.Sprintf("%.2f%s", size, sizes[i])
		}
		i++
		size /= 1024
	}
}

package file

import (
	"io"
	"os"
	"path"
	"strings"
	"fmt"

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
	Size         string  `json:"size" bson:"size"`
	LastModified string `json:"last_modified" bson:"last_modified"`
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
			c.JSON(goa.M{
				"msg": "upload failed: " + err.Error(),
			})
		} else {
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
	sizes := []string{"Bytes", "KB", "M", "G", "T"}
	i := 0
	for {
		if size < 1024 {
			return fmt.Sprintf("%.2f%s", size, sizes[i])
		}
		i++
		size /= 1024
	}
}

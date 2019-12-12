package file

import (
	"github.com/goa-go/goa"
	"gopkg.in/mgo.v2/bson"
	// "clouds/db"
)

type file struct {
	ID               bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name             string        `json:"name" bson:"name"`
	Type             string        `json:"type" bson:"type"`
	Size             string        `json:"size" bson:"size"`
	LastModifiedDate string        `json:"last_modified_date" bson:"last_modified_date"`
	User             string        `json:"user" bson:"user"`
	Path             string        `json:"path" bson:"path"`
}

// Upload a file.
func Upload(c *goa.Context) {
	c.String("upload")
}

// Delete a file.
func Delete(c *goa.Context) {
	c.String("delete")
}

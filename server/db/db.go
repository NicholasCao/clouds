package db

import (
	"log"
	"time"

	"gopkg.in/mgo.v2"
)

var globalS *mgo.Session

const db = "clouds"

func init() {
	dialInfo := &mgo.DialInfo{
		Addrs:   []string{"localhost:27017"}, //数据库地址 dbhost: mongodb://user@123456:127.0.0.1:27017
		Timeout: time.Second * 1,
		// Source:    authdb,                   // 设置权限的数据库 authdb: admin
		// Username:  authuser,                 // 设置的用户名 authuser: user
		// Password:  authpass,                // 设置的密码 authpass: 123456
		PoolLimit: 100, // 连接池的数量 poollimit: 100
	}

	s, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		log.Fatalf("Create Session: %s\n", err)
	}
	globalS = s
}

func connect(collection string) (*mgo.Session, *mgo.Collection) {
	ms := globalS.Copy()
	c := ms.DB(db).C(collection)
	ms.SetMode(mgo.Monotonic, true)
	return ms, c
}

// Insert inserts a doc to mongodb.
func Insert(collection string, doc interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	return c.Insert(doc)
}

// FindOne finds one that meets the query and bind to the result.
func FindOne(collection string, query, selector, result interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	return c.Find(query).Select(selector).One(result)
}

// FindAll finds all that meets the query and bind to the result.
func FindAll(collection string, query, selector, result interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	return c.Find(query).Select(selector).All(result)
}

// Update updates one that meets the selector, `$set` is usually used.
func Update(collection string, selector, update interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	return c.Update(selector, update)
}

// Upsert same as `Update`, but if doc is not found, will insert one.
func Upsert(collection string, selector, update interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	_, err := c.Upsert(selector, update)
	return err
}

// UpdateAll updates all that meets the selector, `$set` is usually used.
func UpdateAll(collection string, selector, update interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	_, err := c.UpdateAll(selector, update)
	return err
}

// Remove removes one that meets the selector.
func Remove(collection string, selector interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	return c.Remove(selector)
}

// RemoveAll removes all that meets the selector.
func RemoveAll(collection string, selector interface{}) error {
	ms, c := connect(collection)
	defer ms.Close()

	_, err := c.RemoveAll(selector)
	return err
}

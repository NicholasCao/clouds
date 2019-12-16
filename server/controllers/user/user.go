package user

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/goa-go/goa"
	"github.com/goa-go/goa/utils"
	"gopkg.in/mgo.v2/bson"

	"clouds/config"
	"clouds/db"
)

const priveKey = config.RsaPrivateKey

type user struct {
	ID       bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Username string        `json:"username" bson:"username"`
	Password string        `json:"password" bson:"password"`
}

type response struct {
	Msg   string `json:"msg"`
	Token string `json:"token,omitempty"`
}

// Login handles user login.
func Login(c *goa.Context) {
	loginUser := &user{}
	u := &user{}
	c.ParseJSON(loginUser)
	err := db.FindOne("user", bson.M{"username": loginUser.Username}, bson.M{}, u)
	if err != nil {
		if err.Error() == "not found" {
			c.Status(401)
			c.JSON(response{
				Msg: "username dosen't exist",
			})
		} else {
			c.Status(500)
			c.JSON(response{
				Msg: err.Error(),
			})
		}
	} else {
		psw, err := rsaDecrypt(priveKey, loginUser.Password)
		if err != nil {
			c.Status(500)
			c.JSON(response{
				Msg: err.Error(),
			})
		}
		if psw == u.Password {
			c.JSON(response{
				Msg:   "success",
				Token: getToken(),
			})
		} else {
			c.Status(401)
			c.JSON(response{
				Msg: "password is not correct",
			})
		}
	}
}

// Register handles user register.
func Register(c *goa.Context) {
	registerUser := &user{}
	u := &user{}
	c.ParseJSON(registerUser)
	err := db.FindOne("user", bson.M{"username": registerUser.Username}, bson.M{}, u)

	if err != nil {
		if err.Error() == "not found" {
			psw, err := rsaDecrypt(priveKey, registerUser.Password)
			if err != nil {
				c.Status(500)
				c.JSON(response{
					Msg: err.Error(),
				})
			}
			registerUser.Password = psw
			db.Insert("user", registerUser)
			c.JSON(response{
				Msg:   "success",
				Token: getToken(),
			})
		} else {
			c.Status(500)
			c.JSON(response{
				Msg: err.Error(),
			})
		}
	} else {
		// username existed
		c.Status(400)
		c.JSON(response{
			Msg: "username existed",
		})
	}
}

func getToken() string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iat": time.Now().Unix(),
		"exp": time.Now().AddDate(0, 0, 7).Unix(),
	})
	tokenString, _ := token.SignedString(utils.Str2Bytes(config.TokenSecret))
	return tokenString
}

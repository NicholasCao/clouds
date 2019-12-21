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
				Token: getToken(loginUser.Username),
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
	err := db.FindOne("user", bson.M{"username": registerUser.Username}, nil, u)

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
				Token: getToken(registerUser.Username),
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

type tokenRequest struct {
	Token string `json:"token"`
}

type tokenResponse struct {
	Msg      string `json:"msg"`
	Username string `json:"username,omitempty"`
}

// CheckToken make sure that user has passed authentication.
// And respond username to client.
func CheckToken(c *goa.Context) {
	t := &tokenRequest{}
	c.ParseJSON(t)

	token, err := jwt.Parse(t.Token, func(_ *jwt.Token) (interface{}, error) {
		return utils.Str2Bytes(config.TokenSecret), nil
	})

	if token != nil && token.Valid && err == nil {
		c.JSON(goa.M{
			"msg":      "success",
			"username": token.Claims.(jwt.MapClaims)["username"].(string),
		})
	} else {
		c.Status(401)
		c.JSON(goa.M{
			"msg": "check token failed",
		})
	}
}

func getToken(username string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iat":      time.Now().Local().Unix(),
		"exp":      time.Now().Local().AddDate(0, 0, 7).Unix(),
		"username": username,
	})
	tokenString, _ := token.SignedString(utils.Str2Bytes(config.TokenSecret))
	return tokenString
}

package user

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"

	"github.com/goa-go/goa/utils"
)

func rsaDecrypt(privateKey string, ciphertext string) (string, error) {
	block, _ := pem.Decode(utils.Str2Bytes(privateKey))
	if block == nil {
		return "", errors.New("private key error")
	}
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return "", err
	}
	b, _ := base64.StdEncoding.DecodeString(ciphertext)
	decrypt, err := rsa.DecryptPKCS1v15(rand.Reader, priv, b)
	return utils.Bytes2Str(decrypt), err
}

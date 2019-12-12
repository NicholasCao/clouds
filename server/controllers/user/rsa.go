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

// func rsaEncrypt(publicKey []byte, origData []byte) ([]byte, error) {
// 	block, _ := pem.Decode(publicKey)
// 	if block == nil {
// 		return nil, errors.New("public key error")
// 	}
// 	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
// 	if err != nil {
// 		return nil, err
// 	}
// 	pub := pubInterface.(*rsa.PublicKey)
// 	return rsa.EncryptPKCS1v15(rand.Reader, pub, origData)
// }

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

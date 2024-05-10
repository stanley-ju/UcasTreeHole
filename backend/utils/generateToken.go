package utils

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// 定义一个全局token密钥，token密钥随意定义一串字符串
var jwtkey = []byte("lskjdghfhkagflkagh")

// 定义字符串格式token，方便之后token的转化
var tokenString string

// 定义一个token模型，用于存放token信息，识别不同账号
type claims struct {
	UserId string
	jwt.StandardClaims
}

// 生成token
// 传入字符串格式用户id，输出字符串格式的token和错误值
func SetToken(id string) (tokenString string, err error) {
	//
	// 定义token过期时间，一天后过期
	expireTime := time.Now().Add(1 * 24 * time.Hour)
	claims := &claims{
		UserId: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(), // 过期时间，用上方定义的过期时间
			IssuedAt:  time.Now().Unix(), // 生效时间，生成token的这一刻起
			Issuer:    "127.0.0.1",       // 生成者，本域名
			Subject:   "user token",      // 生成主题
		},
	}
	// 生成token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// 根据之前定义的密钥，将token转化为加密字符串
	tokenString, err = token.SignedString(jwtkey)
	// 输出
	return
}

func GetToken() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 从请求头获取token值
		tokenString = ctx.GetHeader("Authorization")

		// 判断如果没有token
		if tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"respMessage": "您未登录"})
			// 中间件中使用next()就执行下一步，如果执行abort()就不会执行下一步
			ctx.Abort()
			return
		}

		// 去除authorization中的"bearer"
		tokenString = strings.Trim(tokenString, "bearer")
		// 去除authorization中的空格
		tokenString = strings.Replace(tokenString, " ", "", -1)
		fmt.Println(tokenString)

		// 判断token是否失效
		token, claims, err := ParseToken(tokenString)
		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"respMessage": "权限失效，请重新登录"})
			ctx.Abort()
			return
		}

		// 打印userid，既然定义这个值就必须使用，留下来以备以后的需要
		fmt.Println(claims.UserId)
		if claims.UserId != "" {
			// 如果没有token没问题，则退出中间件执行下一步
			ctx.Next()
		}
	}

}

// 解析字符串token中的信息
func ParseToken(tokenString string) (*jwt.Token, *claims, error) {
	claims := &claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (i interface{}, err error) {
		return jwtkey, nil
	})
	return token, claims, err
}

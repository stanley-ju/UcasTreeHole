package main

import (
	"backend/common"

	"github.com/gin-gonic/gin"
)

func main() {
	db := common.InitDB()
	sqlDB, err := db.DB()
	if err != nil {
		panic("failed to connect database,err: " + err.Error())
	}
	env := gin.Default()
	env.Static("/statics", "../statics")
	env = CollectRoute(env)
	defer sqlDB.Close()
	panic(env.Run(":8080"))
}

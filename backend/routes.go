package main

import (
	"backend/controller"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 解决跨域问题
func Core() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token,Authorization,Token")
		c.Header("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
		c.Header("Access-Control-Expose-Headers", "Content-Length,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Content-Type")
		c.Header("Access-Control-Allow-Credentials", "True")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		//处理请求
		c.Next()
	}
}

func CollectRoute(env *gin.Engine) *gin.Engine {
	env.Use(Core())

	//handler
	env.POST("/user/signup", controller.Register)
	env.POST("/user/login", controller.Login)

	env.Use(utils.GetToken())
	env.POST("/user/uploadAvatar", controller.UploadAvatar)
	env.POST("/user/changePassword", controller.ChangePassword)

	env.POST("/treehole/submitPost", controller.SubmitPost)
	env.POST("/treehole/commentPost", controller.CommentPost)
	env.POST("/treehole/queryPost", controller.QueryPost)
	env.POST("/treehole/querySinglePost", controller.QuerySinglePost)
	env.POST("/treehole/favoritePost", controller.FavoritePost)
	env.POST("/treehole/cancelFavoritePost", controller.CancelFavoritePost)
	env.POST("/treehole/queryFavoritePost", controller.QueryFavoritePost)
	env.POST("/treehole/queryPostWithKeyword", controller.QueryPostWithKeyword)
	env.POST("/treehole/queryHotPost", controller.QueryHotPost)
	env.POST("/treehole/queryUserPost", controller.QueryUserPost)
	env.POST("/treehole/deleteUserPost", controller.DeleteUserPost)
	env.POST("/treehole/deleteUserComment", controller.DeleteUserComment)
	return env
}

package controller

import (
	"backend/common"
	"backend/model"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(ctx *gin.Context) {
	db := common.GetDB()
	newStu := model.StudentInfo{
		StudentNumber: ctx.PostForm("student_number"),
		Password:      ctx.PostForm("password"),
		AvatarURL:     "tomcat:8080/statics/imgs/initAvatar.jpg",
	}
	var stu model.StudentInfo
	res := db.First(&stu, "student_number = ?", ctx.PostForm("student_number"))
	if res.RowsAffected == 0 {
		db.Create(&newStu)
		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":   newStu.AvatarURL,
			"respMessage": "success",
		})
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":   "",
			"respMessage": "用户已存在，注册失败！",
		})
	}
}

func Login(ctx *gin.Context) {
	db := common.GetDB()
	stu := model.StudentInfo{}
	res := db.First(&stu, "student_number = ?", ctx.PostForm("student_number"))
	if res.RowsAffected == 1 && stu.Password == ctx.PostForm("password") {
		userToken, err := utils.SetToken(stu.StudentNumber)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"avatarURL":   "",
				"respMessage": "token保存失败！",
			})
		}
		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":   stu.AvatarURL,
			"token":       userToken,
			"respMessage": "success",
		})
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":   "",
			"token":       "",
			"respMessage": "用户名或密码错误！",
		})
	}
}

func UploadAvatar(ctx *gin.Context) {
	avatar, err := ctx.FormFile("avatar")
	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":   "",
			"respMessage": "头像上传失败！",
		})
	} else {
		stuNum := ctx.PostForm("student_number")
		filepath := "./imgs/avatar_" + stuNum + ".jpg"
		avatar_url := "tomcat:8080/statics/imgs/avatar_" + stuNum + ".jpg"
		err = ctx.SaveUploadedFile(avatar, filepath)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"avatarURL":   "",
				"respMessage": "fail to save avatar",
			})
		}

		db := common.GetDB()
		db.Model(&model.StudentInfo{}).Where("student_number = ?", stuNum).Update("avatar_url", avatar_url)

		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":   avatar_url,
			"respMessage": "success",
		})
	}
}

func ChangePassword(ctx *gin.Context) {
	db := common.GetDB()
	stuNum := ctx.PostForm("student_number")
	confirmPassword := ctx.PostForm("confirmPassword")
	newPassword := ctx.PostForm("newPassword")

	user := model.StudentInfo{
		StudentNumber: stuNum,
	}
	result := db.First(&user)
	if result.Error != nil || user.Password != confirmPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		db.Model(&model.StudentInfo{}).Where("student_number = ?", stuNum).Update("password", newPassword)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "success",
		})
	}
}

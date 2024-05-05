package controller

import (
	"backend/common"
	"backend/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(ctx *gin.Context) {
	db := common.GetDB()
	newStu := model.StudentInfo{
		StudentNumber: ctx.PostForm("student_number"),
		Password:      ctx.PostForm("password"),
		AvatarURL:     "tomcat:8080/statics/imgs/initAvatar.jpg",
		BackgroundURL: "tomcat:8080/statics/imgs/initBackground.jpg",
	}
	var stu model.StudentInfo
	res := db.First(&stu, "student_number = ?", ctx.PostForm("student_number"))
	if res.RowsAffected == 0 {
		db.Create(&newStu)
		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":     newStu.AvatarURL,
			"backgroundURL": newStu.BackgroundURL,
			"respMessage":   "success",
		})
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":     "",
			"backgroundURL": "",
			"respMessage":   "fail",
		})
	}
}

func Login(ctx *gin.Context) {
	db := common.GetDB()
	stu := model.StudentInfo{}
	res := db.First(&stu, "student_number = ?", ctx.PostForm("student_number"))
	if res.RowsAffected == 1 && stu.Password == ctx.PostForm("password") {
		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":     stu.AvatarURL,
			"backgroundURL": stu.BackgroundURL,
			"respMessage":   "success",
		})
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":     "",
			"backgroundURL": "",
			"respMessage":   "fail",
		})
	}
}

func UploadAvatar(ctx *gin.Context) {
	avatar, err := ctx.FormFile("avatar")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"avatarURL":   "",
			"respMessage": "fail",
		})
	} else {
		stuNum := ctx.PostForm("student_number")
		filepath := "../imgs/avatar_" + stuNum + ".jpg"
		avatar_url := "tomcat:8080/statics/imgs/avatar_" + stuNum + ".jpg"
		ctx.SaveUploadedFile(avatar, filepath)

		db := common.GetDB()
		db.Model(&model.StudentInfo{}).Where("student_number = ?", stuNum).Update("avatar_url", avatar_url)

		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":   avatar_url,
			"respMessage": "success",
		})
	}
}

func UploadBackground(ctx *gin.Context) {
	avatar, err := ctx.FormFile("background")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"backgroundURL": "",
			"respMessage":   "fail",
		})
	} else {
		stuNum := ctx.PostForm("student_number")
		filepath := "../imgs/background_" + stuNum + ".jpg"
		background_url := "tomcat:8080/statics/imgs/background_" + stuNum + ".jpg"
		ctx.SaveUploadedFile(avatar, filepath)

		db := common.GetDB()
		db.Model(&model.StudentInfo{}).Where("student_number = ?", stuNum).Update("background_url", background_url)

		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":   background_url,
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

func QueryStudentInfo(ctx *gin.Context) {
	db := common.GetDB()
	stuNum := ctx.PostForm("student_number")

	user := model.StudentInfo{
		StudentNumber: stuNum,
	}
	result := db.First(&user)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"avatarURL":     user.AvatarURL,
			"backgroundURL": user.BackgroundURL,
			"respMessage":   "success",
		})
	}
}

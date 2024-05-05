package controller

import (
	"backend/common"
	"backend/model"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func TodoCreate(ctx *gin.Context) {
	db := common.GetDB()
	studentNumber := ctx.PostForm("student_number")
	content := ctx.PostForm("content")
	status := ctx.PostForm("status")
	priority, _ := strconv.Atoi(ctx.PostForm("priority"))

	result := db.Create(&model.Todo{
		StudentNumber: studentNumber,
		Content:       content,
		Status:        status,
		Priority:      priority,
	})

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

func TodoQueryAll(ctx *gin.Context) {
	db := common.GetDB()
	studentNumber := ctx.PostForm("student_number")
	todoList := []model.Todo{}

	result := db.Where("student_number = ? and status = ?", studentNumber, "todo").Order("priority desc").Order("created_at desc").Find(&todoList)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"todoList":    todoList,
		})
	}
}

func TodoUpdate(ctx *gin.Context) {
	db := common.GetDB()
	id := ctx.PostForm("todoId")
	studentNumber := ctx.PostForm("student_number")
	content := ctx.PostForm("content")
	status := ctx.PostForm("status")
	priority := ctx.PostForm("priority")
	pre_todo := model.Todo{}
	db.Where("id = ?", id).Find(&pre_todo)
	update_todo := model.Todo{
		StudentNumber: studentNumber,
	}
	if content != "" {
		update_todo.Content = content
	}
	if status != "" {
		update_todo.Status = status
	}
	if priority != "" {
		update_todo.Priority, _ = strconv.Atoi(priority)
	}

	result := db.Model(&pre_todo).Updates(&update_todo)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

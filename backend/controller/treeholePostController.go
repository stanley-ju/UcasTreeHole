package controller

import (
	"backend/common"
	"backend/model"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type posts struct {
	PostId      int    `json:"postId"`
	SenderId    string `json:"senderId"`
	SendTime    int64  `json:"sendTime"`
	FavourNum   int    `json:"favourNum"`
	Content     string `json:"content"`
	QuoteId     int    `json:"quoteId"`
	IsFavour    string `json:"isFavour"`
	CommentList []comments
}

type comments struct {
	PostId    int    `json:"postId"`
	SenderId  string `json:"senderId"`
	SendTime  int64  `json:"sendTime"`
	CommentId int    `json:"commentId"`
	Content   string `json:"content"`
	ReplyId   int    `json:"replyId"`
}

func convert_post(c model.TreeholePost, studentNumber string) posts {
	res := posts{}
	res.PostId = int(c.ID)
	res.SenderId = c.SenderId
	res.SendTime = c.SendTime
	res.Content = c.Content
	res.QuoteId = c.QuoteId
	res.FavourNum = c.FavourNum
	res.CommentList = []comments{}

	db := common.GetDB()
	Comments := []model.PostComment{}
	db.Where("post_id = ?", res.PostId).Find(&Comments)

	favour := model.FavourPost{}
	result := db.Where("student_number = ? and post_id = ?", studentNumber, res.PostId).Find(&favour)
	if result.RowsAffected == 0 {
		res.IsFavour = "false"
	} else {
		res.IsFavour = "true"
	}

	for i := range Comments {
		res.CommentList = append(res.CommentList, convert_comment(Comments[i]))
	}
	return res
}

func convert_comment(c model.PostComment) comments {
	res := comments{}
	res.PostId = c.PostId
	res.SenderId = c.SenderId
	res.SendTime = c.SendTime
	res.Content = c.Content
	res.ReplyId = c.ReplyId
	res.CommentId = int(c.ID)
	return res
}

func SubmitPost(ctx *gin.Context) {
	db := common.GetDB()
	pos := &model.TreeholePost{}
	pos.SenderId = ctx.PostForm("student_number")
	pos.Content = ctx.PostForm("content")
	pos.QuoteId, _ = strconv.Atoi(ctx.PostForm("quoteId"))
	pos.SendTime = time.Now().Unix()

	res := db.Create(pos)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

func CommentPost(ctx *gin.Context) {
	db := common.GetDB()
	pos := &model.PostComment{}
	pos.SenderId = ctx.PostForm("student_number")
	pos.Content = ctx.PostForm("content")
	pos.SendTime = time.Now().Unix()
	pos.ReplyId, _ = strconv.Atoi(ctx.PostForm("replyId"))
	pos.PostId, _ = strconv.Atoi(ctx.PostForm("postId"))
	res := db.Create(pos)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

func QueryPost(ctx *gin.Context) {
	db := common.GetDB()
	treeholePosts := []model.TreeholePost{}
	resp := []posts{}
	startIndex, _ := strconv.Atoi(ctx.PostForm("startIndex"))
	studentNumber := ctx.PostForm("student_number")
	postNum, _ := strconv.Atoi(ctx.PostForm("postNum"))
	result := db.Order("id desc").Limit(postNum).Offset(startIndex - 1).Find(&treeholePosts)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    treeholePosts,
		})
	} else {
		for i := range treeholePosts {
			resp = append(resp, convert_post(treeholePosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

func QuerySinglePost(ctx *gin.Context) {
	db := common.GetDB()
	id := ctx.PostForm("postId")
	studentNumber := ctx.PostForm("student_number")

	singlePost := model.TreeholePost{}
	result := db.Where("id = ?", id).Find(&singlePost)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"singlePost":  convert_post(singlePost, studentNumber),
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"singlePost":  convert_post(singlePost, studentNumber),
		})
	}
}

func FavoritePost(ctx *gin.Context) {
	db := common.GetDB()
	studentId := ctx.PostForm("student_number")
	id, _ := strconv.Atoi(ctx.PostForm("postId"))

	favour := model.FavourPost{
		StudentNumber: studentId,
		PostId:        id,
	}

	res := db.Create(&favour)

	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		p := model.TreeholePost{}
		db.Where("id = ?", id).Find(&p)
		p.FavourNum += 1
		db.Save(&p)
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

func CancelFavoritePost(ctx *gin.Context) {
	db := common.GetDB()
	studentId := ctx.PostForm("student_number")
	id, _ := strconv.Atoi(ctx.PostForm("postId"))

	res := db.Where("student_number = ? and post_id = ?", studentId, id).Delete(&model.FavourPost{})

	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		p := model.TreeholePost{}
		db.Where("id = ?", id).Find(&p)
		p.FavourNum -= 1
		db.Save(&p)
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
		})
	}
}

func QueryFavoritePost(ctx *gin.Context) {
	db := common.GetDB()
	studentNumber := ctx.PostForm("student_number")
	startIndex, _ := strconv.Atoi(ctx.PostForm("startIndex"))
	postNum, _ := strconv.Atoi(ctx.PostForm("postNum"))

	favourId := []int{}
	favour := []model.FavourPost{}
	db.Where("student_number = ?", studentNumber).Find(&favour)
	for i := range favour {
		favourId = append(favourId, favour[i].PostId)
	}

	favourPosts := []model.TreeholePost{}
	resp := []posts{}

	result := db.Where("id in ?", favourId).Order("id desc").Limit(postNum).Offset(startIndex - 1).Find(&favourPosts)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    favourPosts,
		})
	} else {
		for i := range favourPosts {
			resp = append(resp, convert_post(favourPosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

func QueryPostWithKeyword(ctx *gin.Context) {
	db := common.GetDB()
	treeholePosts := []model.TreeholePost{}
	resp := []posts{}
	startIndex, _ := strconv.Atoi(ctx.PostForm("startIndex"))
	postNum, _ := strconv.Atoi(ctx.PostForm("postNum"))
	studentNumber := ctx.PostForm("student_number")
	keyword := ctx.PostForm("keyword")
	result := db.Where("content like ?", "%"+keyword+"%").Order("id desc").Limit(postNum).Offset(startIndex - 1).Find(&treeholePosts)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    treeholePosts,
		})
	} else {
		for i := range treeholePosts {
			resp = append(resp, convert_post(treeholePosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

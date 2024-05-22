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
	PostId       int        `json:"postId"`
	SenderId     string     `json:"senderId"`
	SendTime     int64      `json:"sendTime"`
	LikeNum      int        `json:"likeNum"`
	FavourNum    int        `json:"favourNum"`
	Content      string     `json:"content"`
	QuoteId      int        `json:"quoteId"`
	IsFavour     string     `json:"isFavour"`
	ImageUrlList string     `json:"imageUrlList"`
	CommentList  []comments `json:"commentList"`
}

type comments struct {
	PostId    int    `json:"postId"`
	SenderId  string `json:"senderId"`
	SendTime  int64  `json:"sendTime"`
	CommentId int    `json:"commentId"`
	Content   string `json:"content"`
	ReplyId   int    `json:"replyId"`
}

func convertPost(c model.TreeholePost, studentNumber string) posts {
	res := posts{}
	res.PostId = int(c.ID)
	res.SenderId = c.SenderId
	res.SendTime = c.SendTime
	res.Content = c.Content
	res.QuoteId = c.QuoteId
	res.FavourNum = c.FavourNum
	res.LikeNum = c.LikeNum
	res.ImageUrlList = c.ImageUrlList
	res.CommentList = []comments{}

	db := common.GetDB()
	var Comments []model.PostComment
	db.Where("post_id = ?", res.PostId).Find(&Comments)

	var favour []model.FavourPost
	result := db.Where("student_number = ? and post_id = ?", studentNumber, res.PostId).Find(&favour)
	if result.RowsAffected == 0 {
		res.IsFavour = "none"
	} else if result.RowsAffected == 2 {
		res.IsFavour = "both"
	} else if result.RowsAffected == 1 {
		res.IsFavour = favour[0].FavorType
	}

	for i := range Comments {
		res.CommentList = append(res.CommentList, convertComment(Comments[i]))
	}
	return res
}

func convertComment(c model.PostComment) comments {
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
	post := &model.TreeholePost{}
	post.SenderId = ctx.PostForm("student_number")
	post.Content = ctx.PostForm("content")
	post.QuoteId, _ = strconv.Atoi(ctx.PostForm("quoteId"))
	post.SendTime = time.Now().Unix()

	res := db.Create(post)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail to create post",
		})
	} else {
		form, _ := ctx.MultipartForm()
		files := form.File["file"]
		for _, file := range files {
			file.Filename = strconv.Itoa(int(post.ID)) + "_" + file.Filename

			imgUrl := "http://localhost:8081/statics/imgs/"
			err := ctx.SaveUploadedFile(file, "./imgs/"+file.Filename)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"respMessage": "fail to upload file",
				})
				db.Delete(post)
				return
			}

			post.ImageUrlList += imgUrl + file.Filename + ";"
		}
		res = db.Save(post)
		if res.Error != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"respMessage": "fail to save post",
			})
		} else {
			ctx.JSON(http.StatusOK, gin.H{
				"respMessage": "success",
			})
		}
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
	var treeholePosts []model.TreeholePost
	var resp []posts
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
			resp = append(resp, convertPost(treeholePosts[i], studentNumber))
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
			"singlePost":  convertPost(singlePost, studentNumber),
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"singlePost":  convertPost(singlePost, studentNumber),
		})
	}
}

func FavoritePost(ctx *gin.Context) {
	db := common.GetDB()
	studentId := ctx.PostForm("student_number")
	id, _ := strconv.Atoi(ctx.PostForm("postId"))
	favorType := ctx.PostForm("type")

	favour := model.FavourPost{
		StudentNumber: studentId,
		PostId:        id,
		FavorType:     favorType,
	}

	res := db.Create(&favour)

	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		p := model.TreeholePost{}
		db.Where("id = ?", id).Find(&p)
		if favorType == "favor" {
			p.FavourNum += 1
		} else {
			p.LikeNum += 1
		}
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
	favorType := ctx.PostForm("type")

	res := db.Where("student_number = ? and post_id = ? and favor_type = ?", studentId, id, favorType).Delete(&model.FavourPost{})

	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
		})
	} else {
		p := model.TreeholePost{}
		db.Where("id = ?", id).Find(&p)
		if favorType == "favor" {
			p.FavourNum -= 1
		} else {
			p.LikeNum -= 1
		}
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

	var favourId []int
	var favour []model.FavourPost
	db.Where("student_number = ?", studentNumber).Find(&favour)
	for i := range favour {
		favourId = append(favourId, favour[i].PostId)
	}

	var favourPosts []model.TreeholePost
	var resp []posts

	result := db.Where("id in ?", favourId).Order("id desc").Limit(postNum).Offset(startIndex - 1).Find(&favourPosts)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    favourPosts,
		})
	} else {
		for i := range favourPosts {
			resp = append(resp, convertPost(favourPosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

func QueryPostWithKeyword(ctx *gin.Context) {
	db := common.GetDB()
	var treeholePosts []model.TreeholePost
	var resp []posts
	startIndex, _ := strconv.Atoi(ctx.PostForm("startIndex"))
	postNum, _ := strconv.Atoi(ctx.PostForm("postNum"))
	studentNumber := ctx.PostForm("student_number")
	keyword := ctx.PostForm("keyword")
	result := db.Where("content like ?", "%"+keyword+"%").Order("id desc").Limit(postNum).Offset(startIndex - 1).Find(&treeholePosts)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    []posts{},
		})
	} else {
		for i := range treeholePosts {
			resp = append(resp, convertPost(treeholePosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

//todo 测试以下新增接口的正确性

func QueryHotPost(ctx *gin.Context) {
	db := common.GetDB()
	var treeholePosts []model.TreeholePost
	var resp []posts
	studentNumber := ctx.PostForm("student_number")
	postType := ctx.PostForm("type")
	duration := ctx.PostForm("duration")
	var timeAgo time.Time
	if duration == "day" {
		timeAgo = time.Now().AddDate(0, 0, -1)
	} else if duration == "week" {
		timeAgo = time.Now().AddDate(0, 0, -7)
	} else if duration == "month" {
		timeAgo = time.Now().AddDate(0, -1, 0)
	}

	result := db.Where("created_at >= ?", timeAgo).Order(postType + " desc").Limit(10).Find(&treeholePosts)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    []posts{},
		})
	} else {
		for i := range treeholePosts {
			resp = append(resp, convertPost(treeholePosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

func QueryUserPost(ctx *gin.Context) {
	db := common.GetDB()
	var treeholePosts []model.TreeholePost
	var resp []posts
	studentNumber := ctx.PostForm("student_number")
	result := db.Where("sender_id = ?", studentNumber).Find(&treeholePosts)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"respMessage": "fail",
			"postList":    []posts{},
		})
	} else {
		for i := range treeholePosts {
			resp = append(resp, convertPost(treeholePosts[i], studentNumber))
		}

		ctx.JSON(http.StatusOK, gin.H{
			"respMessage": "success",
			"postList":    resp,
		})
	}
}

func DeleteUserPost(ctx *gin.Context) {
	db := common.GetDB()
	studentNumber := ctx.PostForm("student_number")
	postId := ctx.PostForm("postId")

	post := model.TreeholePost{}

	result := db.Where("id = ? and sender_id = ?", postId, studentNumber).Delete(&post)
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

func DeleteUserComment(ctx *gin.Context) {
	db := common.GetDB()
	studentNumber := ctx.PostForm("student_number")
	commentId := ctx.PostForm("commentId")

	comment := model.PostComment{}

	result := db.Where("id = ? and sender_id = ?", commentId, studentNumber).Delete(&comment)

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

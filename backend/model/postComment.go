package model

import "gorm.io/gorm"

type PostComment struct {
	gorm.Model
	PostId   int    `gorm:"int"`
	SenderId string `gorm:"varchar(255)"`
	SendTime int64  `gorm:"int64"`
	Content  string `grom:"text"`
	ReplyId  int    `gorm:"int"`
}

func (PostComment) TableName() string {
	return "post_comment"
}

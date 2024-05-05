package model

import "gorm.io/gorm"

type FavourPost struct {
	gorm.Model
	PostId        int    `gorm:"int"`
	StudentNumber string `gorm:"varchar(255)"`
}

func (FavourPost) TableName() string {
	return "favour_post"
}

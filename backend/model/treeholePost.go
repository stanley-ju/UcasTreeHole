package model

import "gorm.io/gorm"

type TreeholePost struct {
	gorm.Model
	SenderId  string `gorm:"varchar(255)"`
	SendTime  int64  `gorm:"int64"`
	FavourNum int    `gorm:"int;default 0"`
	Content   string `grom:"text"`
	QuoteId   int    `gorm:"int"`
}

func (TreeholePost) TableName() string {
	return "treehole_post"
}

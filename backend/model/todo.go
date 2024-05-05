package model

import "gorm.io/gorm"

type Todo struct {
	gorm.Model
	StudentNumber string `gorm:"varchar(255)"`
	Content       string `grom:"text"`
	Status        string `gorm:"varchar(255)"`
	Priority      int    `gorm:"int"`
}

func (Todo) TableName() string {
	return "todo"
}

package controllers

import (
	"github.com/robfig/revel"
	"anisoon/app/models/repository"
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	anisonList := anison.Find()
	return c.Render(anisonList)
}

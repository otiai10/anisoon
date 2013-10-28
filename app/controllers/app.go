package controllers

import (
	"github.com/robfig/revel"
	"anisoon/app/models/repository"
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	anison := anison.Find()
	if anison == false {
		panic(anison)
	}
	return c.Render()
}

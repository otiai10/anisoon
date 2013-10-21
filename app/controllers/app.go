package controllers

import (
  "github.com/robfig/revel"
  "github.com/r7kamura/sugoi"
  "fmt"
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
  client := sugoi.NewClient()
  client.GetTitles("updatedFrom", "2000-01-01T00:00:00+09:00")
	return c.Render()
}

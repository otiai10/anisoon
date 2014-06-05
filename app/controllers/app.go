package controllers

import "github.com/revel/revel"
import "github.com/otiai10/animapi"

import "fmt"

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {

    db := animapi.DB("conf/db.conf")
    since, _ := animapi.Since("-1w")
    animes := db.FindAnimesWithAnisongs(since)

    fmt.Printf("%+v\n", animes)

	return c.Render()
}

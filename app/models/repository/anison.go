package anison

import (
	"anisoon/app/models/api"
)

var (
	CategoryAnime = 1
)

/**
 * models/apiを使ってAPIレスポンスを取得し
 * アニソンを抽出し、そのリストを返す
 */
func Find() []syobocalAPI.Anison {
	list := []syobocalAPI.Anison{}
	animeList := syobocalAPI.FindThisWeek()
	for _,a := range animeList {
		if a.Cat != CategoryAnime {
			continue
		}
		for _, song := range a.ToAnisonList() {
			list = append(list, song)
		}
	}

	return list
}

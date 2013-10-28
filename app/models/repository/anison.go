package anison

import (
	"anisoon/app/models/api"
	"fmt"
)

// 今後色々変えましょう
type Anison struct {
    AnimeTitle string
    SongTitle  string
}

var (
	CategoryAnime = 1
)

/**
 * models/apiを使ってAPIレスポンスを取得し
 * アニソンを抽出し、そのリストを返す
 */
//func Find() []Anison {
func Find() bool {
	animeList := syobocalAPI.FindThisWeek()
	for _,a := range animeList {
		if a.Cat != CategoryAnime {
			continue
		}
		anison := a.ToAnisonList()

		if anison {
			fmt.Println("hoge")
		}
	}

	return true
}

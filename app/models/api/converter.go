package syobocalAPI

import (
	"regexp"
)

var (
	RegexMatchAll = -1
	TypeOpening   = 0
	TypeEnding    = 1
)

type Anison struct {
	AnimeTitle  string
	AnimeID     int
	AnisonTitle string
	AnisonType  int
}

func (t TitleItem)ToAnisonList() []Anison {

	anisonList := []Anison{}
	anison := Anison{}
	comment := t.Comment
	re := regexp.MustCompile("オープニングテーマ.*「(.*)」")
    for _,m := range re.FindAllStringSubmatch(comment, RegexMatchAll) {
		anison = Anison{
			AnimeTitle:  t.Title,
			AnimeID:     t.TID,
			AnisonTitle: m[1],
			AnisonType:  TypeOpening,
		}
		anisonList = append(anisonList, anison)
    }
	re = regexp.MustCompile("エンディングテーマ.*「(.*)」")
    for _,m := range re.FindAllStringSubmatch(comment, RegexMatchAll) {
		anison = Anison{
			AnimeTitle:  t.Title,
			AnimeID:     t.TID,
			AnisonTitle: m[1],
			AnisonType:  TypeEnding,
		}
		anisonList = append(anisonList, anison)
    }

	return anisonList
}

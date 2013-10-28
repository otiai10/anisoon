package syobocalAPI

import (
	"fmt"
	"regexp"
)

var (
	RegexMatchAll = -1
)

func (t TitleItem)ToAnisonList() bool {

	fmt.Printf("[%v]\n", t.Title)
	comment := t.Comment
	re := regexp.MustCompile("オープニングテーマ.*「(.*)」")
	fmt.Printf("%q\n", re.FindAllStringSubmatch(comment, RegexMatchAll))
	re = regexp.MustCompile("エンディングテーマ.*「(.*)」")
	fmt.Printf("%q\n", re.FindAllStringSubmatch(comment, RegexMatchAll))

	return true
}

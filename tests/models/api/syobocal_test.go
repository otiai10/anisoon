package syobocalAPI

import (
  "anisoon/app/models/api"
  "testing"
)

func TestFindThisWeek(t *testing.T) {
  titles := syobocalAPI.FindThisWeek()  
  if len(titles) < 1 {
    t.Error("レスポンスが一件も無いよ")
  }
}

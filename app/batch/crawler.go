package batch

import (
  "net/http"
)

func SyobocalAPIStatus() int {
  resp, err := http.Get("http://cal.syoboi.jp/db.php?Command=TitleLookup&TID=1")
  if err != nil {
    panic(err)
  }
  return resp.StatusCode
}

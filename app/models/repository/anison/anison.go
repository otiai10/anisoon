package anison

import (
  "fmt"
  "github.com/r7kamura/sugoi"
)

/*
 * sugoiAPIを叩いて
 * アニソンリストを返す（今のところ）
 */
func FindThisWeek() bool {
  client := sugoi.NewClient()
  apiResp,_ := client.GetTitles("updatedFrom", "2013-10-13T00:00:00+09:00")
  for i,t := range apiResp {
    fmt.Println(
      i,
      t.Title,
    )
  }
  return true
}

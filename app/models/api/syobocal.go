package syobocalAPI

import (
  "time"
  "net/http"
  "fmt"
  "strconv"
  "encoding/xml"
)

type TitleLookupResponse struct {
  Result
  TitleItems []TitleItem
}
type Result struct {
  Code    string
  Message string
}
type TitleItem struct {
}

var baseURL = "http://cal.syoboi.jp/db.php?TID=*&Command=TitleLookup"

/*
 * 健康状態をチェックする
 */
func Health() *http.Response {
  resp,_ := http.Get(baseURL + "&LastUpdate=20131012_000000-")
  return resp
}

/*
 * 現在から一週間以内のアニメのリストと
 * OP,ED曲リストを返す
 */
func FindThisWeek() bool {
  dur, _ := time.ParseDuration("168h")
  y,m,d := time.Now().Add(-dur).Date()
  lastUpdate := strconv.Itoa(y)+ strconv.Itoa(int(m)) + strconv.Itoa(d)
  lastUpdate = lastUpdate + "_0000-"
  resp, err := http.Get(baseURL + "&LastUpdate=" + lastUpdate)
  if err != nil {
    panic(err)
  }
  if resp.Header.Get("Content-Type") == "text/xml" {
    panic("Content-Type is not 'text/xml'")
  }
  fmt.Printf("-----------------------------------------------------\n")
  fmt.Printf("%v\n", resp.Body)
  fmt.Printf("-----------------------------------------------------\n")
  fmt.Printf("=====================================================\n")
  decoder := xml.NewDecoder(resp.Body)
  titleLookupResponse := TitleLookupResponse{}
  err = decoder.Decode(&titleLookupResponse)
  fmt.Printf("200がほしい%v\n", titleLookupResponse)
  fmt.Printf("200がほしい%v\n", titleLookupResponse.Result.Code)
  fmt.Printf("=====================================================\n")
  return true
}

package syobocalAPI

import (
  "time"
  "net/http"
  "fmt"
  "strconv"
  "encoding/xml"
  "io/ioutil"
)
type Result struct {
  Code    string
  Message string
}

type TitleItem struct {
  XMLName    xml.Name `xml:"TitleItem"`
  TID        int      `xml:"TID"`
  LastUpdate string   `xml:"LastUpdate"`
  Title      string   `xml:"Title"`
  ShortTitle string   `xml:"ShortTitle"`
  TitleYomi  string   `xml:"TitleYomi"`
  Comment    string   `xml:"Comment"`
  FirstYear  int      `xml:"FirstYear"`
  FirstMonth int      `xml:"FirstMonth"`
  Cat        int      `xml:"Cat"`// 1がアニメ,10がアニメ再放送
}
type TitleItems struct {
  XMLName    xml.Name `xml:"TitleItems"`
  TitleItem  []TitleItem
}
type ResponseRoot struct {
  XMLName    xml.Name    `xml:"TitleLookupResponse"`
  Result     Result      `xml:"Result"`
  TitleItems TitleItems  `xml:"TitleItems"`
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
  lastUpdate = lastUpdate + "_000000-"
  fmt.Println(
    baseURL,
    lastUpdate,
  )
  resp, err := http.Get(baseURL + "&LastUpdate=" + lastUpdate)
  if err != nil {
    panic(err)
  }
  if resp.Header.Get("Content-Type") == "text/xml" {
    panic("Content-Type is not 'text/xml'")
  }
  defer resp.Body.Close()
  body,_ := ioutil.ReadAll(resp.Body)
  xmlRoot := ResponseRoot{}
  err2 := xml.Unmarshal(body, &xmlRoot)
  if err2 != nil {
    panic(err2)
  }
  fmt.Printf("%+v\n", xmlRoot.Result)
  return true
}

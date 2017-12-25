var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");

// var originUrl = 'http://www.qqtn.com/article/article_226388_1.html'
// var originUrl = 'http://www.qqtn.com/bq/'



var sectionUrl = async function() {
  var originUrl = "http://www.qqtn.com/bq/";
  var html = await pageHtml(originUrl);
  var page_a = $(".m-change a")
  var a_url_arr = []
  page_a.each(function(i,v) {
      var a_url = $(this).attr('href')
      a_url_arr.push(a_url)
  })
  console.log('页面二级链接抓取完毕-----------')
  console.log(a_url_arr)
  a_url_arr.forEach(function(v) {
    pageImgUrl(v)
  })
};

var pageImgUrl = function(page_url) {
    page_url ='http://www.qqtn.com' + page_url
    console.log('开始下载' +page_url+ '图片')
    request(page_url,function(error,response,body) {
        if(!error && response.statusCode == 200) {
            $ = cheerio.load(body,{decodeEntities: false})
            var img_html = $("#zoom img")
            var img_arr = []
            img_html.each(function(i,v){
                var file_name
                var img_src = $(this).attr('src')
                var file_name = FileName(img_src)
                // img_arr.push(img_src)
                downLoadImg(img_src,file_name,function() {
                    console.log(file_name + '/下载完成')
                })
            })
            // console.log(img_arr)
        }
    })
}

//返回链接页面的HTML

function pageHtml(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body, { decodeEntities: false });
        resolve($.html());
      } else {
        reject(false);
      }
    });
  });
}

//下载图片
function downLoadImg(url, filename, callback) {
  var stream = fs.createWriteStream("images/" + filename);
  request(url)
    .on("error", function() {
      console.log("request is error!!!");
    })
    .pipe(stream)
    .on("close", callback);
}

//格式化图片名称
function FileName(url) {
  var fileName = path.basename(url);
  return fileName;
}

(function init() {
  sectionUrl();
})();

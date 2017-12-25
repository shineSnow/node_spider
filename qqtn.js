var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");
var async = require('async')

var page_urls = []
// var originUrl = 'http://www.qqtn.com/article/article_226388_1.html'
// var originUrl = 'http://www.qqtn.com/bq/'



var sectionUrl = async function() {
  var originUrl = "http://www.qqtn.com/bq/";
  var html = await pageHtml(originUrl);
  var page_a = $("a")
  var a_url_arr = []
  page_a.each(function(i,v) {
      var a_url = $(this).attr('href')
      if(a_url.indexOf('html') > -1) {
        a_url ='http://www.qqtn.com' + a_url
        a_url_arr.push(a_url)
      }
  })
  page_urls = a_url_arr
  console.log('页面二级链接抓取完毕-----------')
  console.log(page_urls)
//   loadLimit()
    page_urls.forEach(function(v) {
        pageImgUrl(v)
    })
};

// var loadLimit = function() {
//     async.mapLimit(page_urls,1,function(page_url,callback) {
//         request(page_url, pageImgUrl);
//         callback(null)
//     }, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(result);
//             console.log('全部检索完毕');
//         }
//     })
// } 

var pageImgUrl = function(page_url) {
    console.log('开始下载' +page_url+ '图片')
    request(page_url,function(error,response,body) {
        if(!error && response.statusCode == 200) {
            $ = cheerio.load(body,{decodeEntities: false})
            var img_html = $("#zoom img")
            var img_arr = []
            img_html.each(function(i,v){
                var img_src = $(this).attr('src')
                img_arr.push(img_src)
            })
            // console.log(img_arr)
            downLoadImg(img_src,function() {
                console.log(file_name + '/下载完成')
            })
        }
    })
}

// var pageImgUrl = function(error,response,body) {
//             if(!error && response.statusCode == 200) {
//                 $ = cheerio.load(body,{decodeEntities: false})
//                 var img_html = $("#zoom img")
//                 var img_arr = []
//                 img_html.each(function(i,v){
//                     var img_src = $(this).attr('src')
//                     img_arr.push(img_src)
//                 })
//                 // console.log(img_arr)
//                 downLoadImg(img_src,function() {
//                     console.log(file_name + '/下载完成')
//                 })
//         }
// }

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
function downLoadImg(url, callback) {
  var file_name = FileName(img_src) 
  var stream = fs.createWriteStream("images/" + file_name);
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

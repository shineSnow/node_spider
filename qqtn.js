var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var originUrl = 'http://www.qqtn.com/article/article_226388_1.html'

request({uri:originUrl},function(error,response,body) {
    if(!error && response.statusCode == 200) {
        $ = cheerio.load(body,{decodeEntities: false})
        var img_html = $("#zoom img")
        var img_arr = [], num =0
        img_html.each(function(i,v){
            var fileName = 'qqtn_img_'
            num++
            fileName = fileName + num + '.gif'
            var img_src = $(this).attr('src')
            img_arr.push(img_src)
            downLoadImg(img_src,fileName,function() {
                console.log(fileName + ',下载完成')
            })
        })
        console.log(img_arr)
    }
})

function downLoadImg (url, filename,callback) {
    var stream = fs.createWriteStream('images/' + filename);
    request(url).on('error',function() {
        console.log('request is error!!!')
    }).pipe(stream).on('close',callback)
}

//格式化图片名称
function FileName(url) {
    var fileName = path.basename(url);
    return fileName;
}
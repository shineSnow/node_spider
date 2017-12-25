var express = require('express')
var app = express()
var request = require('request')
var cheerio = require('cheerio')

app.use('/',function(req,res){
    request({uri:'https://www.jd.com',encoding:'UTF-8'},function(error, response, body) {
        if(!error && response.statusCode == 200) {
            $ = cheerio.load(body,{decodeEntities: false})

            res.send($.html())
            var slide_list = $(".fs_col2 .J_slider_item")
            console.log(slide_list.length)
             
        }
    })
})

var server = app.listen(3000,function(){
    console.log("server is running at port:3000")
})



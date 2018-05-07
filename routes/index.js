var express = require('express');
var router = express.Router();

var fs = require("fs");

var crawler = require('../crawler/index');
var scrapper = require('../scrapper/index')

/* GET home page. */
router.get('/', function(req, res) {

    crawler.crawl(function(content, url, contentType, todo) {
        //console.log(content);
        scrapper.extractData(content, url, contentType, todo);
    });
    //res.render('index', { title: 'Express' });
});

module.exports = router;
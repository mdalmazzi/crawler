var Crawler = require('simplecrawler');

var { Todo } = require('../models/todo');

module.exports.crawl = function(callback, todo) {

    Todo.findOne({ 'completed': false }, function(error, todo) {
        if (error) return handleError(err);
        // Prints "Space Ghost is a talk show host".
        var todo = todo;
        //console.log('Lista siti', todo.text, todo);
        myCrawlerUrl = todo.text;

        //var myCrawler = Crawler.crawl("http://www.bitness.it");
        var myCrawler = Crawler.crawl(todo.text);

        // Aggiungere WhiteList
        var urls = [];

        myCrawler.on("crawlstart", function() {
            console.log("Crawler started!");
        });

        myCrawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
            //console.log("Fetched completed!", todo);
            console.log("Fetched completed!");
            callback(responseBuffer, queueItem.url, queueItem.stateData.contentType, todo);
        });

        //myCrawler.start();
    });
}
var cheerio = require('cheerio');

var Page = require('../models/page');

module.exports.extractData = function(html, url, contentType, todo) {

    var $ = cheerio.load(html, {
        normalizeWhitespace: true
    });

    console.log('contentType: ', contentType);

    var $images = $('img');
    //console.log($images);
    var description = $('meta[name="description"]').attr('content');
    var keywords = $('meta[name="keywords"]').attr('content');
    var category = $('meta[name="category"]').attr('content');
    var title = $("title").text();

    //var body = $("body").text().replace(/<(?:.|\n)*?>/gm, '');

    $('html > body').each(function() {
        var body = $('html > body').text().replace(/<(?:.|\n)*?>/gm, '')
            //var body = $('body').text();
            // var body = $('html *').contents().map(function() {
            //     return (this.type === 'text') ? $(this).text() : '';
            // }).get().join(' ');

        var page = new Page({

            titolo: title,
            body: body,
            path: url,
            meta1: { name: 'description', content: description },
            meta2: { name: 'keywords', content: keywords },
            meta3: { name: 'category', content: category },
            type: contentType,
            licenza: todo.licenza,
            scuola: todo.scuola,
            language: todo.language
        });

        searchForImage($images, $, page);

        page.save(function(err, result) {
            if (err) throw err;
            console.log('Page created!');
        });
    });
};

function searchForImage($images, $, page) {

    if ($images) {
        $(($images)).each(function(image) {
            if ($images[image].attribs.src.match(/http/g) !== null) {
                // Salva solo se ha path globale -- forse migliorabile
                page.images.push($images[image].attribs.src);
            };
        });
    }
}
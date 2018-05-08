var Page = require('../models/page');

module.exports.extractData = function() {

    Page.findOne({
        $text: {
            $search: 'fisica',
            // $language: <string>,
            // $caseSensitive: <boolean>,
            // $diacriticSensitive: <boolean>
        }
    }, function(error, pages) {
        if (error) return handleError(err);
        console.log(pages);
    });

}
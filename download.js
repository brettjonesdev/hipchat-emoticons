var jsdom = require('jsdom');
var _ = require('underscore');
var validUrl = require('valid-url');
var exec = require('child_process').exec;

jsdom.env('https://www.hipchat.com/emoticons', ['http://code.jquery.com/jquery-1.8.3.min.js'], function(errors, window) {
    var $ = window.jQuery;
    console.log('loaded page');
    var emoticons = {};
    $('.emoticon-block').each(function() {
        var name = $(this).data('clipboardText');
        name = name.replace('(', '');
        name = name.replace(')', '');
        emoticons[name] = $(this).find('img').attr('src');
    });

    console.log(emoticons);
    exec('rm -rf ./emoticons; mkdir ./emoticons', function() {
        _.each(emoticons, function(url, name) {
            if ( validUrl.isUri(url) && /^\w+$/.test(name)) {
                console.log("Downloading", url, name);
                exec('wget ' + url + ' -O ./emoticons/' + name);
            }
        });
    });
});
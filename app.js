var url = require('url');
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');

var targetUrl = 'https://cnodejs.org/';
superagent.get(targetUrl)
    .end(function (err, res) {
        if(err){
        	return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        //获取首页所有链接
        $('#topic_list .topic_title').each(function(idx, element){
        	var $element = $(element);
        	var href = url.resolve(targetUrl, $element.attr('href'));
        	//console.log(href);
        	topicUrls.push(href);
        });
        
        var ep = new eventproxy();
        //params: eventname(String) 事件名,times(Number) 监听次数, callback 回调函数
        ep.after('topic_html',topicUrls.length,function(topics){
        	topics = topics.map(function(topicPair){
        		topicPair = topicPair || [];
        		var topicUrl = topicPair[0] || '';
        		var topicHtml = topicPair[1] || '';
        		var $ = cheerio.load(topicHtml);
        		return ({
        			title:$('.topic_full_title').text().trim(),
        		    href:topicUrl,
        		    comment1:$('.reply_content').eq(0).text().trim()
        		});
        		
        	});
        	
        	console.log('outcome:');
        	console.log(topics);
        });
        
        topicUrls.forEach(function(topicUrl){
        	superagent.get(topicUrl)
        	    .end(function(err, res){
        	    	if(err){
        	    		console.error('fetch ' + topicUrl + ' fail');
        	    		ep.emit('topic_html',[topicUrl,''])
        	    		return;
        	    	}
        	    	console.error('fetch ' + topicUrl + ' success');
        	    	ep.emit('topic_html',[topicUrl,res.text]);
        	    });
        });
        
    });

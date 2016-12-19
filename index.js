'use strict';

const jsdom = require("jsdom");
const request = require('request');
const etrCookie = 'ewsa3xsfdgp3dnil435sqbfb';
const defLength = 24;

const HOST = 'https://web8.etr.u-szeged.hu';
const URL = HOST + '/etr/VizsgaHallg/HVLKurzusLista';
const headers = {
	    	'Accept-Encoding': 'gzip, deflate, sdch, br',
	    	'Cache-Control': 'max-age=0',
	    	'Connection': 'keep-alive',
	    	'Cookie': 'ETR35Sess='+etrCookie
	    };

const apply = function(row) {
	if(row.find('.lsz_td').text().trim() == "6/6") {
		return false;
	}

	let href = row.find('.muv_td a').attr('href');

	var options = {
	  url: HOST + href,
	  headers: headers
	};

	request(options, function (error, response, body) {
		if(!!error) {
			console.log(error);
			return false;
		}

		console.log('Success');
		process.exit();
	  return true;
	})
}

const autoApply = function() {
	console.info('Tried at ' + new Date());
	jsdom.env({
	    url: URL,
	    headers: headers,
	    scripts: ["https://code.jquery.com/jquery.js"],
	    done: function (err, window) {
	    	if(!!err) {
	    		console.log(err);
	    		return;
	    	}

	    	if(URL !== window.location.href) {
	    		console.log('Session expired!');
	    		return;
	    	}

	    	let $ = window.$;
	    	let mikroTRs = $("div:contains('Mikrobiológia és immunitástan előadás')").eq(2).find('.vi_div').find('tr')

	    	if(mikroTRs.length !== defLength) {
	    		console.log('Sometging changed!');
	    		clearInterval(interval);
	    	}

	    	if(apply(mikroTRs.eq(6))) {
	    		console.log('Success!');
	    		clearInterval(interval);	    		
	    	}

	    	if(apply(mikroTRs.eq(7))) {
	    		console.log('Success!');
	    		clearInterval(interval);
	    	}
	    }
	});
};

let interval = setInterval(autoApply, 1000*10); // 10 sec
// autoApply();



// curl 'https://web8.etr.u-szeged.hu/etr/VizsgaHallg/HVLKurzusLista' -H 'Accept-Encoding: gzip, deflate, sdch, br' 
// -H 'Accept-Language: hu,en-US;q=0.8,en;q=0.6,ru;q=0.4,es;q=0.2,ja;q=0.2,zh-TW;q=0.2,zh;q=0.2' 
// -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36' 
// -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' 
// -H 'Cache-Control: max-age=0' 
// -H 'Cookie: ETR35Sess=ewsa3xsfdgp3dnil435sqbfb' 
// -H 'Connection: keep-alive' --compressed
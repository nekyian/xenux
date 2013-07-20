//*** get kw from google kw tool file export XML ***//

var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile('kw/kw.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        
        // console.dir(JSON.stringify(result));
        console.log('Done');

        console.log(JSON.stringify(result['report']['table'][0]['row'][0]['$']['keyword']));

        var kw = [];
		for (var key in result['report']['table'][0]['row']) {
			kw[key] = result['report']['table'][0]['row'][key]['$']['keyword'];
		}

		console.log(JSON.stringify(kw));

		//*** crawl the shit out of those kw ***//

		var Crawler = require("crawler").Crawler;

		var c = new Crawler({
		"maxConnections":3,
		"timeout": 2000,
		"userAgent": 'Mozilla',

		// This will be called for each crawled page
		"callback":function(error,result,$) {

			console.log("Grabbed",result.body.length,"bytes");

			// $ is a jQuery instance scoped to the server-side DOM of the page
			$("div.ads-visurl > a").each(function(index,a) {
			    c.queue(a.href);
			    console.log(a.href);
			});
		},
		});


		// This will be called for each crawled page
		// "callback":function(error,result,$) {

		// 	// console.log(result);

		// 	console.log("Grabbed",result.body.length,"bytes");
		// 	// console.log(result.body);
		// 	console.log('Am gasit: ' + $("div.ads-visurl > a").href);
		// 	// console.log($("cite", $("div.ads-visurl")).each());
		//     // $ is a jQuery instance scoped to the server-side DOM of the page
		//     $("div.ads-visurl > a").each(function(index, a) {
		//         console.log(a.uri);
		//     });

		// }
		// });

		// Queue just one URL, with default callback
		for (var index in kw) {
			
			setTimeout(function() {
				c.queue("http://google.ro/search?q=" + encodeURIComponent(kw[index]));
			}, 3000);
			
			console.log("http://google.ro/search?q=" + encodeURIComponent(kw[index]));
		}

	});
});






/*
// Queue a list of URLs
c.queue(["http://jamendo.com/","http://tedxparis.com"]);

// Queue URLs with custom callbacks & parameters
c.queue([{
"uri":"http://parishackers.org/",
"jQuery":false,

// The global callback won't be called
"callback":function(error,result) {
    console.log("Grabbed",result.body.length,"bytes");
}
}]);

// Queue some HTML code directly without grabbing (mostly for tests)
c.queue([{
"html":"<p>This is a <strong>test</strong></p>"
}]);
/*
*/
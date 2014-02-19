var express = require(__dirname + '/node_modules/express'),
	app = express(),
	highscore = require(__dirname + '/highscore')({app: app});

app.use(express.static(__dirname + '/site'));

app.listen(3000);
console.log('listening on port 3000');
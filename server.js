var express = require(__dirname + '/node_modules/express'),
	app = express();

app.use(express.static(__dirname + '/site'));

// initialize highscore service
var highscore = require(__dirname + '/highscore')({app: app});

app.listen(3000);
console.log('listening on port 3000');
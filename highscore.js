// implements express routing for highscore rest api

//var mongoose = require(__dirname + '/node_modules/mongoose');

function initialize(params) {
	var app = params.app;

	app.get('/hs', function(req, res) {
		// get top scores
		res.send('top scores');
	});

	app.get('/hs/:name', function(req, res) {
		// get top score for 'name'
		var name = req.params.name;
		// encode param
		res.send('top score for ' + name);
	});

	app.get('/hs/:name/:score', function(req, res) {
		// set new score for 'name'
		var name = req.params.name,
			score = req.params.score;
		// encode params
		// check that score is a number
		res.send('set top score to ' + score + ' for ' + name);
	});

	console.log('highscore service initialized');
}

module.exports = initialize;
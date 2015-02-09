// implements express routing for highscore rest api

function initialize(params) {
	var app = params.app,
		mongoose = require(__dirname + '/node_modules/mongoose');

	// initialize database
	mongoose.connect('mongodb://localhost/highscoredb');

	var score = new mongoose.Schema({
			name: { type: String, required: true },
			score: { type: Number, required: true },
			date: { type: Date, default: Date.now },
		}),
		scoreModel = mongoose.model('Score', score);

	// define routes
	app.get('/hs', function(req, res) {
		// get top scores
		return scoreModel.find(function(err, scores) {
			if (!err) {
				res.send('top scores<br/>' + scores);
			} else {
				return console.log(err);
			}
		});
	});

	app.get('/hs/:name/:score', function(req, res) {
		// new score - compare/add to top scores
		console.log('GET ' + req.route);

		var score = new scoreModel({
				name: req.params.name,
				score: req.params.score,
			});

		score.save(function(err) {
			if (!err) {
				console.log('score created: ' + score);
				res.send('success');
			} else {
				console.log('error saving score: ' + err);
				res.send('error');
			}
		});
	});

	console.log('highscore service initialized');
}

module.exports = initialize;
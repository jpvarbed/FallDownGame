var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;

var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;

var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;

var GRAVITY = 8;
var PLAYER_SPEED = 12;

var RESTART_HEIGHT = MAIN_HEIGHT - 100;
var RESTART_HORIZONITAL_OFFSET = 120;

var HIGHSCORE_HEIGHT = MAIN_HEIGHT - 200;
var HIGHSCORE_HORIZONITAL_OFFSET = 120;

var canvas;
var player;

var edgeBlocks = [];
var mazeBlocks = [];

// initialize when the DOM is loaded
$(document).ready(function() {
	StartEverything();
});

function StartEverything() {
	Game.initialize();
}

function MazeBlock(x, y, h, w) {
	this.x = x;
	this.y = y;
	var randHeight = Math.floor((Math.random() * h/2) + 1);
	this.height = h + randHeight;
	var randWidth = Math.floor((Math.random() * w/2) + 1);
	this.width = w + randWidth;
	this.active = true;
	var randWeight = Math.floor((Math.random() * GRAVITY/2) + 1);
	this.weight = GRAVITY + randWeight;
}

MazeBlock.prototype = {
	update: function() {
		this.y += this.weight;
		if (this.y > MAIN_HEIGHT)
		{
			this.active = false;
		}
	},
	draw: function() {
		var context = canvas.getContext("2d");
		context.fillStyle = 'blue';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

MazeBlock.prototype.explode = function() {
	this.active = false;
}

var maze = {

	initalize: function()
	{
		var leftBlock = new MazeBlock(0, 0, MAIN_HEIGHT, BLOCK_WIDTH);
		var rightBlock = new MazeBlock(MAIN_WIDTH - BLOCK_WIDTH, 0, MAIN_HEIGHT, MAIN_WIDTH);
		edgeBlocks.push(leftBlock);
		edgeBlocks.push(rightBlock);

		var middleBlock = new MazeBlock(0, 0, BLOCK_HEIGHT, BLOCK_WIDTH);
		mazeBlocks.push(middleBlock);
	},

	update: function() {
		mazeBlocks.forEach(function(mazeBlock) {
			mazeBlock.update();
		})

		mazeBlocks = mazeBlocks.filter(function(block) {
            return block.active;
        });
        
        edgeBlocks = edgeBlocks.filter(function(block) {
            return block.active;
        });

        if (mazeBlocks.length < 5)
        {
        	this.addMiddleBlock();
        }
	},
	addMiddleBlock: function() {
		var rand = Math.floor(Math.random() * MAIN_WIDTH - BLOCK_WIDTH);
		var newBlock = new MazeBlock(rand, 0, BLOCK_HEIGHT, BLOCK_WIDTH);
		mazeBlocks.push(newBlock);
	},
	draw: function() {
		mazeBlocks.forEach(function(mazeBlock) {
			mazeBlock.draw();
		})
		edgeBlocks.forEach(function(edgeBlock) {
			edgeBlock.draw();
		})
	}
}

var Timer = {
	timePassed: 0,
	active: true,
	gameStartTime: (new Date).getTime(),
	draw: function() {
		var context = canvas.getContext("2d"),
			timerSeconds = (((new Date).getTime() - this.gameStartTime) / 1000) | 0;
		this.timePassed = timerSeconds;
		context.fillStyle = "black";
		context.font = "32px Veranda";
		if (this.active)
		{
			context.fillText(this.timePassed, 120, 60);
		}	
		
	},
	getSeconds: function() {
		return this.timePassed;
	},
	_initializeTimer: function() {
		this.active = true;
		this.gameStartTime = (new Date).getTime();
	},
	stop: function() {
		this.active = false;
	},
	restart: function() {
		this._initializeTimer();
	}
}

var Score = {
	highScore: 0,
	getCurrent: function() {
		return Timer.getSeconds();
	},
	getHighScore: function() {
		return this.highScore;
	},
	setHighScore: function(newScore) {
		this.highScore = newScore;
	}
}

function InitializeCanvas() {
	canvas = $('#dynamicCanvas')[0];
	canvas.width = MAIN_WIDTH;
	canvas.height = MAIN_HEIGHT;
	
	// draw static canvas once
	var staticCanvas = $('#staticCanvas')[0];
	staticCanvas.width = MAIN_WIDTH;
	staticCanvas.height = MAIN_HEIGHT;

	var context = staticCanvas.getContext("2d");
	context.fillStyle = 'green';
	context.fillRect(20, 20, staticCanvas.width - 40, staticCanvas.height - 40);
}

var Game = {
	hasStarted: 0,
	shouldStop: 0,
	intervalId: 0,
	stopGame: function(){
		Timer.stop();
		this.shouldStop = 1;
	},
	runLoop: function() {
		if (this.hasStarted === 0) 
		{
			this.hasStarted = 1;
			this.intervalId = setInterval(function() {
				if (Game.shouldStop === 0)
				{		
					Update();
					Draw();
				}
				else
				{
					Game.restart();
				}
			}, 1000/FPS);
		}
	},
	updateHighScore: function() {
		var difference = Score.getCurrent() - Score.getHighScore();
		if (difference)
		{
			Score.setHighScore(Score.getCurrent());
			this.drawNewHighScore();
		}
		else if (difference < 0)
		{
			this.drawOldHighScore(difference * -1);
		}
		else
		{
			this.drawNoChangeInScore();
		}
	},
	drawNewHighScore: function() {
		var context = canvas.getContext("2d");
		context.fillStyle ="purple";
		context.font = "32px Veranda";
		context.fillText("New High Score! " + Score.getHighScore(), HIGHSCORE_HORIZONITAL_OFFSET, HIGHSCORE_HEIGHT);
	},
	drawOldHighScore: function(difference)
	{
		var context = canvas.getContext("2d");
		context.fillStyle ="red";
		context.font = "32px Veranda";
		context.fillText("You suck! You did " + difference + " worse than before", HIGHSCORE_HORIZONITAL_OFFSET, HIGHSCORE_HEIGHT);
	},
	drawNoChangeInScore: function() {
		var context = canvas.getContext("2d");
		context.fillStyle ="orange";
		context.font = "32px Veranda";
		context.fillText("Meh. The same as your best.", HIGHSCORE_HORIZONITAL_OFFSET, HIGHSCORE_HEIGHT);
	},
	gameOver: function() {
		this.stopGame();
	},
	showRestartButton: function() {
		var context = canvas.getContext("2d");
		context.fillStyle ="black";
		context.font = "32px Veranda";
		context.fillText("Click to Restart", RESTART_HORIZONITAL_OFFSET, RESTART_HEIGHT);
	},
	drawEndGameMessage: function() {
		var context = canvas.getContext("2d"),
			score = Score.getCurrent();
		ClearCanvas();
		context.fillStyle = "black";
		context.font = "32px Veranda";
		context.fillText("You lasted " + score + " seconds", 120, 60);
		context.fillText("that's what she said", 120, 120);
		this.updateHighScore();
	},
	restart: function() {
		clearInterval(this.intervalId);
		this.drawEndGameMessage();
		this.showRestartButton();
		setTimeout(
		  function()
		  {
		    	ClearCanvas();
				StartEverything();
		  }, 5000);
	},
	initialize: function() {
		this.hasStarted = 0;
		this.shouldStop = 0;
		clearInterval(Game.intervalId);
		Timer.restart();
		InitializeCanvas();
		maze.initalize();
		player = new Player(
			MAIN_WIDTH / 2,
			MAIN_HEIGHT / 2,
			PLAYER_WIDTH,
			PLAYER_HEIGHT,
			PLAYER_SPEED);
		player.initialize();
		this.runLoop();
	}
}

function Collides(a, b) {
	return a.x < b.x + b.rad*2 &&
		a.x + a.width > b.x &&
		a.y < b.y + b.rad*2 &&
		a.y + a.height > b.y;
}

function HandleCollisions() {
	hitSomething = 0;
	mazeBlocks.forEach(function(mazeBlock) {
		if (Collides(mazeBlock, player)) {
			player.explode();
			mazeBlock.explode();
			hitSomething = 1;
		}
	})

	edgeBlocks.forEach(function(block) {
		if (Collides(block, player)) {
			player.explode();
			block.explode();
			hitSomething = 1;
		}
	})

	if (hitSomething === 1) {
		Game.gameOver();
	}
}

function Update() {
	player.update();
	maze.update();

	HandleCollisions();
}

function Draw() {
	ClearCanvas();

	player.draw(canvas);
	maze.draw();
	Timer.draw();
}

function ClearCanvas() {
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}
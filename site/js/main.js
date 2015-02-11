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

var MAZE_BLOCK = 5;
var PRIZE_BLOCK = 6;
var edgeBlocks = [];
var mazeBlocks = [];
var prizeBlocks = [];

// initialize when the DOM is loaded
$(document).ready(function() {
	StartEverything();
});

function StartEverything() {
	Game.initialize();
}

var maze = {
	clearBlocks: function()
	{
		//fastest way to clear
		while(mazeBlocks.length > 0) {
		    mazeBlocks.pop();
		}
		while(prizeBlocks.length > 0) {
		    prizeBlocks.pop();
		}
	},
	initalize: function()
	{
		this.clearBlocks();
		var leftBlock = new MazeBlock(0, 0, MAIN_HEIGHT, BLOCK_WIDTH);
		var rightBlock = new MazeBlock(MAIN_WIDTH - BLOCK_WIDTH, 0, MAIN_HEIGHT, MAIN_WIDTH);
		edgeBlocks.push(leftBlock);
		edgeBlocks.push(rightBlock);

		var middleBlock = new MazeBlock(0, 0, BLOCK_HEIGHT, BLOCK_WIDTH);
		mazeBlocks.push(middleBlock);
	},
	updateBlockSet: function(blockSet) {
		blockSet.forEach(function(block) {
			block.update();
		})
	},
	filterBlockSet: function(blockSet) {
		blockSet = blockSet.filter(function(block) {
            return block.active;
        });
	},
	update: function() {
		this.updateBlockSet(mazeBlocks);
		this.updateBlockSet(prizeBlocks);
		// TODO figure out how to pass by reference to filterblockset
		mazeBlocks = mazeBlocks.filter(function(block){
			return block.filter();
		});
		prizeBlocks = prizeBlocks.filter(function(block){
			return block.filter();
		});		
		edgeBlocks = edgeBlocks.filter(function(block){
			return block.filter();
		});

        if (mazeBlocks.length < 5)
        {
        	this.addMiddleBlock();
        }

        if (prizeBlocks.length < 1)
        {
        	this.addPrizeBlock();
        }
	},
	makeStandardBlock: function(blockType) {
		var rand = Math.floor(Math.random() * (MAIN_WIDTH - BLOCK_WIDTH));
		var newBlock = new MazeBlock(rand, 0, blockType);
		return newBlock;
	},
	addMiddleBlock: function() {
		mazeBlocks.push(this.makeStandardBlock(MAZE_BLOCK));
	},
	addPrizeBlock: function() {
		prizeBlocks.push(this.makeStandardBlock(PRIZE_BLOCK));
	},
	draw: function() {
		mazeBlocks.forEach(function(mazeBlock) {
			mazeBlock.draw();
		})
		edgeBlocks.forEach(function(edgeBlock) {
			edgeBlock.draw();
		})
		prizeBlocks.forEach(function(prizeBlock) {
			prizeBlock.draw();
		})
	}
}

var Timer = {
	timePassed: 0,
	active: true,
	gameStartTime: (new Date).getTime(),
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
	},
	update: function() {
		this.timePassed =  (((new Date).getTime() - this.gameStartTime) / 1000) | 0;
	}
}

var Score = {
	highScore: 0,
	prizeScore: 0,
	initialize: function() {
		this.prizeScore = 0;
	},
	draw: function() {
		var context = canvas.getContext("2d");
		context.fillStyle = "black";
		context.font = "32px Veranda";
		context.fillText("Current score:" + Score.getCurrent(), 50, 60);
		context.fillText("High score:" + Score.getHighScore(), MAIN_WIDTH - 200, 60);
	},
	getCurrent: function() {
		return Timer.getSeconds() + this.prizeScore;
	},
	getHighScore: function() {
		return this.highScore;
	},
	setHighScore: function(newScore) {
		this.highScore = newScore;
	},
	updateHighScore: function() {
		var difference = this.getCurrent() - this.getHighScore();
		if (difference > 0)
		{
			this.setHighScore(Score.getCurrent());
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
	drawNoChangeInScore: function() {
		var context = canvas.getContext("2d");
		context.fillStyle ="orange";
		context.font = "32px Veranda";
		context.fillText("Meh. The same as your best.", HIGHSCORE_HORIZONITAL_OFFSET, HIGHSCORE_HEIGHT);
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
	blockHit: function(block)
	{
		this.prizeScore += 10;
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

var restartButton = {
	show: function() {
		var context = canvas.getContext("2d");
		context.fillStyle ="black";
		context.font = "32px Veranda";
		context.fillText("Click to Restart", RESTART_HORIZONITAL_OFFSET, RESTART_HEIGHT);
	},
	restartHit: function() {
		Game.restart();
	}
}

var EndGameMessage = {
	show: function() {
		var context = canvas.getContext("2d"),
			score = Score.getCurrent();
		ClearCanvas();
		context.fillStyle = "black";
		context.font = "32px Veranda";
		context.fillText("You lasted " + score + " seconds", 120, 60);
		EndGameJoke(score, context);
		Score.updateHighScore();
	}
}

var Game = {
	hasStarted: 0,
	shouldStop: 0,
	intervalId: 0,
	restartTimerId: 0,
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
					Game.showRestart();
				}
			}, 1000/FPS);
		}
	},
	gameOver: function(reason) {
		this.stopGame();
	},
	showRestart: function() {
		clearInterval(this.intervalId);
		EndGameMessage.show();
		restartButton.show();
		Game.restartTimerId = setTimeout(
		  function()
		  {
		  	Game.restart();
		  }, 5000);
	},
	restart: function() {
		if (Game.shouldStop === 1)
		{
			clearTimeout(Game.restartTimerId);
			ClearCanvas();
			StartEverything();
		}
	},
	initialize: function() {
		this.hasStarted = 0;
		this.shouldStop = 0;
		clearInterval(Game.intervalId);
		Score.initialize();
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

	prizeBlocks.forEach(function(block) {
		if (Collides(block, player)) {
			block.explode();
			Score.blockHit(block);
		}
	})

	if (hitSomething === 1) {
		Game.gameOver();
	}
}

function Update() {
	Timer.update();
	player.update();
	maze.update();

	HandleCollisions();
}

function Draw() {
	ClearCanvas();

	player.draw(canvas);
	maze.draw();
	Score.draw();
}

function ClearCanvas() {
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}
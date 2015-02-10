
var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;

var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;

var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;

var GRAVITY = 8;
var PLAYER_SPEED = 12;

var canvas;

var edgeBlocks = [];
var mazeBlocks = [];

var gStopGame;

var gHasStarted;

// initialize when the DOM is loaded
$(document).ready(function() {
	gHasStarted = 0;
	gStopGame = 0;
	StartEverything();
});

function StartEverything() {
	InitializeCanvas();
	InitializeGame();
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

var player = {
	x: MAIN_WIDTH / 2,
	y: MAIN_HEIGHT / 2,
	rad: PLAYER_HEIGHT / 2,
	active: true,

	update: function() {
		if (keydown.left) {
			this.x -= PLAYER_SPEED;
		}

		if (keydown.right) {
			this.x += PLAYER_SPEED;
		}

		if (keydown.up) {
			this.y -= PLAYER_SPEED;
		}

		if (keydown.down) {
			this.y += PLAYER_SPEED;
		}
	},

	draw: function() {
		if (this.active)
		{
			var context = canvas.getContext("2d");
			context.beginPath();
			context.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
			context.closePath();

			context.fillStyle = 'black';
			context.fill();
		}
	},

	explode: function() {
		this.active = false;
	},

	unexplode: function() {
		this.active = true;
		this._placeAtStart();
	},

	_placeAtStart: function() {
		this.x = MAIN_WIDTH / 2;
		this.y = MAIN_HEIGHT / 2;
	}
}

var timer = {
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
		this.gameStartTime = (new Date).getTime();
	},
	stop: function() {
		this.active = false;
	},
	restart: function() {
		this._initializeTimer();
		this.active = true;
	}
}

var EndGame = {
	hitRestart: function() {
		timer.stop();
		gStopGame = 1;
		setTimeout(
		  function() 
		  {
		    RestartGame();
		  }, 5000);	
	},
	drawMessage: function() {
		var context = canvas.getContext("2d"),
			timePassed = timer.getSeconds();

		context.fillStyle = "black";
		context.font = "32px Veranda";
		context.fillText("You lasted " + timePassed, 120, 60);
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

function InitializeGame() {
	maze.initalize();
	if (gHasStarted === 0) 
	{
		gHasStarted = 1;
		setInterval(function() {
			if (gStopGame === 0)
			{		
				Update();
				Draw();
			}
			else
			{
				EndGame.drawMessage();
			}
		}, 1000/FPS);
	}
}

function RestartGame() {
	ClearCanvas();
	player.unexplode();
	timer.restart();
	StartEverything();
	gStopGame = 0;
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
		EndGame.hitRestart();
	}
}

function Update() {
	player.update();
	maze.update();

	HandleCollisions();
}

function Draw() {
	ClearCanvas();

	player.draw();
	maze.draw();
	timer.draw();
}

function ClearCanvas() {
		// clear canvas
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;

var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;

var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;

var GRAVITY = 2;

var canvas;

// initialize when the DOM is loaded
$(document).ready(function() {
	InitializeCanvas();
	InitializeGame();
});


function MazeBlock(x, y) {
	this.x = x;
	this.y = y;
	this.width = BLOCK_WIDTH;
	this.height = BLOCK_HEIGHT;
}

MazeBlock.prototype.update = function() {
	this.y += GRAVITY;
}

MazeBlock.prototype.draw = function() {
	var context = canvas.getContext("2d");
	context.fillStyle = 'blue';
	context.rect(this.x, this.y, this.width, this.height);
	context.fill();
}

var maze = {
	leftBlock: new MazeBlock(0, 0),
	rightBlock: new MazeBlock(MAIN_WIDTH - BLOCK_WIDTH, 0),

	update: function() {
		this.leftBlock.update();
		this.rightBlock.update();
	},

	draw: function() {
		this.leftBlock.draw();
		this.rightBlock.draw();
	}
}

var player = {
	x: MAIN_WIDTH / 2,
	y: MAIN_HEIGHT / 2,
	rad: PLAYER_HEIGHT / 2,

	update: function() {
		if (keydown.left) {
			this.x -= 3;
		}

		if (keydown.right) {
			this.x += 3;
		}

		if (keydown.up) {
			this.y -= 3;
		}

		if (keydown.down) {
			this.y += 3;
		}
	},

	draw: function() {
		var context = canvas.getContext("2d");
		context.beginPath();
		context.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
		context.fillStyle = 'black';
		context.fill();
	}
}

var timer = {
	gameStartTime: (new Date).getTime(),

	draw: function() {
		var context = canvas.getContext("2d"),
			timerSeconds = (((new Date).getTime() - this.gameStartTime) / 1000) | 0;

		context.fillStyle = "black";
		context.font = "32px Veranda";
		context.fillText(timerSeconds, 120, 60);
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
	context.rect(20, 20, staticCanvas.width - 40, staticCanvas.height - 40);
	context.fillStyle = 'green';
	context.fill();
}

function InitializeGame() {
	setInterval(function() {
		Update();
		Draw();
	}, 1000/FPS);
}

function Update() {
	player.update();
	maze.update();
}

function Draw() {
	// clear canvas
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	player.draw();
	maze.draw();
	timer.draw();
}


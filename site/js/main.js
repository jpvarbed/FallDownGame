
var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;

var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;

var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;

var GRAVITY = 2;

var canvas;

var edgeBlocks = [];
var mazeBlocks = [];

// initialize when the DOM is loaded
$(document).ready(function() {
	InitializeCanvas();
	InitializeGame();
});


function MazeBlock(x, y, h, w) {
	this.x = x;
	this.y = y;
	this.height = h;
	this.width = w;	
}

MazeBlock.prototype = {
	update: function() {
		this.y += GRAVITY;
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

	},

	update: function() {
		mazeBlocks.forEach(function(mazeBlock) {
			mazeBlock.update();
		})
		edgeBlocks.forEach(function(edgeBlock) {
			edgeBlock.draw();
		})
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
		context.closePath();

		context.fillStyle = 'black';
		context.fill();
	},

	explode: function() {
		this.active = false;
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
	context.fillStyle = 'green';
	context.fillRect(20, 20, staticCanvas.width - 40, staticCanvas.height - 40);
}

function InitializeGame() {
	maze.initalize();
	setInterval(function() {
		Update();
		Draw();
	}, 1000/FPS);
}

function Collides(a, b) {
	return a.x < b.x + b.rad*2 &&
		a.x + a.width > b.x &&
		a.y < b.y + b.rad*2 &&
		a.y + a.height > b.y;
}

function HandleCollisions() {
	mazeBlocks.forEach(function(mazeBlock) {
		if (collides(mazeBlock, player)) {
			player.explode();
		}
	})

	edgeBlocks.forEach(function(block) {
		if (Collides(block, player)) {
			player.explode();
		}
	})
}

function Update() {
	player.update();
	maze.update();

	//HandleCollisions();
}

function Draw() {
	// clear canvas
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	player.draw();
	maze.draw();
	timer.draw();
}


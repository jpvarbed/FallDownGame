
var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;
var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;
var PLAYER_WIDTH = 20;
var PLAYER_HEIGHT = 20;
var SIDEBAR_WIDTH = 20;
var BLOCK_HEIGHT = 32;
var BLOCK_WIDTH = 32;
var GRAVITY = 1;

var edgeBlocks = [];
var mazeBlocks = [];

function mazeBlock(x, y, h, w)
{
	this.x = x;
	this.y = y;
	this.h = h;
	this.w = w;

	this.update = update;

	function update() {
		this.y -= GRAVITY;
	}

	this.draw = draw;

	function draw(x, y) {
		var context = mainCanvas.getContext("2d");
		context.rect(x, y, h, w);
		context.fillStyle = 'blue';
		context.fill();
	}

	this.resize = resize;

	function resize(h, w) {
		var context = mainCanvas.getContext("2d");
		context.rect(x, y, h, w);
		context.fillStyle = 'blue';
		context.fill();
	}
}

var Maze = {
	draw: function() {
		var leftBlock = new mazeBlock(0, 0, SIDEBAR_WIDTH, mainCanvas.height);
		leftBlock.draw(0, 0);
		edgeBlocks.push(leftBlock);

		var rightBlock = new mazeBlock(mainCanvas.width - SIDEBAR_WIDTH, 0, SIDEBAR_WIDTH, mainCanvas.height);
		rightBlock.draw(mainCanvas.width - SIDEBAR_WIDTH);
		edgeBlocks.push(rightBlock);
	}
}

var player = {
	x: null,
	y: null,
	canvas: null,
	update: function() {
		
		playerCanvas.width = playerCanvas.width;

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
		// TODO: figure out how to draw relative to mainCanvas
		var context = playerCanvas.getContext("2d");
		var rad = PLAYER_HEIGHT / 2;
		context.beginPath();
		context.arc(this.x, this.y, rad, 0, 2 * Math.PI, false);
		context.fillStyle = 'black';
		context.fill();
	},

	explode: function() {
		this.active = false;
	}
}

var mainCanvas;
var playerCanvas;
var gameStartTime;

// initialize when the DOM is loaded
$(document).ready(function() {
	InitializeCanvas();
	InitializeGame();
});

function InitializeCanvas() {
	// background (main) canvas
	mainCanvas = $('#mainCanvas')[0];
	mainCanvas.width = MAIN_WIDTH;
	mainCanvas.height = MAIN_HEIGHT;
	
	var context = mainCanvas.getContext("2d");
	context.rect(20, 20, mainCanvas.width - 40, mainCanvas.height - 40);
	context.fillStyle = 'green';
	context.fill();
	
	// player
	playerCanvas = $('#playerCanvas')[0];
	playerCanvas.width = MAIN_WIDTH;
	playerCanvas.height = MAIN_HEIGHT;
}

function InitializeGame() {
	player.x = mainCanvas.width / 2;
	player.y = mainCanvas.height / 2;
	player.mainCanvas = mainCanvas;
	player.canvas = playerCanvas;


	Maze.draw();

	gameStartTime = (new Date).getTime();


	setInterval(function() {
		Update();
		Draw();
	}, 1000/FPS);
}

function collides(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}

function handleCollisions() {
	mazeBlocks.forEach(function(mazeBlock) {
		if (collides(mazeBlock, player)) {
			player.explode();
		}
	})

	edgeBlocks.forEach(function(block) {
		if (collides(block, player)) {
			player.explode();
		}
	})
}

function Update() {
	player.update();

	mazeBlocks.forEach(function(mazeBlock) {
		mazeBlock.update();
	})

	handleCollisions();
}

function Draw() {

	//var newBlock = new mazeBlock(100, 100, BLOCK_HEIGHT, BLOCK_WIDTH);

	// clear canvas
	var context = playerCanvas.getContext("2d");
	context.clearRect(0, 0, playerCanvas.width, playerCanvas.height);

	player.draw();

	// draw timer
	// TODO: put on correct canvas
	var timerSeconds = (((new Date).getTime() - gameStartTime) / 1000) | 0;
	context.fillStyle = "black";
	context.font = "32px Veranda";
	context.fillText(timerSeconds, 60, 60);
}


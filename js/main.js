
var FPS = 30;
var MAIN_WIDTH = 640;
var MAIN_HEIGHT = 480;
var PLAYER_WIDTH = 32;
var PLAYER_HEIGHT = 32;

var player = {
	x: null,
	y: null,
	mainCanvas: null,
	canvas: null,
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
		// TODO: figure out how to draw relative to mainCanvas
		var context = playerCanvas.getContext("2d");
		var rad = playerCanvas.width / 2;
		context.beginPath();
		context.arc(this.x, this.y, rad, 0, 2 * Math.PI, false);
		context.fillStyle = 'black';
		context.fill();
	}
}

var mainCanvas;
var playerCanvas;


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
	context.rect(20, 20, mainCanvas.width - 20, mainCanvas.height - 20);
	context.fillStyle = 'green';
	context.fill();
	
	// player
	playerCanvas = $('#playerCanvas')[0];
	playerCanvas.width = PLAYER_WIDTH;
	playerCanvas.height = PLAYER_HEIGHT;

	context = playerCanvas.getContext("2d");
	var centerX = playerCanvas.width / 2;
	var centerY = playerCanvas.height /2;
	var rad = playerCanvas.width / 2;
	context.beginPath();
	context.arc(centerX, centerY, rad, 0, 2 * Math.PI, false);
	context.fillStyle = 'black';
	context.fill();
}

function InitializeGame() {
	player.x = mainCanvas.width / 2;
	player.y = mainCanvas.height / 2;
	player.mainCanvas = mainCanvas;
	player.canvas = playerCanvas;

	setInterval(function() {
		Update();
		Draw();
	}, 1000/FPS);
}

function Update() {
	player.update();
}

function Draw() {
	player.draw();
}


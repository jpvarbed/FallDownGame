var Game = {
	hasStarted: 0,
	shouldStop: 0,
	intervalId: 0,
	restartTimerId: 0,
	mouseIsDown: false,
	stopGame: function(){
		Timer.stop();
		this.shouldStop = 1;
	},
	checkIfValid: function(object) {
		if (object.y > GAME_HEIGHT || object.x > GAME_WIDTH)
		{
			object.explode();
		}
	},
	runLoop: function() {
		if (this.hasStarted === 0) 
		{
			this.hasStarted = 1;
			this.intervalId = setInterval(function() {
				if (Game.shouldStop === 0)
				{		
					Update(Game.mouseIsDown);
					Draw(Game.mouseIsDown);
				}
				else
				{
					Game.showRestart();
				}
			}, 1000/FPS);
		}
	},
	mouseDown: function() {
		this.mouseIsDown = true;
	},
	mouseUp: function() {
		this.mouseIsDown = false;
	},
	gameOver: function(reason) {
		if (gDebug === 0)
		{
			this.stopGame();
		}
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
			GAME_WIDTH / 2,
			GAME_HEIGHT / 2,
			PLAYER_WIDTH,
			PLAYER_HEIGHT,
			PLAYER_SPEED);
		player.initialize();
		this.runLoop();
	}
}
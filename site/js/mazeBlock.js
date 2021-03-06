function MazeBlock(x, y, blockType) {
	this.x = x;
	this.y = y;
	var h = 0;
	var w = 0;
	this.color = 'blue';
	if (blockType === MAZE_BLOCK)
	{
		h = BLOCK_HEIGHT;
		w = BLOCK_WIDTH;
	}
	else if (blockType === PRIZE_BLOCK)
	{
		h = BLOCK_HEIGHT;
		w = BLOCK_WIDTH;
		this.color = 'red';
	}
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
		Game.checkIfValid(this);
	},

	draw: function() {
		var context = canvas.getContext("2d");
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	},
	
	explode: function() {
		this.active = false;
	},
	filter: function() {
		return this.active;
	}
}

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
	},
	
	explode: function() {
		this.active = false;
	}
}

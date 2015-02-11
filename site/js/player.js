function Player(startX, startY, width, height, moveSpeed) {
	this.x = startX;
	this.y = startY;
	this._startX = startX;
	this._startY = startY;
	this._moveSpeed = moveSpeed;
	this._mouseMoveSpeed = this._moveSpeed * 5;
	this.rad = width / 2;
	this.active = true;
}

Player.prototype = {
	initialize: function () {
		this.active = true;
		this._placeAtStart();
	},
	updateWithKeys: function() {
		if (keydown.left) {
			this.x -= this._moveSpeed;
		}	

		if (keydown.right) {
			this.x += this._moveSpeed;
		}

		if (keydown.up) {
			this.y -= this._moveSpeed;
		}

		if (keydown.down) {
			this.y += this._moveSpeed;
		}
	},
	moveFromDragValues: function()
	{
		if (mouseMoveValues["left"]) {
			this.x += mouseMoveValues["horizonital"];
		}	

		if (mouseMoveValues["right"]) {
			this.x -= mouseMoveValues["horizonital"];
		}

		if (mouseMoveValues["up"]) {
			this.y += mouseMoveValues["vertical"];
		}

		if (mouseMoveValues["down"]) {
			this.y -= mouseMoveValues["vertical"]
		}
	},
	updateWithMouseDrag: function(didMouseMove) {
		if (didMouseMove)
		{
			this.moveFromDragValues();
		}
	},
	update: function(didMouseMove) {
		this.updateWithKeys();
		this.updateWithMouseDrag(didMouseMove);

		if (this.y > MAIN_HEIGHT || this.x > MAIN_WIDTH)
		{
			this.active = false;
			Game.gameOver();
		}
	},
	draw: function(canvas, didMouseMove) {
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
		if (gDebug === 0)
		{
			this.active = false;
		}
	},

	_placeAtStart: function() {
		this.x = this._startX;
		this.y = this._startY;
	}
}
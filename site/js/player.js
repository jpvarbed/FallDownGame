var xTolerance = 20;
var yTolerance = xTolerance;
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
	update: function(isMouseDown) {
		this.updateWithKeys();
		this.updateWithMouseDrag(isMouseDown);

		Game.checkIfValid(this);
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
	updateWithMouseDrag: function(isMouseDown) {
		if (isMouseDown)
		{
			this.moveFromDragValues(mouseClick[mouseX], mouseClick[mouseY]);
		}
	},
	moveFromDragValues: function(x, y)
	{
		this.moveHorizonital(x);
		this.moveVertical(y);
	},
	moveHorizonital: function(x)
	{
		if (!this.isXChangeWithTolerance(x))
		{
			return;
		}
		if (x > this.x)
		{
			this.x += this._moveSpeed;
		}
		else if (x < this.x)
		{
			this.x -= this._moveSpeed;
		}
	},
	isXChangeWithTolerance: function(x)
	{
		var dist = Math.abs(this.x - x);
		return dist > xTolerance;
	},
	moveVertical: function(y)
	{
		if (!this.isYChangeWithTolerance(y))
		{
			return;
		}
		if (y > this.y)
		{
			this.y += this._moveSpeed;
		}
		else if (y < this.y)
		{
			this.y -= this._moveSpeed;
		}
	},
	isYChangeWithTolerance: function(y)
	{
		var dist = Math.abs(this.y - y);
		return dist > yTolerance;
	},
	draw: function(canvas, isMouseDown) {
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
			Game.gameOver();
		}
	},

	_placeAtStart: function() {
		this.x = this._startX;
		this.y = this._startY;
	}
}
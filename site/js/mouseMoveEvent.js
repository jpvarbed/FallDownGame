var mouseX = 0;
var mouseY = 1;
$(function() {
	window.mouseClick = {};
	$(document).mousedown(function(e) {
		mouseClick[mouseX] = e.pageX;
		mouseClick[mouseY] = e.pageY;
		Game.mouseDown();
	});
	$(document).mouseup(function(e) {
		Game.mouseUp();
	});
});
// initialize when the DOM is loaded
$(document).ready(function() {
	InitializeCanvas();
});

function InitializeCanvas() {
	// retrieve the HTML DOM object
	var canvas = $('#mainCanvas')[0];
	var context = canvas.getContext("2d");
	context.rect(20, 20, canvas.width - 20, canvas.height - 20);
	context.fillStyle = 'green';
	context.fill();
}
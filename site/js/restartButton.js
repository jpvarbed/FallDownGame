$(function() {
  $(document).mousedown(function(event) {
    x = event.pageX - canvas.offsetLeft;
  	y = event.pageY - canvas.offsetTop;
  	if (x >= RESTART_HORIZONITAL_OFFSET && y >= RESTART_HEIGHT) {
  		restartButton.restartHit();
  	}
  });
});
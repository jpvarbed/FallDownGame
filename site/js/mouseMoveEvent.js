$(function() {
	window.mouseMoveValues = {};
	$(document).mousedown(function(e) {
		var ref = arguments.callee;
		var startx = e.pageX;
		var starty = e.pageY;
		var handle = $(document);
		handle.unbind("mousedown", ref);
		handle.bind("mouseup", function(e){
			handle.unbind("mouseup", arguments.callee);
			handle.bind("mousedown", ref);
			var endx = e.pageX;
			var endy = e.pageY;
			var distancex = Math.abs(endx - startx);
			var distancey = Math.abs(endy - startx);
			if(distancex > 0){  // 100 is an arbitrary threshold
				var movedLeft = (endx > startx);
				mouseMoveValues["left"] = movedLeft;
				mouseMoveValues["right"] = !movedLeft;
			};
			if(distancey > 0){
				var movedUp = (endy > starty);
				mouseMoveValues["up"] = movedUp;
				mouseMoveValues["down"] = !movedUp;
			};
			if ((distancex > 0) || (distancey > 0))
			{
				Game.mouseMoved();
			};
			e.preventDefault();
			return false;
		});
	});
});
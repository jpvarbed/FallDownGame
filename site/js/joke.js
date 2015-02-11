
function EndGameJoke(score, context){
	var message = "bleh";
	context.fillStyle = "black";
	context.font = "32px Veranda";
	if (score > 60)
	{
		message = "Could be worse";
	}
	else if (score > 300)
	{
		message = "Passable";
	}
	else
	{
		message = "that's what she said"
	}
	context.fillText(message, 120, 120);
}
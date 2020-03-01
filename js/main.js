var game = new app();
document.addEventListener("DOMContentLoaded", function() {
	game.setup();

	game.loop = setInterval(function() {
		game.draw();
	},50);
});
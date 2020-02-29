document.addEventListener("DOMContentLoaded", function() {
	setup();

	loop = setInterval(function() {
		draw();
	},50);
});
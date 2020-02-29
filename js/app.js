var size = { width: window.innerWidth * 0.85, height: window.innerHeight  * 0.85 };
var cols = 8;
var rows = 5;
var cellsize = { width: size.width / cols, height: size.height / rows };
var loop;
var board;
var cells = [];
var plants = [];
var bullets = [];
var creepers = [];
var info = document.querySelector("#info");
var main = document.querySelector("#game");
var test;
var plantSelector;
var plantCollection = [];
var selectedPlant;
var leaves = [];
var treasure = 0;
var gameOver = false;
var displayTreasure = document.createElement("div");
displayTreasure.classList.add("display-treasure");
var plantTypes = [
	{ 	
		sprite: "leaftree",
		life: 50,
		damage: 0,
		attackSpeed: 5,
		suns: true,
		price: 50,
		cooldown: 1000
	},
	{ 	
		sprite: "spitflower",
		life: 50,
		damage: 10,
		attackSpeed: 3,
		suns: false,
		price: 100,
		cooldown: 3000
	},
	{ 	
		sprite: "hardtree",
		life: 100,
		damage: 0,
		attackSpeed: 0,
		suns: false,
		price: 50,
		cooldown: 3000
	}
];
function setup() {
	board = document.createElement("div");
	plantSelector = document.createElement("div");
	
	board.classList.add("board");
	board.style.width = size.width + "px";
	board.style.height = size.height + "px"; 

	plantSelector.classList.add("plantSelector");
	plantSelector.style.width = cellsize.width + "px"; 
	plantSelector.style.height = size.height + "px"; 
	
	plantTypes.forEach(function(type) {
		plantCollection.push(new plantSelect(type));

	});

	plantCollection.forEach(function(plantItem) {
		plantSelector.appendChild(plantItem.sprite);
	});

	for(var i = 0; i < rows; i++) {
		cells.push(new Array());
		for(var j = 0; j < cols; j++) {
			cells[i].push(new cell(j * cellsize.width, i * cellsize.height));
			board.appendChild(cells[i][j].sprite);
		}		
	}
	info.appendChild(displayTreasure);
	main.appendChild(plantSelector);
	main.appendChild(board);
	updateDisplayTreasure();
}

var frameCount = 0;
function draw() {
	for(var i = 0; i < bullets.length; i++) {
		if(bullets[i].dispose) {
			bullets.splice(i,1);
		} else {
			bullets[i].update();
			for(var c = 0; c < creepers.length; c++) {
				if(checkCollition(bullets[i], creepers[c])) {
					bullets[i].dispose = true;
					bullets[i].sprite.remove();
					creepers[c].takeDamage(bullets[i].damage);
					console.log("BOOM!");
					break;
				}
			}
		}
	}

	for(var i = 0; i < creepers.length; i++) {
		if(creepers[i].dispose) {
			creepers.splice(i,1);
		} else {
			creepers[i].update();
			var currentRow = creepers[i].y / cellsize.height;
			for(var c = 0; c < cells[currentRow].length; c++) {
				if(cells[currentRow][c].plant) {
					if(checkPlant(creepers[i], cells[currentRow][c])) {
						creepers[i].eating = true;
						cells[currentRow][c].plant.takeDamage(creepers[i].damage);
						if(cells[currentRow][c].plant.dispose) {
							cells[currentRow][c].plant = null;
							creepers[i].eating = false;
						}
					}
				}
			}
		}
	}

	for(var i = 0; i < leaves.length; i++) {
		if(leaves[i].used) {
			leaves.splice(i,1);
		} else {
			leaves[i].update();
		}
	}
	if(frameCount % 100 == 0) {
		addRandomCreeper();
	}
	if(frameCount % 200 == 0) {
		addRandomLeaf();
	}
	frameCount++;
}

function addRandomCreeper() {
	var position = Math.floor(Math.random() * rows);
	var newCreeper = new creeper((size.width), position * cellsize.height, "creeper1", 50, 1, 1, 1); 
	board.appendChild(newCreeper.sprite);
	creepers.push(newCreeper);
}

function addRandomLeaf() {
	var position = Math.floor(Math.random() * cols);
	var randomEnd = Math.floor(Math.random() * size.height);
	addLeaf({x: position * cellsize.width, y: 0 - cellsize.height},{x: position * cellsize.width, y: randomEnd});	
}

function addLeaf(ini, end) {
	var newLeaf = new leaf(ini, end, 10); 
	board.appendChild(newLeaf.sprite);
	leaves.push(newLeaf);
}

function updateDisplayTreasure() {
	var content = document.createElement("div");
	var digits = treasure.toString().split("");
	digits.forEach(function(d) {
		content.appendChild(new number(d));
	});
	content.classList.add("digits");
	while(displayTreasure.firstChild) {
		displayTreasure.removeChild(displayTreasure.firstChild);
	}
	displayTreasure.appendChild(content);

	plantCollection.forEach(function(p) {
		if(treasure >= p.price) {
			p.sprite.style.filter = "none";
		} else {
			p.sprite.style.filter = "brightness(75%)";
		}
	});
}

function number(n) {
	var sprite = document.createElement("div");
	sprite.classList.add("number");
	sprite.style.backgroundImage = "url('img/" + n + ".jpg')";
	return sprite;
}

function addBullet(x,y,damage) {
	var newbullet = new bullet(x,y,damage);
	board.appendChild(newbullet.sprite);
	bullets.push(newbullet);
}

function checkCollition(a,b) {
	return(	a.y >= b.y && 
			a.y <= b.y + cellsize.height &&
			a.x >= b.x &&
			a.x <= b.x + cellsize.width
		);
}

function checkPlant(a,b) {
	if(b.plant == null) {
		return false;
	} else {
		return(	a.x >= b.x + cellsize.width / 2 &&
				a.x <= b.x + cellsize.width / 2
			);
	}
}

function finishGame() {
	clearInterval(loop);
	gameOver = true;
}
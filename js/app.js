var size = { width: 800, height: 500 };
var cols = 8;
var rows = 5;
var cellsize = { width: size.width / cols, height: size.height / rows };
var loop;
var board;
var cells = [];
var plants = [];
var creepers = [];
var main = document.querySelector("#game");
var test;
var plantSelector;
var plantCollection = [];
var selectedPlant;
var leaves = [];
var treasure = 0;
var displayTreasure = document.createElement("div");
displayTreasure.classList.add("display-treasure");
var plantTypes = [
	{ 	
		sprite: "leaftree",
		life: 50,
		damage: 0,
		attackSpeed: 0,
		suns: true,
		price: 50,
		cooldown: 1000
	},
	{ 	
		sprite: "spitflower",
		life: 50,
		damage: 10,
		attackSpeed: 3,
		suns: true,
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
	plantSelector.style.width = size.width + "px";
	plantSelector.style.height = size.height / rows + "px"; 
	
	plantTypes.forEach(function(type) {
		plantCollection.push(new plantSelect(type));

	});

	plantCollection.forEach(function(plantItem) {
		plantSelector.appendChild(plantItem.sprite);
	});

	for(var i = 0; i < cols; i++) {
		cells.push(new Array());
		for(var j = 0; j < cols; j++) {
			cells[i].push(new cell(i * cellsize.width, j * cellsize.height));
			board.appendChild(cells[i][j].sprite);
		}		
	}
	main.appendChild(board);
	main.appendChild(plantSelector);
	main.appendChild(displayTreasure);
}

var frameCount = 0;
function draw() {
	creepers.forEach(function(creeper) {
		creeper.update();
	});
	for(var i = 0; i < leaves.length; i++) {
		if(leaves[i].used) {
			leaves.splice(i,1);
		} else {
			leaves[i].update();
		}

	}
	if(frameCount == 5) {
		addRandomLeaf();
		addRandomCreeper();
		frameCount = 0;
	} else {
		frameCount++
	}
}

function addRandomCreeper() {
	var position = Math.floor(Math.random() * rows);
	var newCreeper = new creeper((size.width), position * cellsize.height, "creeper1", 1, 1, 1, 10); 
	board.appendChild(newCreeper.sprite);
	creepers.push(newCreeper);
}

function addRandomLeaf() {
	var position = Math.floor(Math.random() * cols);
	var randomEnd = Math.floor(Math.random() * size.height);
	var newLeaf = new leaf({x: position * cellsize.width, y: 0 - cellsize.height},{x: position * cellsize.width, y: randomEnd} , 10); 
	board.appendChild(newLeaf.sprite);
	leaves.push(newLeaf);
}

loop = setInterval(function() {
	draw();
},1000);

function updateDisplayTreasure() {
	displayTreasure.innerText = treasure;
}

setup();
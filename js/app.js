function app() {
	var self = this;
	self.size = { width: window.innerWidth * 0.85, height: window.innerHeight  * 0.85 };
	self.cols = 8;
	self.rows = 5;
	self.cellsize = { width: self.size.width / self.cols, height: self.size.height / self.rows };
	self.loop;
	self.board;
	self.cells = [];
	self.plants = [];
	self.bullets = [];
	self.creepers = [];
	self.info = document.querySelector("#info");
	self.main = document.querySelector("#game");
	self.test;
	self.plantSelector;
	self.plantCollection = [];
	self.selectedPlant;
	self.leaves = [];
	self.treasure = 0;
	self.gameOver = false;
	self.frameCount = 0;
	self.displayTreasure = document.createElement("div");
	self.displayTreasure.classList.add("display-treasure");

	self.setup = function() {
		self.board = document.createElement("div");
		self.plantSelector = document.createElement("div");
		
		self.board.classList.add("board");
		self.board.style.width = self.size.width + "px";
		self.board.style.height = self.size.height + "px"; 

		self.plantSelector.classList.add("plantSelector");
		self.plantSelector.style.width = self.cellsize.width + "px"; 
		self.plantSelector.style.height = self.size.height + "px"; 
		
		plantTypes.forEach(function(type) {
			self.plantCollection.push(new plantSelect(type, self));
		});

		self.plantCollection.forEach(function(plantItem) {
			self.plantSelector.appendChild(plantItem.sprite);
		});

		for(var i = 0; i < self.rows; i++) {
			self.cells.push(new Array());
			for(var j = 0; j < self.cols; j++) {
				self.cells[i].push(new cell(j * self.cellsize.width, i * self.cellsize.height, self));
				self.board.appendChild(self.cells[i][j].sprite);
			}		
		}
		self.info.appendChild(self.displayTreasure);
		self.main.appendChild(self.plantSelector);
		self.main.appendChild(self.board);
		self.updateDisplayTreasure();
	}

	self.draw = function() {
		for(var i = 0; i < self.bullets.length; i++) {
			if(self.bullets[i].dispose) {
				self.bullets.splice(i,1);
			} else {
				self.bullets[i].update();
				for(var c = 0; c < self.creepers.length; c++) {
					if(self.checkCollition(self.bullets[i], self.creepers[c])) {
						self.bullets[i].dispose = true;
						self.bullets[i].sprite.remove();
						self.creepers[c].takeDamage(self.bullets[i].damage);
						break;
					}
				}
			}
		}

		for(var i = 0; i < self.creepers.length; i++) {
			if(self.creepers[i].dispose) {
				self.creepers.splice(i,1);
			} else {
				self.creepers[i].update();
				var currentRow = self.creepers[i].y / self.cellsize.height;
				for(var c = 0; c < self.cells[currentRow].length; c++) {
					if(self.cells[currentRow][c].plant) {
						if(self.checkPlant(self.creepers[i], self.cells[currentRow][c])) {
							self.creepers[i].eating = true;
							self.cells[currentRow][c].plant.takeDamage(self.creepers[i].damage);
							if(self.cells[currentRow][c].plant.dispose) {
								self.cells[currentRow][c].plant = null;
								self.creepers[i].eating = false;
							}
						}
					}
				}
			}
		}

		for(var i = 0; i < self.leaves.length; i++) {
			if(self.leaves[i].used) {
				self.leaves.splice(i,1);
			} else {
				self.leaves[i].update();
			}
		}
		if(self.frameCount % 100 == 0) {
			self.addRandomCreeper();
		}
		if(self.frameCount % 200 == 0) {
			self.addRandomLeaf();
		}
		self.frameCount++;
	}

	/*
	*	Inserts a new creeper instance in a random row
	*/
	self.addRandomCreeper = function() {
		var position = Math.floor(Math.random() * self.rows);
		var newCreeper = new creeper(
								self.size.width, 
								position * self.cellsize.height, 
								"creeper1",
								50,
								1, 
								1, 
								1,
								self
							); 
		self.board.appendChild(newCreeper.sprite);
		self.creepers.push(newCreeper);
	}

	self.addRandomLeaf = function() {
		var position = Math.floor(Math.random() * self.cols);
		var randomEnd = Math.floor(Math.random() * self.size.height);
		self.addLeaf(
				{x: position * self.cellsize.width, y: 0 - self.cellsize.height},
				{x: position * self.cellsize.width, y: randomEnd},
				self
			);	
	}

	self.addLeaf = function(ini, end, parent) {
		var newLeaf = new leaf(
								ini, 
								end, 
								10, 
								parent
							); 
		self.board.appendChild(newLeaf.sprite);
		self.leaves.push(newLeaf);
	}

	self.updateDisplayTreasure = function() {
		var content = document.createElement("div");
		var digits = self.treasure.toString().split("");
		digits.forEach(function(d) {
			content.appendChild(new self.number(d));
		});
		content.classList.add("digits");
		while(self.displayTreasure.firstChild) {
			self.displayTreasure.removeChild(self.displayTreasure.firstChild);
		}
		self.displayTreasure.appendChild(content);

		self.plantCollection.forEach(function(p) {
			if(self.treasure >= p.price) {
				p.sprite.style.filter = "none";
			} else {
				p.sprite.style.filter = "brightness(75%)";
			}
		});
	}

	self.number = function(n) {
		var sprite = document.createElement("div");
		sprite.classList.add("number");
		sprite.style.backgroundImage = "url('img/" + n + ".jpg')";
		return sprite;
	}

	self.addBullet = function(x,y,damage) {
		var newbullet = new bullet(x, y, damage, self);
		self.board.appendChild(newbullet.sprite);
		self.bullets.push(newbullet);
	}

	self.checkCollition = function(a,b) {
		return(	a.y >= b.y && 
				a.y <= b.y + self.cellsize.height &&
				a.x >= b.x &&
				a.x <= b.x + self.cellsize.width
			);
	}

	self.checkPlant = function(a,b) {
		if(b.plant == null) {
			return false;
		} else {
			return(	a.x >= b.x  &&
					a.x <= b.x + self.cellsize.width / 2
				);
		}
	}

	self.finishGame = function() {
		clearInterval(self.loop);
		self.gameOver = true;
	}

}
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
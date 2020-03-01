/*
*	plant constructor
*	
*	This function creates an instance of plant
*
*	Arguments:
*		type: (json) an object contaning the initial properties
*				of the plant.
*/

function plant(type, parent) {
	var self = this;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("selector");
	self.sprite.style.backgroundImage = "url('img/" + type.sprite + ".jpg')";
	self.sprite.style.width = parent.size.width / parent.cols + "px";
	self.sprite.style.height = parent.size.height / parent.rows + "px";
	self.life = type.life;
	self.damage = type.damage;
	self.attackSpeed = type.attackSpeed;
	self.suns = type.suns;
	self.dispose = false;

	self.shoot = function(x,y) {
		parent.addBullet(x,y, self.damage);
	}

	self.dropLeaf = function(x,y,x_,y_) {
		parent.addLeaf({x:x,y:y},{x:x_,y:y_}, parent)
	}

	self.takeDamage = function(d) {
		self.life -= d;
		self.sprite.style.opacity = Math.max((self.life / type.life),0.5);
		if(self.life <= 0) {
			self.dispose = true;
			self.damage = 0;
			self.suns = false;
			self.sprite.remove();
		}
	}
}

/*
*	plantSelect constructor
*	
*	This function creates an instance of plant selector
*
*	Arguments:
*		type: (json) an object contaning the initial properties
*				of the plant.
*/

function plantSelect(type, parent) {
	var self = this;
	self.price = type.price;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("selector");
	self.sprite.style.backgroundImage = "url('img/" + type.sprite + ".jpg')";
	self.sprite.style.width = parent.size.width / parent.cols + "px";
	self.sprite.style.height = parent.size.height / parent.rows + "px";
	self.type = type;
	self.ready = true;

	self.sprite.addEventListener("click", function() {
		if(self.ready && self.price <= parent.treasure) {
			parent.selectedPlant = self;
			parent.plantCollection.forEach(function(sel) {
				sel.sprite.style.border = "none"
			});
			self.sprite.style.border = "4px solid yellow"
		}
	});
}

/*
*	cell constructor
*	
*	This function creates an instance of cell
*
*	Arguments:
*		x: (numeric) cell origin's x position
*		y: (numeric) cell origin's y position
*/

function cell(x,y, parent) {
	var self = this;
	self.x = x;
	self.y = y;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("cell");
	// self.sprite.style.backgroundImage = "url('img/" + sprite + ".jpg')";
	self.sprite.style.width = parent.size.width / parent.cols + "px";
	self.sprite.style.height = parent.size.height / parent.rows + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";
	self.plant = null;
	self.plantSeed = function(p) {
		if(self.plant == null) {
			self.plant = new plant(p.type, parent);
			self.sprite.appendChild(self.plant.sprite);
			if(self.plant.damage > 0) {
				var action = setInterval(function() {
					if(!parent.gameOver) {
						self.plant.shoot(self.x + parent.cellsize.width / 2, self.y  + parent.cellsize.height / 2);
					} else {
						clearInterval(action);
					}
				}, self.plant.attackSpeed * 1000);
			}

			if(self.plant.suns) {
				var action = setInterval(function() {
					if(!parent.gameOver) {
						self.plant.dropLeaf(self.x + parent.cellsize.width / 2, self.y, self.x + parent.cellsize.width / 2, self.y + parent.cellsize.height * 0.75);
					} else {
						clearInterval(action);
					}
				}, self.plant.attackSpeed * 1000);
			}
		}
	}

	self.sprite.addEventListener("click", function() {
		if(parent.selectedPlant && self.plant == null) {
			parent.treasure -= parent.selectedPlant.type.price;
			parent.updateDisplayTreasure();
			var temp = parent.selectedPlant;
			parent.selectedPlant = null;
			temp.sprite.style.border = "none"
			self.plantSeed(temp);
			temp.ready = false;
			temp.sprite.style.opacity = ".3"
			setTimeout(function() {
				temp.ready = true;
				temp.sprite.style.opacity = "1";
			}, temp.type.cooldown);
		}

	});
}

/*
*	leaf constructor
*	
*	This function creates an instance of leaf
*
*	Arguments:
*		start: x initial position
*		end: y end position
*		velocity: movement (falling) speed
*/

function leaf(start, end, velocity, parent) {
	var self = this;
	self.x = start.x;
	self.y = start.y;
	self.pos = {x: end.x, y: end.y};
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.classList.add("leaf");
	self.sprite.style.backgroundImage = "url('img/leaf.jpg')";
	self.sprite.style.width = parent.size.width / parent.cols / 2 + "px";
	self.sprite.style.height = parent.size.height / parent.rows / 4 + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";

	self.velocity = velocity;
	self.used = false;

	self.update = function() {
		if(self.velocity > 0) {
			self.move();
		}
		self.draw();
	}

	self.move = function() {
		self.y += self.velocity;
		if(self.y >= self.pos.y) {
			self.y = self.pos.y;
			self.velocity = 0;
			setTimeout(function() {
				self.used = true;
				self.sprite.remove();
			}, 3000);
		}
	}

	self.draw = function() {
		self.sprite.style.top = self.y + "px";
	}

	self.sprite.addEventListener("click", function() {
		parent.treasure += 50;
		parent.updateDisplayTreasure();
		self.sprite.remove();
		self.used = true;
	});
}

/*
*	bullet constructor
*	
*	This function creates an instance of bullet
*
*	Arguments:
*		x: (numeric) x initial position
*		y: (numeric) y initial position
*		damage: (numeric) amount of damage to inflict
*/

function bullet(x,y,damage, parent) {
	var self = this;
	self.x = x;
	self.y = y;
	self.damage = damage;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.classList.add("leaf");
	self.sprite.style.backgroundImage = "url('img/bullet.jpg')";
	self.sprite.style.width = parent.size.width / parent.cols / 2 + "px";
	self.sprite.style.height = parent.size.height / parent.rows / 5 + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";

	self.velocity = 20;
	self.dispose = false;

	self.update = function() {
		if(self.velocity > 0 && !self.dispose) {
			self.move();
		}
		self.draw();
	}

	self.move = function() {
		self.x += self.velocity;
		if(self.x >= parent.size.width) {
			self.velocity = 0;
			self.dispose = true;
			self.sprite.remove();
		}
	}

	self.draw = function() {
		self.sprite.style.left = self.x + "px";
	}
}
function plant(type) {
	var self = this;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("selector");
	self.sprite.style.backgroundImage = "url('img/" + type.sprite + ".jpg')";
	self.sprite.style.width = size.width / cols + "px";
	self.sprite.style.height = size.height / rows + "px";
	self.life = type.life;
	self.damage = type.damage;
	self.attackSpeed = type.attackSpeed;
	self.suns = type.suns;
	self.dispose = false;

	self.shoot = function(x,y) {
		addBullet(x,y, self.damage);
	}

	self.dropSun = function(x,y,x_,y_) {
		addLeaf({x:x,y:y},{x:x_,y:y_})
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

function plantSelect(type) {
	var self = this;
	self.price = type.price;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("selector");
	self.sprite.style.backgroundImage = "url('img/" + type.sprite + ".jpg')";
	self.sprite.style.width = size.width / cols + "px";
	self.sprite.style.height = size.height / rows + "px";
	self.type = type;
	self.ready = true;

	self.sprite.addEventListener("click", function() {
		if(self.ready && self.price <= treasure) {
			selectedPlant = self;
			plantCollection.forEach(function(sel) {
				sel.sprite.style.border = "none"
			});
			self.sprite.style.border = "4px solid yellow"
		}
	});
}

function cell(x,y) {
	var self = this;
	self.x = x;
	self.y = y;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("cell");
	// self.sprite.style.backgroundImage = "url('img/" + sprite + ".jpg')";
	self.sprite.style.width = size.width / cols + "px";
	self.sprite.style.height = size.height / rows + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";
	self.plant = null;
	self.plantSeed = function(p) {
		if(self.plant == null) {
			self.plant = new plant(p.type);
			self.sprite.appendChild(self.plant.sprite);
			if(self.plant.damage > 0) {
				var action = setInterval(function() {
					if(!gameOver) {
						self.plant.shoot(self.x + cellsize.width / 2, self.y  + cellsize.height / 2);
					} else {
						clearInterval(action);
					}
				}, self.plant.attackSpeed * 1000);
			}

			if(self.plant.suns) {
				var action = setInterval(function() {
					if(!gameOver) {
						self.plant.dropSun(self.x + cellsize.width / 2, self.y, self.x + cellsize.width / 2, self.y + cellsize.height * 0.75);
					} else {
						clearInterval(action);
					}
				}, self.plant.attackSpeed * 1000);
			}
		}
	}

	self.sprite.addEventListener("click", function() {
		if(selectedPlant && self.plant == null) {
			treasure -= selectedPlant.type.price;
			updateDisplayTreasure();
			var temp = selectedPlant;
			selectedPlant = null;
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

function leaf(start, end, velocity) {
	var self = this;
	self.x = start.x;
	self.y = start.y;
	self.pos = {x: end.x, y: end.y};
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.classList.add("leaf");
	self.sprite.style.backgroundImage = "url('img/leaf.jpg')";
	self.sprite.style.width = size.width / cols / 2 + "px";
	self.sprite.style.height = size.height / rows / 4 + "px";
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
		treasure += 50;
		updateDisplayTreasure();
		self.sprite.remove();
		self.used = true;
	});
}

function bullet(x,y,damage) {
	var self = this;
	self.x = x;
	self.y = y;
	self.damage = damage;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.classList.add("leaf");
	self.sprite.style.backgroundImage = "url('img/bullet.jpg')";
	self.sprite.style.width = size.width / cols / 2 + "px";
	self.sprite.style.height = size.height / rows / 5 + "px";
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
		if(self.x >= size.width) {
			self.velocity = 0;
			self.dispose = true;
			self.sprite.remove();
		}
	}

	self.draw = function() {
		self.sprite.style.left = self.x + "px";
	}
}
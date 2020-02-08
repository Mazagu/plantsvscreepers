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
	self.sprite.style.backgroundImage = "url('img/leaf.jpg')";
	self.sprite.style.width = size.width / cols / 2 + "px";
	self.sprite.style.height = size.height / rows / 4 + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";

	self.velocity = velocity;
	self.used = false;

	self.update = function() {
		self.move();
		self.draw();
	}

	self.move = function() {
		self.y += self.velocity;
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
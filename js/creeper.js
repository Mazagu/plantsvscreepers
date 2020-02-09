function creeper(x, y, sprite, life, damage, attackSpeed, velocity) {
	var self = this;
	self.x = x;
	self.y = y;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.classList.add("creeper");
	self.sprite.style.backgroundImage = "url('img/" + sprite + ".jpg')";
	self.sprite.style.width = size.width / cols + "px";
	self.sprite.style.height = size.height / rows + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";
	self.life = life;
	self.damage = damage;
	self.attackSpeed = attackSpeed;
	self.velocity = velocity;
	self.dispose = false;
	self.eating = false;

	self.takeDamage = function(d) {
		self.life -= d;
		self.sprite.style.opacity = Math.max((self.life / life),0.5);
		if(self.life <= 0) {
			self.dispose = true;
			self.velocity = 0;
			self.sprite.remove();
		}
	}

	self.update = function() {
		if(self.velocity > 0 && !self.dispose && !self.eating) {
			self.move();
		}
		self.draw();
	}

	self.move = function() {
		self.x -= self.velocity;
		if(self.x <= 0 - cellsize.width) {
			self.dispose = true;
			self.sprite.remove();
			self.velocity = 0;
			finishGame();
		}
	}

	self.draw = function() {
		self.sprite.style.left = self.x + "px";
	}
}
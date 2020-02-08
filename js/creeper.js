function creeper(x, y, sprite, life, damage, attackSpeed, velocity) {
	var self = this;
	self.x = x;
	self.y = y;
	self.sprite = document.createElement("div");
	self.sprite.classList.add("sprite");
	self.sprite.style.backgroundImage = "url('img/" + sprite + ".jpg')";
	self.sprite.style.width = size.width / cols + "px";
	self.sprite.style.height = size.height / rows + "px";
	self.sprite.style.left = self.x + "px";
	self.sprite.style.top = self.y + "px";
	self.life = life;
	self.damage = damage;
	self.attackSpeed = attackSpeed;
	self.velocity = velocity;


	self.update = function() {
		self.move();
		self.draw();
	}

	self.move = function() {
		self.x -= self.velocity;
	}

	self.draw = function() {
		self.sprite.style.left = self.x + "px";
	}
}
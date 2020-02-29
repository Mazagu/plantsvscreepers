/*
*	creeper constructor
*	
*	This function creates an instance of enemy
*
*	Arguments:
*		x: (numeric) initial x position in pixels
*		y: (numeric) initial y position in pixels
*		sprite: (string) the name of the image to display
*		life: (numeric) amount of damage that can take
*		damage: (numeric) amount of damage that inflicts
*		attackSpeed: (numeric) number of attacks per unit of time
*		velocity: (numeric) movement speed
*
*	Properties:
*		x: (numeric) current x position in pixels
*		y: (numeric) current y position in pixels
*		sprite: (DOM element)
*			This is the element to display
*		life: (numeric) current life left
*		damage: (numeric) current damage to inflict
*		attackSpeed: (numeric) current attack speed
*		velocity: (numeric) current movement speed
*		dispose: (bool) when set to true the instance will be removed
*		eating: (bool) when set to true the creeper stops moving
*				and inflicts damage to the plant in the cell
*
*	Methods:
*		takeDamage(d)
*			d:  (numeric) damage inflicted to the creeper
*			updates the life and checks if it's dead
*		update()
*			function to call in the loop
*		move()
*			updates the position of the creeper
*			checks if it arrives to the end
*		draw()
*			updates the position of the sprite
*/

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
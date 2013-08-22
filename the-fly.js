Object.getOwnPropertyNames(window.Math).forEach(function (method) {
	window[method] = Math[method];
});

function moveObj(obj) {
	obj.x += cos(obj.angle) * obj.speed;
	obj.y += sin(obj.angle) * obj.speed;
}

function toRadians(angle) {
	return angle * PI / 180;
}
var canvas = document.querySelectorAll('canvas')[0],
	ctx = canvas.getContext('2d'),
	mouse = {
		x: 0,
		y: 0,
		isDown: false
	},
	count = 0,
	ninetyDegrees = toRadians(90),
	flies = [];


function Fly() {
	this.x = random() * canvas.width * 0.8;
	this.y = random() * canvas.height * 0.8;
	this.size = 15;
	this.speed = random() * 3;
	this.angle = toRadians(random() * 360);
	this.killed = false;
	this.fade = 1;

	var blood = [],
		lastUpdate = new Date().getTime();
	this.draw = function (now) {
		this.halfSize = this.size / 2;
		if (this.killed) {
			if (!blood.length) {
				var i = 40;
				while (i--) {
					blood.push({
						x: this.x,
						y: this.y,
						speed: random() * 3,
						size: random() * this.halfSize,
						angle: toRadians(random() * 360)
					})
				}
			}
			var _this = this;
			blood.forEach(function (p) {
				moveObj(p);
				ctx.save();
				ctx.translate(p.x + p.size / 2, p.y - p.size / 2);
				ctx.rotate(p.angle);
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,0,0,' + _this.fade + ')';
				ctx.rect(0, 0, p.size, p.size);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			});

			this.fade -= 0.05;

		} else {
			this.delta = lastUpdate - now;
			if (this.delta <= 0) {
				this.angle += toRadians((random() * 360) - 180);
				lastUpdate = now + random() * 500 + 500;
			} else if (this.x <= 0 || this.x >= canvas.width || this.y <= 0 || this.y >= canvas.height) {
				this.angle -= toRadians(180);
			}

			ctx.save();
			ctx.translate(this.x + this.halfSize, this.y + this.halfSize);
			ctx.rotate(this.angle + ninetyDegrees);
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0,0,0,0.7)';
			ctx.rect(-this.halfSize, -this.halfSize, this.size, this.size);
			ctx.fill();
			ctx.closePath();
			flyFactor = random() * 7;
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0,0,0,0.2)';
			ctx.rect(-10 - this.halfSize, -flyFactor + 7 - this.halfSize, this.size, this.size / 2);
			ctx.rect(+10 - this.halfSize, -flyFactor + 7 - this.halfSize, this.size, this.size / 2);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}

	};
}

function render() {
	var now = new Date().getTime();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgb(' + (count * 20 < 255 ? (count * 20) : 255) + ',0,0)';
	ctx.fillText('F1y K!ll3d: ' + count, 66, 33);
	flies.forEach(function (fly, i) {
		moveObj(fly);
		var x = mouse.x - fly.halfSize,
			y = mouse.y - fly.halfSize;
		if (
			mouse.isDown &&
			x > fly.x &&
			x < fly.x + fly.size &&
			y > fly.y &&
			y < fly.y + fly.size) {
			fly.killed = true;
		}
		fly.draw(now);
		if (fly.fade <= 0) {
			flies.splice(i, 1);
			flies.push(new Fly());
			count++;
			flies.forEach(function (_fly) {
				_fly.speed += count * 0.01;
			})
		}

	});
	mouse.isDown = false;
	requestAnimationFrame(render);
}

var i = 10;
while (i--) {
	flies.push(new Fly());
}

canvas.addEventListener('mousemove', function (e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
});
canvas.addEventListener('mousedown', function () {
	mouse.isDown = true;
});
canvas.addEventListener('mouseup', function () {
	mouse.isDown = false;
});

ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillStyle = 'rgb(255,0,0)';
ctx.fillText('K!ll th3m 4ll!', 333, 166.5);
ctx.font = '14px Arial';

setTimeout(render, 3000);
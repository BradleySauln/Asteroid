(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

	// Start Object Extend. Can have a base object and then overwrite
	if (!Object.prototype.extend) {

 		Object.prototype.extend = function (object) {

		   for (var key in object) {

		     if (typeof object[key] === 'object' &&
		         typeof this[key] === 'object'   &&
		         this.hasOwnProperty(key)) {

		       this[key].extend(object[key]);

		     } else {
		       this[key] = object[key];
		     }
		   }
		   return this;
		 };
	}
	// End
			// Start Vector Library - Can reuse this for other stuff :)
 	var Vector = require('./vector');

	window.addEventListener('DOMContentLoaded', function () {
		console.log('DOM Loaded');

		var canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d'),
			looping = false,
			models = {
				'asteroidOne': {
					'x': 100,
					'y': 100,
					'mass': 10,
					'size': 50,
					'angle': {
						'x': 90,
						'y': 90
					},

					'velocity': 100,
					'color': '#fff'
				},

				'asteroidTwo': {
					'x': 400,
					'y': 400,
					'mass': 10,
					'size': 50,
					'angle': {
						'x': -90,
						'y': -90
					},
					'velocity': 100,
					'color': '#33b'
				}
			};

		models.asteroidOne.extend(Vector(models.asteroidOne.x, models.asteroidOne.y));
		models.asteroidTwo.extend(Vector(models.asteroidTwo.x, models.asteroidTwo.y));
		models.asteroidOne.angle.extend(Vector(models.asteroidOne.angle.x, models.asteroidOne.angle.y));
		models.asteroidTwo.angle.extend(Vector(models.asteroidTwo.angle.x, models.asteroidTwo.angle.y));


		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		canvas.addEventListener('click', function (event) {

			var x = event.clientX,
				y = event.clientY;

			ctx.fillStyle = '#fec';
			ctx.fillRect(x, y, 100, 100);

		});

		function drawBackground () {

		ctx.fillStyle = '#000';
		ctx.fillRect(0,0, canvas.width, canvas.height);
		}


	function loop () {
		getInputs();

		updateModels();

		render();

		if (looping) {
			setTimeout(loop, 1);
		}
	}

	function isColliding (asteroidOne, asteroidTwo) {
		// create variables to define boundaries of asteroids
		var oneLeft = asteroidOne.x,
		oneRight = oneLeft + asteroidOne.size,
		oneTop = asteroidOne.y,
		oneBottom = oneTop + asteroidOne.size,
		twoLeft = asteroidTwo.x,
		twoRight = twoLeft + asteroidTwo.size,
		twoTop = asteroidTwo.y,
		twoBottom = twoTop + asteroidTwo.size;
		// detect if any boundary from both asteroids overlap/intersect
		if (((oneLeft >= twoLeft &&
			oneLeft <= twoRight) ||
			(oneRight >= twoLeft &&
			oneRight <= twoRight)) &&
			((oneTop >= twoTop &&
			oneTop <= twoBottom) ||
			(oneBottom >= twoTop &&
			oneBottom <= twoBottom))
			) {
			return true;
		};
	}

	function start () {

		if (!looping) {
			looping = true;
			loop();
		}
	}

	function stop () {

		looping = false;
	}

	function getInputs () {


	}

	function updateModels () {
		var currentAsteroid;
		if(isColliding(models.asteroidOne, models.asteroidTwo)) {
			models.asteroidOne.angle.mult(-1);
			models.asteroidTwo.angle.mult(-1);
			console.log('collision detected!!')
		}

		for (var model in models) {

			if (models.hasOwnProperty(model)) {

				currentAsteroid = models[model];

				currentAsteroid.add(currentAsteroid.angle.normalize().mult(currentAsteroid.velocity/ 1000));
			}
		}


	}

	function render () {

		var currentAsteroid;

		drawBackground();

		for (var model in models) {
			if (models.hasOwnProperty(model)) {
				currentAsteroid = models[model];

				ctx.fillStyle = currentAsteroid.color;

				ctx.fillRect(currentAsteroid.x,
							 currentAsteroid.y,
							 currentAsteroid.size,
							 currentAsteroid.size)
			}
		}
	}



	// start();

	});

},{"./vector":2}],2:[function(require,module,exports){
var Vector = (function () { // Start create function and call it all at once
	var vectorProto = {

    'add' : function (v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },

    'sub' : function (v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },

    'mult' : function (m) {
      this.x *= m;
      this.y *= m;
      return this;
    },

    'div' : function (m) {
      this.x /= m;
      this.y /= m;
      return this;
    },

    'dot' : function (v) {
      return v.x * this.x + v.y * this.y;
    },

    'lengthSquared' : function () {
      return this.dot(this);
    },

    'length' : (function () {
      var sqrt = Math.sqrt;
      return function () {
        return sqrt(this.lengthSquared());
      };
    }()),

    'normalize' : function () {
      var len = this.length();
      if (len) {
        return this.div(len);
      }
      return this;
    },

    'rotate' : function (angle) {

      var x      = this.x,
          y      = this.y,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);

      this.x = x * cosVal - y * sinVal;
      this.y = x * sinVal + y * cosVal;

      return this;

    },

    'toRadians': function () {
      return Math.atan2(this.y, this.x);
    }

  };

  return function (x, y) {
    return Object.create(vectorProto).extend({
      'x' : x || 0,
      'y' : y || 0
    });
  };
}()); // End create function and call all at once
  // End Vector Library

window.Vector = Vector;

module.exports = Vector;
},{}]},{},[1]);

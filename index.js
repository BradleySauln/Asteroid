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

	var Vector            = require('./vector'),
		  AsteroidFactory   = require('./asteroid');

window.addEventListener('DOMContentLoaded', function () {

	var canvas  = document.getElementById('canvas'),
		  ctx     = canvas.getContext('2d'),
		  looping = false,
      inputs  = [],
		  models  = [];

  window.models = models;

  function generateAsteroid (config) {

    models.push(AsteroidFactory(config));

    return models[models.length - 1];

  }

  generateAsteroid({
    'x': 400,
    'y': 400,
    'mass': 10,
    'width':50,
    'height':50,
    'angle': {
      'x': -90,
      'y': -90
    },
    'velocity': 100,
    'color': '#33b'
  });

  generateAsteroid({
    'x': 100,
    'y': 100,
    'mass': 10,
    'width':50,
    'height':50,
    'angle': {
      'x': 90,
      'y': 90
    },

    'velocity': 100,
    'color': '#fff'
  });


  // Set up our canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.addEventListener('click', function (event) {

    inputs.push(function () {

      var x = event.clientX,
  			  y = event.clientY;

      console.log('Generating by clicking');

  		generateAsteroid({
        'x': x,
        'y': y,
        'angle': {
          'x': 10,
          'y': -10
        },
        'mass': 10,
        'width':50,
        'height':50
      });

    });

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
      console.log('Starting simulation');
			looping = true;
			loop();
		}

	}

	function stop () {
    console.log('Stopping simulation');
		looping = false;
	}

	function getInputs () {

    for (var i = 0; i < inputs.length; i++) {
      inputs[i]();
    }

    inputs = [];

	}

  function updateModels () {

    var currentAsteroid;

    for(var i=0; i<models.length; i++){

      for(var j=i+1;j<models.length;j++){

        if(isColliding(models[i], models[j]) && models[i].isAsteroid && models[j].isAsteroid) {

          models[i].angle.mult(-1);
          models[j].angle.mult(-1);

          console.log('collision detected!!')

        }

      }

    }

    for (var model in models) {

      if (models.hasOwnProperty(model)) {

        currentAsteroid = models[model];

        currentAsteroid.add(currentAsteroid.angle.normalize().mult(currentAsteroid.velocity/ 1000));
      }
    }

  }

	function render () {

		var currentModel;

		drawBackground();

		for (var model in models) {

			if (models.hasOwnProperty(model)) {

				currentModel = models[model];

				ctx.save();

        ctx.translate(currentModel.x, currentModel.y);

        currentModel.render(ctx);

				ctx.restore();

			}
		}
	}



start();

});

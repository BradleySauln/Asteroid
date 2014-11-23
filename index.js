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

// Get a random integer between some range.
if (!Math.getRandomInt) {
  Math.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    'size': 50,
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
    'size': 50,
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

    var clickedAsteroid = getAsteroidFromClick(event);

    if (clickedAsteroid) {
      console.log('Edit asteroid');
      updateControlUI(clickedAsteroid);

      return;
    }

    inputs.push(function () {

      var x      = event.clientX,
          y      = event.clientY,
          size   = Math.getRandomInt(10, 75),
          angleX = Math.getRandomInt(-90, 90),
          angleY = Math.getRandomInt(-90, 90),

          newAsteroid = {
            'x': x,
            'y': y,
            'angle': {
              'x': angleX,
              'y': angleY
            },
            'mass': 10,
            'size': size,
            'velocity': Math.getRandomInt(10, 500),
            'color': '#'+Math.floor(Math.random()*16777215).toString(16)
          };

      console.log('Creating asteroid...');

      newAsteroid = generateAsteroid(newAsteroid);

      updateControlUI(newAsteroid);

    });

  });

  function getById (id) {
    return document.getElementById(id);
  }

  function updateControlUI (asteroid) {

    getById('control').asteroid = asteroid;

    var x        = getById('x'),
        y        = getById('y'),
        angle    = getById('angle'),
        size     = getById('size'),
        velocity = getById('velocity'),
        mass     = getById('mass');

    x.value        = asteroid.x;
    y.value        = asteroid.y;
    angle.value    = asteroid.angle.x + ', ' + asteroid.angle.y;
    size.value     = asteroid.size;
    velocity.value = asteroid.velocity;
    mass.value     = asteroid.mass;

  }

  function updateAsteroidFromControlUI (asteroid) {
     var x        = getById('x'),
        y        = getById('y'),
        angleX    = parseFloat(getById('angle').value.split(',')[0]),
        angleY   = parseFloat(getById('angle').value.split(',')[1]),
        size     = getById('size'),
        velocity = getById('velocity'),
        mass     = getById('mass');

        asteroid.x        = parseFloat(x.value)
        asteroid.y        = parseFloat(y.value)
        asteroid.angle.x  = angleX
        asteroid.angle.y  = angleY
        asteroid.size     = parseFloat(size.value)
        asteroid.velocity = parseFloat(velocity.value)
        asteroid.mass     = parseFloat(mass.value)

  }

  function shouldGenerateAsteroidFromClick (potentialAsteroid) {

  }

  function getAsteroidFromClick (e) {

    var clickObj = {
          'x': e.clientX,
          'y': e.clientY,
          'size': 1
        };

    for (var i = 0; i < models.length; i++) {

      if (isColliding(models[i], clickObj)) {
        return models[i];
      }

    }

  }

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
    var oneLeft   = asteroidOne.x - asteroidOne.size / 2,
        oneRight  = oneLeft + asteroidOne.size,
        oneTop    = asteroidOne.y - asteroidOne.size / 2,
        oneBottom = oneTop + asteroidOne.size,
        twoLeft   = asteroidTwo.x - asteroidTwo.size / 2,
        twoRight  = twoLeft + asteroidTwo.size,
        twoTop    = asteroidTwo.y - asteroidTwo.size / 2,
        twoBottom = twoTop + asteroidTwo.size;
    // detect if any boundary from both asteroids overlap/intersect

    if (
        (
          (oneLeft >= twoLeft && oneLeft <= twoRight)   ||
          (oneRight >= twoLeft && oneRight <= twoRight) ||
          (twoLeft >= oneLeft && twoLeft <= oneRight)
        )

        &&

        (
          (oneTop >= twoTop && oneTop <= twoBottom)       ||
          (oneBottom >= twoTop && oneBottom <= twoBottom) ||
          (twoTop >= oneTop && twoTop <= oneBottom)
        )
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

  var updateAsteroidButton = getById('apply-change');

  updateAsteroidButton.addEventListener('click', function () {
    updateAsteroidFromControlUI(getById('control').asteroid)
  });

  var startStopButton = getById('simulation-control');

  startStopButton.addEventListener('click', function () {
    if (looping) {
      stop();
    } else {
      start();
    }
  });

});

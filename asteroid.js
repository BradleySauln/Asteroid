'use strict';

var Vector = require('./vector.js');

module.exports = (function () {

  var asteroidPrototype = {

    'isAsteroid': true,

    'x': 0,
    'y': 0,

    'width': 10,
    'height': 10,

    'mass': 10,

    'size': 50,

    'angle': {
      'x': 90,
      'y': 90
    },

    'velocity': 100,

    'color': 'yellow',

    'border': 'blue',

    'render': function (ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

  };

  function init(newAsteroid) {

    // Position with Vector
    newAsteroid.extend(Vector(newAsteroid.x, newAsteroid.y));

    // Rotation with Vector
    newAsteroid.angle.extend(Vector(newAsteroid.angle.x, newAsteroid.angle.y));

    return newAsteroid;

  }

  return function (config) {

    config = config || {};

    return init(Object.create(asteroidPrototype).extend(config));

  };

}());
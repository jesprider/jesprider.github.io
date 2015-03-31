var Draw = require('./draw');

module.exports = function(game, x, y, r, col, strength) {
    var particle = this;
    
    particle.x = x;
    particle.y = y;
    particle.r = r;
    particle.col = col;

    // determines whether particle will
    // travel to the right of left
    // 50% chance of either happening
    particle.dir = (Math.random() * 2 > 1) ? 1 : -1;

    // random values so particles do no
    // travel at the same speeds
    particle.vx = ~~(Math.random() * 4) * particle.dir;
    particle.vy = ~~(Math.random() * strength);

    particle.remove = false;

    particle.update = function() {

        // update coordinates
        particle.x += particle.vx;
        particle.y -= particle.vy;

        // increase velocity so particle
        // accelerates off screen
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // adding particle negative amount to the
        // y velocity exerts an upward pull on
        // the particle, as if drawn to the
        // surface
        particle.vy -= 0.25;

        // offscreen
        if (particle.y > game.HEIGHT) {
            particle.remove = true;
        }

    };

    particle.render = function() {
        Draw.circle(game, particle.x, particle.y, particle.r, particle.col);
    };

};
var Draw = require('./draw');

module.exports = function (game) {
    var balloon = this;

    balloon.type = 'balloon';

    // speed of blowing
    var delta = 0.2;
    var minIndex = 0.2;

    balloon.pic = new Image();
    balloon.pic.src = './i/shar-size-1.png';

    balloon.pic.onload = function () {
        balloon.w = balloon.pic.naturalWidth * minIndex;
        balloon.h = balloon.pic.naturalHeight * minIndex;

        // center the balloon
        balloon.x = game.WIDTH / 2 - balloon.w / 2;
        balloon.y = game.HEIGHT - balloon.h;

        balloon.ratio = balloon.h / balloon.w;
        balloon.r = balloon.w / 2; // we know that width < height
        balloon.initX = balloon.x;
    };

    balloon.update = function() {
        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;

        if (game.blowing) {
            balloon.w += delta;
            balloon.h += (balloon.ratio * delta);
            balloon.r = balloon.w / 2;
        } else {
            balloon.w -= delta / 3;
            balloon.h -= (balloon.ratio * delta / 3);
            balloon.r = balloon.w / 2;
        }

        balloon.x = 20 * Math.sin(time) + (game.WIDTH / 2 - balloon.w / 2);
        balloon.y = game.HEIGHT - balloon.h;
    };

    balloon.render = function() {
        Draw.pic(game, balloon.pic, balloon.x, balloon.y, balloon.w, balloon.h);
    };
};
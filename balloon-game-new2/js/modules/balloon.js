var Draw = require('./draw');
var config = require('./config');

module.exports = function (game) {
    var balloon = this;

    balloon.type = 'balloon';

    balloon.pic = new Image();
    balloon.pic.src = './i/shar-size-1.png';

     var groundWidth = config.groundUpWidth + config.groundDownWidth;

    balloon.pic.onload = function () {
        balloon.w = balloon.pic.naturalWidth * config.balloon.minIndex;
        balloon.h = balloon.pic.naturalHeight * config.balloon.minIndex;

        // center the balloon
        balloon.x = game.WIDTH / 2 - balloon.w / 2;
        balloon.y = game.HEIGHT - balloon.h - groundWidth - 10;

        balloon.ratio = balloon.h / balloon.w;
        balloon.r = balloon.w / 2; // we know that width < height
        balloon.initX = balloon.x;
    };

    balloon.update = function() {
        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;

        if (game.blowing) {
            balloon.w += config.balloon.blowingSpeed;
            balloon.h += (balloon.ratio * config.balloon.blowingSpeed);
            balloon.r = balloon.w / 2;
        } else {
            balloon.w -= config.balloon.blowingSpeed * config.balloon.unblowingIndex;
            balloon.h -= (balloon.ratio * config.balloon.blowingSpeed * config.balloon.unblowingIndex);
            balloon.r = balloon.w / 2;
        }

        balloon.x = config.balloon.rangeIndex * Math.sin(time) + (game.WIDTH / 2 - balloon.w / 2);
        balloon.y = game.HEIGHT - balloon.h - groundWidth - 10;
    };

    balloon.render = function() {
        Draw.pic(game, balloon.pic, balloon.x, balloon.y, balloon.w, balloon.h);
    };
};
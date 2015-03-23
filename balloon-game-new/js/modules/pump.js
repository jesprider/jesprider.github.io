var Draw = require('./draw');
var config = require('./config');

module.exports = function (game) {
    var pump = this;

    pump.type = 'pump';

    pump.pump1 = new Image();
    pump.pump1.src = './i/pump1.png';

    pump.pump2 = new Image();
    pump.pump2.src = './i/pump2.png';

    var groundWidth = config.groundUpWidth + config.groundDownWidth;

    pump.pump1.onload = function () {
        pump.pump1.w = pump.pump1.naturalWidth;
        pump.pump1.h = pump.pump1.naturalHeight;

        // use 'dx' instead of 'x' because pump.pump1 is picture object
        // and already has property 'x'
        pump.pump1.dx = game.WIDTH / 5 - pump.pump1.w / 2;
        pump.pump1.dy = game.HEIGHT - pump.pump1.h - groundWidth;
    };

    pump.pump2.onload = function () {
        pump.pump2.w = pump.pump2.naturalWidth;
        pump.pump2.h = pump.pump2.naturalHeight;

        pump.pump2.dx = game.WIDTH / 5 - pump.pump2.w / 2;
        pump.pump2.dy = game.HEIGHT - pump.pump2.h - groundWidth;
    };

    pump.update = function() {
        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;

        if (game.blowing) {
            pump.pump1.dy = 30 * Math.sin(time * 5) + game.HEIGHT - pump.pump1.h - groundWidth - 40;
        }
    };

    pump.render = function() {
        Draw.pic(game, pump.pump1, pump.pump1.dx, pump.pump1.dy, pump.pump1.w, pump.pump1.h);
        Draw.pic(game, pump.pump2, pump.pump2.dx, pump.pump2.dy, pump.pump2.w, pump.pump2.h);
    };
};
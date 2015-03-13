var Draw = require('./draw');

module.exports = function (game) {
    this.type = 'balloon';

    var d = 0.05;
    var w = 212;
    var h = 335;
    var ratio = h / w;

    this.w = w / 5;
    this.h = h / 5;

    this.r = this.w / 2;

    this.x = game.WIDTH / 2 - this.w / 2;
    this.y = game.HEIGHT - this.h;

    this.initX = this.x;

    this.remove = false;

    this.pic = new Image();
    this.pic.src = './i/shar-size-1.png';

    this.update = function() {
        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;
        this.x = 30 * Math.sin(time) + (game.WIDTH / 2 - this.w / 2);
        this.w += d;
        this.h += (ratio * d);
        this.y = game.HEIGHT - this.h;
        this.r = this.w / 2;
    };

    this.render = function() {
        Draw.pic(game, this.pic, this.x, this.y, this.w, this.h);
    };
};
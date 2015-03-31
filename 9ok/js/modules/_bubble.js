var Draw = require('./draw');

module.exports = function(game) {
    this.type = 'bubble';
    this.r = (Math.random() * 20) + 10;
    this.speed = (Math.random() * 3) + 1;

    this.x = (Math.random() * (game.WIDTH) - this.r);
    this.y = -(Math.random() * 100) - 100;

    // the amount by which the bubble
    // will move from side to side
    this.waveSize = 5 + this.r;
    // we need to remember the original
    // x position for our sine wave calculation
    this.xConstant = this.x;

    this.remove = false;


    this.update = function() {

        // a sine wave is commonly a function of time
        var time = new Date().getTime() * 0.002;

        this.y += this.speed;
        // the x coord to follow a sine wave
        this.x = this.waveSize * Math.sin(time) + this.xConstant;

        // if offscreen flag for removal
        if (this.y > game.HEIGHT + 10) {
            game.score.escaped += 1; // update score
            this.remove = true;
        }

    };

    this.render = function() {
        Draw.circle(game, this.x, this.y, this.r, 'rgba(255,255,255,1)');
    };

};
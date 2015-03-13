var Draw = require('./draw');

module.exports = function(game) {
    var artifact = this;
    
    artifact.type = 'artifact';
    artifact.speed = (Math.random() * 3) + 1;

    artifact.w = 100;
    artifact.h = 100;
    artifact.r = artifact.w / 2;

    artifact.x = (Math.random() * (game.WIDTH) - artifact.w / 2);
    artifact.y = -(Math.random() * 100) - 100;

    // the amount by which the bubble
    // will move from side to side
    artifact.waveSize = 5 + artifact.w / 2;
    // we need to remember the original
    // x position for our sine wave calculation
    artifact.initX = artifact.x;

    artifact.remove = false;

    artifact.pic = new Image();
    // we have for types of pictures, named from 1 to 4.
    artifact.pic.src = './i/item-' + (Math.floor(Math.random() * 4) + 1) + '.png';

    artifact.pic.onload = function() {
        artifact.w = artifact.pic.naturalWidth / 1.5;
        artifact.h = artifact.pic.naturalHeight / 1.5;
        artifact.r = Math.min(artifact.w, artifact.h) / 2;
    };

    artifact.update = function() {

        // a sine wave is commonly a function of time
        var time = new Date().getTime() * 0.002;

        artifact.y += artifact.speed;
        // the x coord to follow a sine wave
        artifact.x = artifact.waveSize * Math.sin(time) + artifact.initX;

        // if offscreen flag for removal
        if (artifact.y > game.HEIGHT + 10) {
            game.score.escaped += 1; // update score
            artifact.remove = true;
        }

    };

    artifact.render = function() {
        Draw.pic(game, artifact.pic, artifact.x, artifact.y, artifact.w, artifact.h);
    };

};
var Draw = require('./draw');
var config = require('./config');

module.exports = function(game) {
    var artifact = this;
    
    artifact.type = 'artifact';
    artifact.speed = (Math.random() * config.artifact.speedRange) + 1;
    artifact.remove = false;

    // we have four types of pictures, named from 1 to 4.
    var picNum = (Math.floor(Math.random() * config.artifact.quantity) + 1);

    artifact.pic = new Image();
    artifact.pic.src = './i/item-' + picNum + '.png';

    artifact.pic.onload = function() {
        // todo: clear the division
        artifact.w = artifact.pic.naturalWidth / 1.5;
        artifact.h = artifact.pic.naturalHeight / 1.5;

        artifact.r = Math.min(artifact.w, artifact.h) / 2;

        artifact.x = Math.random() * game.WIDTH - artifact.w / 2;
        artifact.y = Math.random() * config.artifact.heightRange + config.artifact.heightOfAppearing;

        // the amount by which the bubble
        // will move from side to side
        artifact.waveSize = config.artifact.waveRange + artifact.w / 2;
        // we need to remember the original
        // x position for our sine wave calculation
        artifact.initX = artifact.x;
    };

    artifact.update = function() {

        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;

        artifact.y += artifact.speed;
        // the x coord to follow a sine wave
        artifact.x = artifact.waveSize * Math.sin(time) + artifact.initX;

        // if offscreen flag for removal
        if (artifact.y > (game.HEIGHT - artifact.h + 10)) {
            game.artifactCrashed = true;
            game.score.escaped += 1; // update score
            artifact.remove = true;
        }

    };

    artifact.render = function() {
        Draw.pic(game, artifact.pic, artifact.x, artifact.y, artifact.w, artifact.h);
    };

};
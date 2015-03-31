var Draw = require('./draw');
var config = require('./config');

module.exports = function(game) {
    var artifact = this;
    
    artifact.type = 'artifact';

    artifact.speed = (Math.random() * config.artifact.speedRange) + 1;

    if (game.score.total < config.tutorialQuantity && game.needTutorial) {
        artifact.speed = 1;
    }

    artifact.remove = false;

    // we have four types of pictures, named from 1 to 4.
    var picNum = (Math.floor(Math.random() * config.artifact.quantity) + 1);

    artifact.pic = new Image();
    artifact.pic.src = './i/a' + picNum + '.png';

    artifact.pic.onload = function() {
        artifact.w = artifact.pic.naturalWidth;
        artifact.h = artifact.pic.naturalHeight;

        artifact.r = Math.min(artifact.w, artifact.h) / 2;

        artifact.x = Math.random() * game.WIDTH - artifact.w / 2;
        artifact.y = Math.random() * config.artifact.heightRange + config.artifact.heightOfAppearing;

        // the amount by which the bubble
        // will move from side to side
        artifact.waveRange = config.artifact.waveRange + artifact.w / 2;
        // we need to remember the original
        // x position for our sine wave calculation
        artifact.initX = artifact.x;
    };

    artifact.update = function() {

        // a sine wave is commonly a function of time
        var time = Date.now() * 0.002;

        artifact.y += artifact.speed;
        // the x coord to follow a sine wave
        artifact.x = artifact.waveRange * Math.sin(time) + artifact.initX;

        // if offscreen flag for removal
        if (artifact.y > (game.HEIGHT - config.groundWidth - artifact.h + 10)) {
            game.artifactCrashed = true;
            game.score.escaped += 1; // update score
            artifact.remove = true;
        }

    };

    artifact.render = function() {
        Draw.pic(game, artifact.pic, artifact.x, artifact.y, artifact.w, artifact.h);
    };

};
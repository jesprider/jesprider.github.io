var Draw = require('./draw');
var config = require('./config');

module.exports = function(game) {
    var cloud = this;
    
    cloud.type = 'cloud';

    cloud.speed = (Math.random() * config.cloud.speedRange) + 1;

    if (game.score.total < config.tutorialQuantity && game.needTutorial) {
        cloud.speed = 1;
    }

    cloud.remove = false;

    // we have four types of pictures, named from 1 to 4.
    var picNum = (Math.floor(Math.random() * config.cloud.quantity) + 1);

    cloud.pic = new Image();
    cloud.pic.src = './i/cloud' + picNum + '.png';

    cloud.pic.onload = function() {
        cloud.w = cloud.pic.naturalWidth;
        cloud.h = cloud.pic.naturalHeight;

        cloud.x = Math.random() * config.cloud.leftRange + config.cloud.leftOfAppearing;
        cloud.y = Math.random() * (game.HEIGHT - 400);
    };

    cloud.update = function() {
        cloud.x += cloud.speed;

        // if offscreen flag for removal
        if (cloud.x > game.WIDTH) {
            cloud.remove = true;
        }

    };

    cloud.render = function() {
        Draw.pic(game, cloud.pic, cloud.x, cloud.y, cloud.w, cloud.h);
    };

};
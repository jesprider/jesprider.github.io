var Draw = require('./draw');

module.exports = function(game, x, y) {
    var touch = this;

    touch.type = 'touch';    // we'll need touch later
    touch.x = x;             // the x coordinate
    touch.y = y;             // the y coordinate
    touch.r = 5;             // the radius
    touch.opacity = 1;       // inital opacity. the dot will fade out
    touch.fade = 0.1;       // amount by which to fade on each game tick
    // touch.remove = false;    // flag for removing touch entity. balloon.update
                            // will take care of touch

    touch.update = function() {
        // reduct the opacity accordingly
        touch.opacity -= touch.fade;
        // if opacity if 0 or less, flag for removal
        touch.remove = (touch.opacity < 0) ? true : false;
    };

    touch.render = function() {
        Draw.circle(game, touch.x, touch.y, touch.r, 'rgba(0,0,255,'+touch.opacity+')');
    };

};
var draw = require('./draw');

module.exports = function(a, b, game) {
    var dx = a.x + a.w / 2;
    var dy = a.y + a.h / 2;

    // balloon center for circle
    var bx = b.x + b.r;
    var by = b.y + b.r;

    var distance_squared = ( ((dx - bx) * (dx - bx)) +
                            ((dy - by) * (dy - by)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

//    draw.circle(game, dx, dy, a.r, 'red');
//    draw.circle(game, bx, by, b.r, 'blue');

    return distance_squared - radii_squared < 10;
};
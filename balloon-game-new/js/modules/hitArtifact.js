module.exports = function(a, b) {
//    var x = {
//        min: a.x,
//        max: a.x + a.w
//    };
//
//    var y = {
//        min: a.y,
//        max: a.y + a.h
//    };

    var dx = a.x + a.w / 2;
    var dy = a.y + a.h / 2;

    var distance_squared = ( ((dx - b.x) * (dx - b.x)) +
                            ((dy - b.y) * (dy - b.y)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

    return distance_squared < radii_squared;
};
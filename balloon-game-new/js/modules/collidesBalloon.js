module.exports = function(a, b) {
    var dx = a.x + a.w / 2;
    var dy = a.y + a.h / 2;

    // balloon center for circle
    var bx = b.x + b.w / 2;
    var by = b.y + b.r;

    var distance_squared = ( ((dx - b.x) * (dx - b.x)) +
                            ((dy - b.y) * (dy - b.y)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

    return distance_squared < radii_squared;
};
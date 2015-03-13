module.exports = function(a, b) {
    var distance_squared = ( ((a.x - b.x) * (a.x - b.x)) +
                            ((a.y - b.y) * (a.y - b.y)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

    return distance_squared < radii_squared;
};
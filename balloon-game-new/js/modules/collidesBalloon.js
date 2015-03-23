var Draw = require('./draw');

// a - artifact
// b - balloon
module.exports = function(a, b, game) {
    var centerArtifactX = a.x + a.w / 2;
    var centerArtifactY = a.y + a.h - a.r;

    // balloon center for circle
    var centerBalloonX = b.x + b.r;
    var centerBalloonY = b.y + b.r;

    var distance_squared = ( ((centerArtifactX - centerBalloonX) * (centerArtifactX - centerBalloonX)) +
                            ((centerArtifactY - centerBalloonY) * (centerArtifactY - centerBalloonY)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

//    Draw.circle(game, centerArtifactX, centerArtifactY, a.r, 'red');
//    Draw.circle(game, centerBalloonX, centerBalloonY, b.r, 'blue');

    return distance_squared - radii_squared < 20;
};
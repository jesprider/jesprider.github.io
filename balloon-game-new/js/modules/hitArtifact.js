module.exports = function(a, b) {
    var centerArtifactX = a.x + a.w / 2;
    var centerArtifactY = a.y + a.h / 2;

    var distance_squared = ( ((centerArtifactX - b.x) * (centerArtifactX - b.x)) +
                            ((centerArtifactY - b.y) * (centerArtifactY - b.y)));

    var radii_squared = (a.r + b.r) * (a.r + b.r);

    return distance_squared < radii_squared;
};
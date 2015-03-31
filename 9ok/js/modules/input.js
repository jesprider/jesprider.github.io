module.exports = {
    x: 0,
    y: 0,
    tapped :false,

    set: function(game, data) {
        var input = this;
        input.x = (data.pageX - game.offset.left) / game.scale;
        input.y = (data.pageY - game.offset.top) / game.scale;
        input.tapped = true;
    }
};
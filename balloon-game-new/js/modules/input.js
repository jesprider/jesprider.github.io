module.exports = {
    x: 0,
    y: 0,
    tapped :false,

    set: function(game, data) {
        this.x = (data.pageX - game.offset.left) / game.scale;
        this.y = (data.pageY - game.offset.top) / game.scale;
        this.tapped = true;
    }
};
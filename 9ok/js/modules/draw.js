module.exports = {
    clear: function() {
        game.ctx.clearRect(0, 0, game.WIDTH, game.HEIGHT);
    },

    rect: function(game, x, y, w, h, col) {
        game.ctx.fillStyle = col;
        game.ctx.fillRect(x, y, w, h);
    },

    circle: function(game, x, y, r, col) {
        game.ctx.fillStyle = col;
        game.ctx.beginPath();
        game.ctx.arc(x, y, r, 0,  Math.PI * 2, true);
        game.ctx.closePath();
        game.ctx.fill();
    },


    text: function(game, string, x, y, size, col) {
        game.ctx.font = 'normal '+size+'px Helvetica';
        game.ctx.fillStyle = col;
        game.ctx.fillText(string, x, y);
    },

    pic: function (game, pic, x, y, w, h) {
        game.ctx.drawImage(pic, x, y, w, h);
    }
};
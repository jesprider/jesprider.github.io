var canvas = document.getElementById('canvas'),
    mc = new cMove.MyCanvas(canvas);

var r = new cMove.Rectangle(mc, {
    x: mc.width/2 - 35,
    y: mc.height - 100,
    w: 70,
    h: 50,
    fill: 'rgba(1,118,200,.7)'});

var r1 = new cMove.Rectangle(mc, {x: 0, y: 200, w: mc.width/3, h: 20, fill: 'rgba(230,160, 223,.7)'});
var r2 = new cMove.Rectangle(mc, {x: mc.width - 200, y: 0, w: mc.width/4, h: 20, fill: 'rgba(230,160, 223,.7)'});

r.update = function (){
    var time = Date.now() * 0.002;
    this.x = 30 * Math.sin(time) + this.initX;
};

r1.update = function(){
    var time = Date.now() * 0.000000000002;
    this.y += time;
};

r2.update = function () {
    var time = Date.now() * 0.000000000001;
    this.y += time;
};

mc.addShape(r);
mc.addShape(r1);
mc.addShape(r2);

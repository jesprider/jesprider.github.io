var canvas = document.getElementById('canvas'),
    mc = new cMove.MyCanvas(canvas);

console.log(mc.height)

var r = new cMove.Rectangle(mc, {
    x: (mc.width / 2 - 50) / mc.scale,
    y: (mc.height - 50) / mc.scale,
    w: 100,
    h: 50,
    fill: 'rgba(1,118,200,.7)'});

r.update = function (time) {
    r.h += 0.1;
    r.y -= 0.1;
};

mc.addShape(r);

window.addEventListener('resize', mc.resize.bind(mc), false);
mc.start();

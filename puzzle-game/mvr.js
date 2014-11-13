var mvr = (function() {

    function Shape(x, y, w, h, fill) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
        this.fill = fill || '#AAAAAA';
    }

    Shape.prototype.draw = function(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };

    Shape.prototype.contains = function(mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my);
    };


    function Picture(src, x, y, w, h) {
        this.src = src || '';
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    }

    Picture.prototype.draw = function(ctx) {
        var pic = new Image();
        pic.src = this.src;

        var picture = this;
        pic.onload = function() {
            if (picture.w === 0) { picture.w = pic.naturalWidth; }
            if (picture.h === 0) { picture.h = pic.naturalHeight; }

            ctx.drawImage(pic, picture.x, picture.y, picture.w, picture.h);
        }
    };

    Picture.prototype.contains = function(mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my);
    };


    function CanvasState(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');


        if (document.defaultView && document.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
            this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
            this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
            this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
        }

        // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
        // They will mess up mouse coordinates and this fixes that
        var html = document.body.parentNode;
        this.htmlTop = html.offsetTop;
        this.htmlLeft = html.offsetLeft;


        this.valid = false; // when set to false, the canvas will redraw everything
        this.shapes = [];  // the collection of things to be drawn
        this.dragging = false; // Keep track of when we are dragging
        this.selection = null;
        this.dragoffx = 0;
        this.dragoffy = 0;

        var myState = this;

        //fixes a problem where double clicking causes text to get selected on the canvas
        canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

        // Up, down, and move are for dragging
//        canvas.addEventListener('mousedown', function(e) {
//            var mouse = myState.getMouse(e);
//            var mx = mouse.x;
//            var my = mouse.y;
//            var shapes = myState.shapes;
//            var l = shapes.length;
//
//            for (var i = l-1; i >= 0; i--) {
//                if (shapes[i].contains(mx, my)) {
//                    var mySel = shapes[i];
//                    // Keep track of where in the object we clicked
//                    // so we can move it smoothly (see mousemove)
//                    myState.dragoffx = mx - mySel.x;
//                    myState.dragoffy = my - mySel.y;
//                    myState.dragging = true;
//                    myState.selection = mySel;
//                    myState.valid = false;
//                    return;
//                }
//            }
//            // havent returned means we have failed to select anything.
//            // If there was an object selected, we deselect it
//            if (myState.selection) {
//                myState.selection = null;
//                myState.valid = false; // Need to clear the old selection border
//            }
//        }, true);

        canvas.addEventListener('touchstart', function(e) {
            var mouse = myState.getTouch(e);
            var mx = mouse.x;
            var my = mouse.y;
            var shapes = myState.shapes;
            var l = shapes.length;

            for (var i = l-1; i >= 0; i--) {
                if (shapes[i].contains(mx, my)) {
                    var mySel = shapes[i];

                    // Keep track of where in the object we clicked
                    // so we can move it smoothly (see mousemove)
                    myState.dragoffx = mx - mySel.x;
                    myState.dragoffy = my - mySel.y;
                    myState.dragging = true;
                    myState.selection = mySel;
                    myState.valid = false;
                    return;
                }
            }
            // havent returned means we have failed to select anything.
            // If there was an object selected, we deselect it
            if (myState.selection) {
                myState.selection = null;
                myState.valid = false; // Need to clear the old selection border
            }
        }, true);

//        canvas.addEventListener('mousemove', function(e) {
//            if (myState.dragging){
//                var mouse = myState.getMouse(e);
//                // We don't want to drag the object by its top-left corner, we want to drag it
//                // from where we clicked. Thats why we saved the offset and use it here
//                myState.selection.x = mouse.x - myState.dragoffx;
//                myState.selection.y = mouse.y - myState.dragoffy;
//                myState.valid = false; // Something's dragging so we must redraw
//            }
//        }, true);

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (myState.dragging){
                var mouse = myState.getTouch(e);
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here
                myState.selection.x = mouse.x - myState.dragoffx;
                myState.selection.y = mouse.y - myState.dragoffy;
                myState.valid = false; // Something's dragging so we must redraw
            }
        }, true);

//        canvas.addEventListener('mouseup', function(e) {
//            myState.dragging = false;
//        }, true);

        canvas.addEventListener('touchend', function(e) {
            myState.dragging = false;
        }, true);


        this.selectionColor = '#CC0000';
        this.selectionWidth = 2;  
        this.interval = 15;
        setInterval(function() { myState.draw(); }, myState.interval);
    }

    CanvasState.prototype.addShape = function(shape) {
        this.shapes.push(shape);
        this.valid = false;
    };

    CanvasState.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    CanvasState.prototype.draw = function() {
        if (!this.valid) {
            var ctx = this.ctx;
            var shapes = this.shapes;
            this.clear();

            // draw all shapes
            var l = shapes.length;
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                // We can skip the drawing of elements that have moved off the screen:
                if (shape.x > this.width || shape.y > this.height ||
                    shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
                shapes[i].draw(ctx);
            }

            // draw selection
            // right now this is just a stroke along the edge of the selected Shape
            if (this.selection != null) {
                ctx.strokeStyle = this.selectionColor;
                ctx.lineWidth = this.selectionWidth;
                var mySel = this.selection;
                ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
            }

            this.valid = true;
        }
    };


    // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
    // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
//    CanvasState.prototype.getMouse = function(e) {
//        var element = this.canvas,
//            offsetX = 0,
//            offsetY = 0,
//            mx,
//            my;
//
//        // Compute the total offset
//        if (element.offsetParent !== undefined) {
//            do {
//              offsetX += element.offsetLeft;
//              offsetY += element.offsetTop;
//            } while ((element = element.offsetParent));
//        }
//
//        // Add padding and border style widths to offset
//        // Also add the <html> offsets in case there's a position:fixed bar
//        offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
//        offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
//
//        mx = e.pageX - offsetX;
//        my = e.pageY - offsetY;
//
//        // We return a simple javascript object (a hash) with x and y defined
//        return {x: mx, y: my};
//    };


    CanvasState.prototype.getTouch = function(e) {
        var element = this.canvas,
            offsetX = 0,
            offsetY = 0,
            mx,
            my;

        // Compute the total offset
        if (element.offsetParent !== undefined) {
            do {
              offsetX += element.offsetLeft;
              offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        // Add padding and border style widths to offset
        // Also add the <html> offsets in case there's a position:fixed bar
        offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
        offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

        mx = e.touches[0].clientX - offsetX;
        my = e.touches[0].clientY - offsetY;

        return {x: mx, y: my};
    };


    return {
        init: function () {
            var s = new CanvasState(document.getElementById('c'));

            s.addShape(new Shape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
            s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));

            s.addShape(new Picture('i/ing/hexagon.png', 10, 10));
            s.addShape(new Picture('i/ing/square.png', 60, 10));
        }
    };

})();
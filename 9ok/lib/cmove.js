(function(window) {
    /**
     * RequestAnimationFrame polyfill
     */
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}(this));

/**
 * @name cMove.js
 * @version 0.0.1
 * @author Roman Alekseev
 * @license MIT
 */
var cMove = (function() {

    // Config constants and default values
    var config = {
        // Default dimensions of rectangle
        RECTANGLE_WIDTH: 50,
        RECTANGLE_HEIGHT: 50,
        RECTANGLE_STROKE_WIDTH: 1,

        // Frame around the shape when selected.
        SHAPES_SELECTION: true,
        SELECTION_COLOR: '#ffca4b',
        SELECTION_WIDTH: 2,
        SELECTION_ON_TOP: true, // Selected shape is on top others if true.

        STRONG_BORDERS: true, // Set 'false' if shapes can move outside the canvas.

        // You need 'x2' and 'x3' folders for retina displays.
        RETINA_PICTURES: false,
        RETINA_X2_PATH: 'x2',
        RETINA_X3_PATH: 'x3' // Set 'false' or 'null' if you do not have x2 or x3 images.
    };

    /**
     * Rectangle constractor
     * @param {Object} myCanvas - link to myCanvas instance
     * @param {Object} opts
     * @constructor
     */
    function Rectangle(myCanvas, opts) {
        var rectangle = this; // Make reference to 'this' everytime, because 'this' is not minified.

        rectangle.x = opts.x || 0;
        rectangle.y = opts.y || 0;
        rectangle.initX = opts.x || 0; // Always keep initial position - very useful.
        rectangle.initY = opts.y || 0;
        rectangle.w = opts.w || config.RECTANGLE_WIDTH;
        rectangle.h = opts.h || config.RECTANGLE_HEIGHT;

        rectangle.fill = opts.fill || null;
        rectangle.stroke = opts.stroke || null;
        rectangle.strokeWidth = opts.strokeWidth || config.RECTANGLE_STROKE_WIDTH;

        rectangle.selectable = (opts.selectable !== false); // If selectable is false - current shape won't have selection frame.
        rectangle.draggable = (opts.draggable !== false); // If false - current shape is not draggable.
        rectangle.type = opts.type || 'rectangle'; // Basic type is 'rectangle'. Sometimes it is useful to set logical type, e.g. 'slot'.
        rectangle.myCanvas = myCanvas; // Keep myCanvas that current shape belongs to.
    }

    Rectangle.prototype.draw = function() {
        var rectangle = this,
            ctx = rectangle.myCanvas.ctx;

        if (rectangle.fill) {
            ctx.fillStyle = rectangle.fill;
            ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        }

        if (config.SHAPES_SELECTION && rectangle.selectable && rectangle.myCanvas.selection === rectangle) {
            ctx.strokeStyle = config.SELECTION_COLOR;
            ctx.lineWidth = config.SELECTION_WIDTH;
            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        } else if (rectangle.stroke) {
            ctx.strokeStyle = rectangle.stroke;
            ctx.lineWidth = rectangle.strokeWidth;
            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        }
    };

    Rectangle.prototype.contains = function(mx, my) {
        var rectangle = this;
        return  (rectangle.x <= mx) && (rectangle.x + rectangle.w >= mx) &&
                (rectangle.y <= my) && (rectangle.y + rectangle.h >= my);
    };

    /**
     * Picture constuctor
     * @param {Object} myCanvas - link to myCanvas instance
     * @param {Object} opts
     * @constructor
     */
    function Picture(myCanvas, opts) {
        if (!opts.src) throw new TypeError('Src of picture is required.');

        var pic = new Image(),
            picture = this,
            ratio = myCanvas.ratio;

        if (config.RETINA_PICTURES && config.RETINA_X2_PATH && ratio > 1 && ratio <=2) {
            opts.src = getRetinaPath(opts.src, config.RETINA_X2_PATH);
        }

        if (config.RETINA_PICTURES && config.RETINA_X3_PATH && ratio > 2) {
            opts.src = getRetinaPath(opts.src, config.RETINA_X3_PATH);
        }

        pic.src = opts.src;

        picture.pic = pic;
        picture.src = opts.src || '';

        picture.x = opts.x || 0;
        picture.y = opts.y || 0;
        picture.initX = opts.x || 0;
        picture.initY = opts.y || 0;
        picture.w = opts.w || 0;
        picture.h = opts.h || 0;

        picture.selectable = (opts.selectable !== false);
        picture.draggable = (opts.draggable !== false);
        picture.type = opts.type || 'picture';
        picture.myCanvas = myCanvas;

        pic.onload = function () {
            // If we don't set dimensions for images - natural dimensions will be set.
            if (picture.w === 0 || picture.h === 0) {
                if (config.RETINA_PICTURES && config.RETINA_X2_PATH && ratio > 1 && ratio <= 2) {
                    picture.w = picture.pic.naturalWidth / 2;
                    picture.h = picture.pic.naturalHeight / 2;
                } else if (config.RETINA_PICTURES && config.RETINA_X3_PATH && ratio > 2) {
                    picture.w = picture.pic.naturalWidth / 3;
                    picture.h = picture.pic.naturalHeight / 3;
                } else {
                    picture.w = picture.pic.naturalWidth;
                    picture.h = picture.pic.naturalHeight;
                }
            }
            myCanvas.valid = false;
        };
    }

    Picture.prototype.draw = function() {
        var picture = this,
            ctx = picture.myCanvas.ctx;

        if (config.SHAPES_SELECTION && picture.selectable && picture.myCanvas.selection === picture) {
            ctx.strokeStyle = config.SELECTION_COLOR;
            ctx.lineWidth = config.SELECTION_WIDTH;
            ctx.strokeRect(picture.x, picture.y, picture.w, picture.h);
        }

        ctx.drawImage(picture.pic, picture.x, picture.y, picture.w, picture.h);
    };

    Picture.prototype.contains = function(mx, my) {
        var picture = this;
        return  (picture.x <= mx) && (picture.x + picture.w >= mx) &&
                (picture.y <= my) && (picture.y + picture.h >= my);
    };

    /**
     * State of canvas
     * @param {Element} canvas
     * @param {Object} opts - optional
     * @constructor
     */
    function MyCanvas(canvas, opts) {
        var myCanvas = this;

        // Canvas vars
        myCanvas.canvas = canvas;
        myCanvas.width = canvas.width;
        myCanvas.height = canvas.height;
        myCanvas.ctx = canvas.getContext('2d');
        myCanvas.pixelRatio = 1; // See MyCanvas.init() for details.
        myCanvas.ratio = myCanvas.width / myCanvas.height;
        myCanvas.scale = myCanvas.width / 320;

        // Basic options
        myCanvas.shapes = []; // The collection of shapes to be drawn
        myCanvas.rectangles = []; // It is useful to have arrays of relative shapes. See MyCanvas.prototype.addShape() for details.
        myCanvas.pictures = [];


        // Custom game properties (Balloon game)
        myCanvas.nextAttack = 100;


        myCanvas.dragging = false; // Keep track of when we are dragging.
        myCanvas.selection = null; // The current selected object.
        myCanvas.dragoffx = 0; // See pointerstart and pointerend events for explanation
        myCanvas.dragoffy = 0;

        // Check if IE
        myCanvas.ie = (
                      navigator.userAgent.toLowerCase().indexOf("windows phone") != -1 ||
                      (navigator.userAgent.toLowerCase().indexOf("windows nt") != -1 &&
                       navigator.userAgent.toLowerCase().indexOf("touch") != -1)
                      );

        // Adds custom options from opts
        for (var opt in opts) {
            if (opts.hasOwnProperty(opt)) {
                myCanvas[opt] = opts[opt];
            }
        }

        // Get paddings and borders
        var canvasStyles = window.getComputedStyle(canvas, null);
        myCanvas.stylePaddingLeft = parseInt(canvasStyles['paddingLeft'], 10)      || 0;
        myCanvas.stylePaddingTop  = parseInt(canvasStyles['paddingTop'], 10)       || 0;
        myCanvas.styleBorderLeft  = parseInt(canvasStyles['borderLeftWidth'], 10)  || 0;
        myCanvas.styleBorderTop   = parseInt(canvasStyles['borderTopWidth'], 10)   || 0;


        // Fixes a problem where double clicking causes text to get selected on the canvas.
        canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

        function pointerStart(e) {
            var mouse = myCanvas.getPointer(e),
                mx = mouse.x / myCanvas.scale,
                my = mouse.y / myCanvas.scale,
                shapes = myCanvas.shapes,
                l = shapes.length;

            for (var i = l-1; i >= 0; i--) {
                var shape = myCanvas.shapes[i];
                if (shape.contains(mx, my) && shape.type == 'attacker') {
                    myCanvas.shapes.splice(i, 1);
                }
            }
        }

        function pointerMove(e) {
            e.preventDefault();
        }

        function pointerEnd(e) {
            e.preventDefault();
        }

        // Set event listeners if needed
        canvas.addEventListener('pointerdown', pointerStart, false);
        canvas.addEventListener('pointermove', pointerMove, false);
        canvas.addEventListener('pointerup', pointerEnd, false);

        myCanvas.update = function(time) {
            myCanvas.nextAttack -= 1;

            if (myCanvas.nextAttack < 0) {
                var x = Math.random() * myCanvas.width;
                var attackSpeed = (Math.random() * 3) + 1;
                var attacker = new Rectangle(myCanvas, {x: x, y: -100, fill: 'red', type: 'attacker'});

                attacker.update = function(time){
                    attacker.x = 30 * Math.sin(time) + attacker.initX;
                    attacker.y += attackSpeed;
                };

                myCanvas.addShape(attacker);

                myCanvas.nextAttack = ( Math.random() * 100 ) + 100;
            }

            for (var i = 0; i < myCanvas.shapes.length; i++) {
                var shape = myCanvas.shapes[i];
                if (shape.y > myCanvas.height) {
                    myCanvas.shapes.splice(i, 1);
                }
            }
        };

        myCanvas.render = function(time) {
            var l = myCanvas.shapes.length;

            myCanvas.clear();

            // Draw all shapes.
            for (var i = 0; i < l; i++) {
                var shape = myCanvas.shapes[i];

                if (shape.update) {
                    shape.update(time);
                }

                shape.draw();
            }

            // Draw selected shape last to be on top of the others.
            if (myCanvas.selection && config.SELECTION_ON_TOP) {
                myCanvas.selection.draw();
            }
        };

        myCanvas.start = function () {
//            console.log(myCanvas.shapes)
            var time = Date.now() * 0.002;

            myCanvas.update(time);
            myCanvas.render(time);

            requestAnimationFrame(myCanvas.start, myCanvas.canvas);
        };

        myCanvas.init();
    }

    MyCanvas.prototype.addShape = function(shape) {
        var myCanvas = this;

        myCanvas.shapes.push(shape);
        if (shape.type === 'rectangle') {
            myCanvas.rectangles.push(shape);
        }
        if (shape.type === 'picture') {
            myCanvas.pictures.push(shape);
        }
        myCanvas.valid = false;
    };

    MyCanvas.prototype.clear = function() {
        var myCanvas = this;
        myCanvas.ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        return myCanvas;
    };

    MyCanvas.prototype.getPointer = function(e) {
        var myCanvas = this;
        var element = myCanvas.canvas;
        var box = element.getBoundingClientRect();
        var mx;
        var my;

        // Compute the total offset
        var offsetY = box.top + myCanvas.styleBorderTop + myCanvas.stylePaddingTop;
        var offsetX = box.left + myCanvas.styleBorderLeft + myCanvas.stylePaddingLeft;

        // IE has another property for pointer coords
        if (myCanvas.ie) {
            mx = e.originalEvent.pageX - offsetX;
            my = e.originalEvent.pageY - offsetY;
        } else {
            mx = e.clientX - offsetX;
            my = e.clientY - offsetY;
        }

        return {x: mx, y: my};
    };

    MyCanvas.prototype.init = function() {
        var myCanvas = this,
            ctx = myCanvas.ctx,
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                                ctx.mozBackingStorePixelRatio ||
                                ctx.msBackingStorePixelRatio ||
                                ctx.oBackingStorePixelRatio ||
                                ctx.backingStorePixelRatio || 1,

            pixelRatio = devicePixelRatio / backingStoreRatio;

        var w = 320,
            h = 480;

        myCanvas.ratio = w / h;
        myCanvas.canvas.width = w;
        myCanvas.canvas.height = h;

        myCanvas.width = w;
        myCanvas.height = h;

        myCanvas.resize();

//        if (pixelRatio !== 1) {
//            myCanvas.pixelRatio = pixelRatio;
//            w = w * pixelRatio;
//            h = h * pixelRatio;
//            canvas.width = w;
//            canvas.height = h;
//            myCanvas.ctx.scale(pixelRatio,pixelRatio);
//        }
    };

    MyCanvas.prototype.resize = function () {
        var myCanvas = this;

        myCanvas.height = myCanvas.canvas.parentNode.offsetHeight;
        myCanvas.width = myCanvas.height * myCanvas.ratio;

        myCanvas.canvas.style.width = myCanvas.width + 'px';
        myCanvas.canvas.style.height = myCanvas.height + 'px';

        myCanvas.scale = myCanvas.width / 320;
    };

    function getRetinaPath(src, retinaPath) {
        var path = src.split('/');
        path[path.length-1] = retinaPath + '/' + path[path.length-1];
        return path.join('/');
    }

    return {
        MyCanvas: MyCanvas,
        Rectangle: Rectangle,
        Picture: Picture,
        config: config
    };

})();
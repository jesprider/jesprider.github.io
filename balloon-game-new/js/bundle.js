/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var game = __webpack_require__(1);

	window.addEventListener('load', game.init, false);
	window.addEventListener('resize', game.resize, false);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Input = __webpack_require__(2);
	var Artifact = __webpack_require__(10);
	var Balloon = __webpack_require__(8);
	var Touch = __webpack_require__(4);
	var Particle = __webpack_require__(5);
	var Draw = __webpack_require__(6);
	var hitArtifact = __webpack_require__(13);
	var collidesBalloon = __webpack_require__(14);

	var game = {

	    // set up some inital values
	    WIDTH: 320,
	    HEIGHT:  480,
	    scale:  1,
	    // the position of the canvas
	    // in relation to the screen
	    offset: {top: 0, left: 0},
	    // store all artifacts, touches, particles etc
	    entities: [],
	    // the amount of game ticks until
	    // we spawn a artifact
	    nextArtifact: 100,
	    // for tracking player's progress
	    score: {
	        taps: 0,
	        hit: 0,
	        escaped: 0,
	        accuracy: 0
	    },
	    // we'll set the rest of these
	    // in the init function
	    RATIO:  null,
	    currentWidth:  null,
	    currentHeight:  null,
	    canvas: null,
	    ctx:  null,
	    ua:  null,
	    android: null,
	    ios:  null,

	    init: function() {

	        // the proportion of width to height
	        game.RATIO = game.WIDTH / game.HEIGHT;
	        // these will change when the screen is resize
	        game.currentWidth = game.WIDTH;
	        game.currentHeight = game.HEIGHT;
	        // this is our canvas element
	        game.canvas = document.getElementsByTagName('canvas')[0];
	        // it's important to set this
	        // otherwise the browser will
	        // default to 320x200
	        game.canvas.width = game.WIDTH;
	        game.canvas.height = game.HEIGHT;
	        // the canvas context allows us to
	        // interact with the canvas api
	        game.ctx = game.canvas.getContext('2d');
	        // we need to sniff out android & ios
	        // so we can hide the address bar in
	        // our resize function
	        game.ua = navigator.userAgent.toLowerCase();
	        game.android = game.ua.indexOf('android') > -1 ? true : false;
	        game.ios = ( game.ua.indexOf('iphone') > -1 || game.ua.indexOf('ipad') > -1  ) ? true : false;

	        // set up our wave effect
	        // basically, a series of overlapping circles
	        // across the top of screen
	        game.wave = {
	            x: -25, // x coord of first circle
	            y: -40, // y coord of first circle
	            r: 50, // circle radius
	            time: 0, // we'll use this in calculating the sine wave
	            offset: 0 // this will be the sine wave offset
	        };
	        // calculate how many circles we need to
	        // cover the screen width
	        game.wave.total = Math.ceil(game.WIDTH / game.wave.r) + 1;

	        game.balloon = new Balloon(game);

	        // listen for clicks
	        window.addEventListener('click', function(e) {
	            e.preventDefault();
	            Input.set(game, e);
	        }, false);

	        // listen for touches
	        window.addEventListener('touchstart', function(e) {
	            e.preventDefault();
	            // the event object has an array
	            // called touches, we just want
	            // the first touch
	            Input.set(game, e.touches[0]);
	        }, false);
	        window.addEventListener('touchmove', function(e) {
	            // we're not interested in this
	            // but prevent default behaviour
	            // so the screen doesn't scroll
	            // or zoom
	            e.preventDefault();
	        }, false);
	        window.addEventListener('touchend', function(e) {
	            // as above
	            e.preventDefault();
	        }, false);

	        // we're ready to resize
	        game.resize();

	        game.loop();

	    },


	    resize: function() {

	        game.currentHeight = window.innerHeight;
	        // resize the width in proportion
	        // to the new height
	        game.currentWidth = game.currentHeight * game.RATIO;

	        // this will create some extra space on the
	        // page, allowing us to scroll pass
	        // the address bar, and thus hide it.
	        if (game.android || game.ios) {
	            document.body.style.height = (window.innerHeight + 50) + 'px';
	        }

	        // set the new canvas style width & height
	        // note: our canvas is still 320x480 but
	        // we're essentially scaling it with CSS
	        game.canvas.style.width = game.currentWidth + 'px';
	        game.canvas.style.height = game.currentHeight + 'px';

	        // the amount by which the css resized canvas
	        // is different to the actual (480x320) size.
	        game.scale = game.currentWidth / game.WIDTH;
	        // position of canvas in relation to
	        // the screen
	        game.offset.top = game.canvas.offsetTop;
	        game.offset.left = game.canvas.offsetLeft;

	        // we use a timeout here as some mobile
	        // browsers won't scroll if there is not
	        // a small delay
	        window.setTimeout(function() {
	            window.scrollTo(0,1);
	        }, 1);
	    },

	    // this is where all entities will be moved
	    // and checked for collisions etc
	    update: function() {
	        var i,
	            checkCollision = false; // we only need to check for a collision
	                                // if the user tapped on this game tick

	        // decrease our nextBubble counter
	        game.nextArtifact -= 1;
	        // if the counter is less than zero
	        if (game.nextArtifact < 0) {
	            // put a new instance of bubble into our entities array
	            game.entities.push(new Artifact(game));
	            // reset the counter with a random value
	            game.nextArtifact = ( Math.random() * 100 ) + 100;
	        }

	        // spawn a new instance of Touch
	        // if the user has tapped the screen
	        if (Input.tapped) {
	            // keep track of taps; needed to
	            // calculate accuracy
	            game.score.taps += 1;
	            // add a new touch
	            game.entities.push(new Touch(game, Input.x, Input.y));
	            // set tapped back to false
	            // to avoid spawning a new touch
	            // in the next cycle
	            Input.tapped = false;
	            checkCollision = true;
	        }

	        // cycle through all entities and update as necessary
	        for (i = 0; i < game.entities.length; i += 1) {
	            game.entities[i].update();

	            if (game.entities[i].type === 'artifact' && checkCollision) {
	                hit = hitArtifact(game.entities[i],
	                                    {x: Input.x, y: Input.y, r: 7});
	                if (hit) {
	                    // spawn an exposion
	                    for (var n = 0; n < 5; n +=1 ) {
	                        game.entities.push(new Particle(
	                            game,
	                            game.entities[i].x, 
	                            game.entities[i].y, 
	                            2, 
	                            // random opacity to spice it up a bit
	                            'rgba(255,255,255,' + (Math.random() * 0.5 + 0.5) + ')'
	                        )); 
	                    }
	                    game.score.hit += 1;
	                }

	                game.entities[i].remove = hit;
	            }

	            // delete from array if remove property
	            // flag is set to true
	            if (game.entities[i].remove) {
	                game.entities.splice(i, 1);
	            }
	        }

	        game.balloon.update();

	        // update wave offset
	        // feel free to play with these values for
	        // either slower or faster waves
	        game.wave.time = Date.now() * 0.002;
	        game.wave.offset = Math.sin(game.wave.time * 0.8) * 5;

	        // calculate accuracy
	        game.score.accuracy = (game.score.hit / game.score.taps) * 100;
	        game.score.accuracy = isNaN(game.score.accuracy) ?
	            0 :
	            ~~(game.score.accuracy); // a handy way to round floats

	    },


	    // this is where we draw all the entities
	    render: function() {
	        var i;

	        Draw.rect(game, 0, 0, game.WIDTH, game.HEIGHT, '#6ee5dd');

	        // display snazzy wave effect
	        for (i = 0; i < game.wave.total; i++) {

	            Draw.circle(game,
	                        game.wave.x + game.wave.offset +  (i * game.wave.r), 
	                        game.wave.y,
	                        game.wave.r, 
	                        '#fff'); 
	        }

	        // cycle through all entities and render to canvas
	        for (i = 0; i < game.entities.length; i += 1) {
	            var collides = collidesBalloon(game.entities[i], game.balloon, game);3
	            if (collides) {
	                window.cancelAnimationFrame(game.animId);
	            }

	            game.entities[i].render();
	        }

	        game.balloon.render();

	        // display scores
	        Draw.text(game, 'Hit: ' + game.score.hit, 20, 30, 14, '#fff');
	        Draw.text(game, 'Escaped: ' + game.score.escaped, 20, 50, 14, '#fff');
	        Draw.text(game, 'Accuracy: ' + game.score.accuracy + '%', 20, 70, 14, '#fff');

	    },


	    // the actual loop
	    // requests animation frame
	    // then proceeds to update
	    // and render
	    loop: function() {

	        game.animId = requestAnimationFrame( game.loop );

	        game.update();
	        game.render();
	    }
	};

	module.exports = game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(6);

	module.exports = function(game, x, y) {
	    this.type = 'touch';    // we'll need this later
	    this.x = x;             // the x coordinate
	    this.y = y;             // the y coordinate
	    this.r = 5;             // the radius
	    this.opacity = 1;       // inital opacity. the dot will fade out
	    this.fade = 0.05;       // amount by which to fade on each game tick
	    // this.remove = false;    // flag for removing this entity. balloon.update
	                            // will take care of this

	    this.update = function() {
	        // reduct the opacity accordingly
	        this.opacity -= this.fade;
	        // if opacity if 0 or less, flag for removal
	        this.remove = (this.opacity < 0) ? true : false;
	    };

	    this.render = function() {
	        Draw.circle(game, this.x, this.y, this.r, 'rgba(255,0,0,'+this.opacity+')');
	    };

	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(6);

	module.exports = function(game, x, y, r, col) {

	    this.x = x;
	    this.y = y;
	    this.r = r;
	    this.col = col;

	    // determines whether particle will
	    // travel to the right of left
	    // 50% chance of either happening
	    this.dir = (Math.random() * 2 > 1) ? 1 : -1;

	    // random values so particles do no
	    // travel at the same speeds
	    this.vx = ~~(Math.random() * 4) * this.dir;
	    this.vy = ~~(Math.random() * 7);

	    this.remove = false;

	    this.update = function() {

	        // update coordinates
	        this.x += this.vx;
	        this.y -= this.vy;

	        // increase velocity so particle
	        // accelerates off screen
	        this.vx *= 0.99;
	        this.vy *= 0.99;

	        // adding this negative amount to the
	        // y velocity exerts an upward pull on
	        // the particle, as if drawn to the
	        // surface
	        this.vy -= 0.25;

	        // offscreen
	        if (this.y > game.HEIGHT) {
	            this.remove = true;
	        }

	    };

	    this.render = function() {
	        Draw.circle(game, this.x, this.y, this.r, this.col);
	    };

	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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
	        game.ctx.font = 'bold '+size+'px Monospace';
	        game.ctx.fillStyle = col;
	        game.ctx.fillText(string, x, y);
	    },

	    pic: function (game, pic, x, y, w, h) {
	        game.ctx.drawImage(pic, x, y, w, h);
	    }
	};

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(6);

	module.exports = function (game) {
	    this.type = 'balloon';

	    var d = 0.05;
	    var w = 212;
	    var h = 335;
	    var ratio = h / w;

	    this.w = w / 5;
	    this.h = h / 5;

	    this.r = this.w / 2;

	    this.x = game.WIDTH / 2 - this.w / 2;
	    this.y = game.HEIGHT - this.h;

	    this.initX = this.x;

	    this.remove = false;

	    this.pic = new Image();
	    this.pic.src = './i/shar-size-1.png';

	    this.update = function() {
	        // a sine wave is commonly a function of time
	        var time = Date.now() * 0.002;
	        this.x = 30 * Math.sin(time) + (game.WIDTH / 2 - this.w / 2);
	        this.w += d;
	        this.h += (ratio * d);
	        this.y = game.HEIGHT - this.h;
	        this.r = this.w / 2;
	    };

	    this.render = function() {
	        Draw.pic(game, this.pic, this.x, this.y, this.w, this.h);
	    };
	};

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(6);

	module.exports = function(game) {
	    var artifact = this;
	    
	    artifact.type = 'artifact';
	    artifact.speed = (Math.random() * 3) + 1;

	    artifact.w = 100;
	    artifact.h = 100;
	    artifact.r = artifact.w / 2;

	    artifact.x = (Math.random() * (game.WIDTH) - artifact.w / 2);
	    artifact.y = -(Math.random() * 100) - 100;

	    // the amount by which the bubble
	    // will move from side to side
	    artifact.waveSize = 5 + artifact.w / 2;
	    // we need to remember the original
	    // x position for our sine wave calculation
	    artifact.initX = artifact.x;

	    artifact.remove = false;

	    artifact.pic = new Image();
	    // we have for types of pictures, named from 1 to 4.
	    artifact.pic.src = './i/item-' + (Math.floor(Math.random() * 4) + 1) + '.png';

	    artifact.pic.onload = function() {
	        artifact.w = artifact.pic.naturalWidth / 1.5;
	        artifact.h = artifact.pic.naturalHeight / 1.5;
	        artifact.r = Math.min(artifact.w, artifact.h) / 2;
	    };

	    artifact.update = function() {

	        // a sine wave is commonly a function of time
	        var time = new Date().getTime() * 0.002;

	        artifact.y += artifact.speed;
	        // the x coord to follow a sine wave
	        artifact.x = artifact.waveSize * Math.sin(time) + artifact.initX;

	        // if offscreen flag for removal
	        if (artifact.y > game.HEIGHT + 10) {
	            game.score.escaped += 1; // update score
	            artifact.remove = true;
	        }

	    };

	    artifact.render = function() {
	        Draw.pic(game, artifact.pic, artifact.x, artifact.y, artifact.w, artifact.h);
	    };

	};

/***/ },
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(a, b) {
	//    var x = {
	//        min: a.x,
	//        max: a.x + a.w
	//    };
	//
	//    var y = {
	//        min: a.y,
	//        max: a.y + a.h
	//    };

	    var dx = a.x + a.w / 2;
	    var dy = a.y + a.h / 2;

	    var distance_squared = ( ((dx - b.x) * (dx - b.x)) +
	                            ((dy - b.y) * (dy - b.y)));

	    var radii_squared = (a.r + b.r) * (a.r + b.r);

	    return distance_squared < radii_squared;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var draw = __webpack_require__(6);

	module.exports = function(a, b, game) {
	    var dx = a.x + a.w / 2;
	    var dy = a.y + a.h / 2;

	    // balloon center for circle
	    var bx = b.x + b.r;
	    var by = b.y + b.r;

	    var distance_squared = ( ((dx - bx) * (dx - bx)) +
	                            ((dy - by) * (dy - by)));

	    var radii_squared = (a.r + b.r) * (a.r + b.r);

	//    draw.circle(game, dx, dy, a.r, 'red');
	//    draw.circle(game, bx, by, b.r, 'blue');

	    return distance_squared - radii_squared < 10;
	};

/***/ }
/******/ ]);
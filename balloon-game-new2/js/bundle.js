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

	var config = __webpack_require__(2);
	var Input = __webpack_require__(3);
	var Artifact = __webpack_require__(4);
	var Balloon = __webpack_require__(5);
	var Touch = __webpack_require__(6);
	var Particle = __webpack_require__(7);
	var Draw = __webpack_require__(8);
	var hitArtifact = __webpack_require__(9);
	var collidesBalloon = __webpack_require__(10);
	var Pump = __webpack_require__(11);

	var game = {
	//    // set up some inital values
	    WIDTH: config.width,
	    HEIGHT:  config.height,
	    scale:  1,
	    // the position of the canvas
	    // in relation to the screen
	    offset: {top: 0, left: 0},
	    // store all artifacts, touches, particles etc
	    entities: [],
	    // the amount of game ticks until
	    // we spawn a artifact
	    nextArtifact: config.firstArtifact,
	    blowing: false,
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
	//        var wh = window.innerHeight;
	//        var ww = window.innerWidth;
	//
	//        if (wh/ww < 1 || ww > 767) {
	//            game.WIDTH = config.width;
	//            game.HEIGHT = config.height;
	//        } else {
	//            game.WIDTH = ww * 1.5;
	//            game.HEIGHT = wh * 1.5;
	//        }

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

	        // set up our wave effect
	        // basically, a series of overlapping circles
	        // across the top of screen
	        game.wave = config.wave;
	        // calculate how many circles we need to
	        // cover the screen width
	        game.wave.total = Math.ceil(game.WIDTH / game.wave.r) + 1;

	        // Шарик и насос
	        game.balloon = new Balloon(game);
	        game.pump = new Pump(game);

	        // listen for clicks, using hand.js polyfill
	        window.addEventListener('pointerdown', function(e) {
	            e.preventDefault();
	            Input.set(game, e);
	        }, false);

	        window.addEventListener('pointermove', function(e) {
	            // we're not interested in this
	            // but prevent default behaviour
	            // so the screen doesn't scroll
	            // or zoom
	            e.preventDefault();
	        }, false);

	        window.addEventListener('pointerup', function(e) {
	            // as above
	            e.preventDefault();
	        }, false);

	        // we're ready to resize
	        game.resize();
	        game.loop();
	    },


	    resize: function() {
	//        if (game.currentWidth > window.innerWidth) {
	//            game.currentWidth = window.innerWidth;
	//            game.currentHeight = game.currentWidth / game.RATIO;
	//        }

	        game.currentHeight = window.innerHeight;
	        // resize the width in proportion
	        // to the new height
	        game.currentWidth = game.currentHeight * game.RATIO;

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
	    },

	    // this is where all entities will be moved
	    // and checked for collisions etc
	    update: function() {
	        var i;
	        var checkCollision = false; // we only need to check for a collision if the user tapped on this game tick
	        var time = Date.now() * 0.002;

	        game.blowing = Math.sin(time * config.timeOfBlowing) > 0; // используется для синхронизации насоса и шарика
	        game.artifactCrashed = false;

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

	            if (game.entities[i].type === 'artifact') {

	                if (checkCollision) {
	                    hit = hitArtifact(game.entities[i],
	                                    {x: Input.x, y: Input.y, r: 7});
	                    if (hit) {
	                        // spawn an exposion
	                        game.addParticles(game.entities[i], 2, 7);

	                        game.score.hit += 1;
	                        game.entities[i].remove = true;
	                    }
	                }

	                if (game.artifactCrashed) {
	                    game.addParticles(game.entities[i], 3, 10);
	                }

	            }

	            // delete from array if remove property
	            // flag is set to true
	            if (game.entities[i].remove) {
	                game.entities.splice(i, 1);
	            }
	        }

	        game.balloon.update();
	        game.pump.update();

	        // update wave offset
	        // feel free to play with these values for
	        // either slower or faster waves
	        game.wave.offset = Math.sin(time * game.wave.sinTime) * game.wave.rangeIndex;

	        // calculate accuracy
	        game.score.accuracy = (game.score.hit / game.score.taps) * 100;
	        game.score.accuracy = isNaN(game.score.accuracy) ?
	            0 :
	            ~~(game.score.accuracy); // a handy way to round floats

	    },


	    // this is where we draw all the entities
	    render: function() {
	        var i;

	        Draw.rect(game, 0, 0, game.WIDTH, game.HEIGHT, config.bgColor);
	        Draw.rect(game, 0, game.HEIGHT - config.groundUpWidth - config.groundDownWidth, game.WIDTH, config.groundUpWidth, config.groundColorUp);
	        Draw.rect(game, 0, game.HEIGHT - config.groundDownWidth, game.WIDTH, config.groundDownWidth, config.groundColorDown);
	        Draw.rect(game, game.WIDTH/5 - 25, game.HEIGHT - config.groundUpWidth - config.groundDownWidth - 4, game.WIDTH/2 - game.WIDTH/5, 4, config.hoseColor);
	        Draw.rect(game, game.WIDTH/2 - 25, game.HEIGHT - config.groundUpWidth - config.groundDownWidth - 10, 50, 10, config.hoseColor);
	        game.pump.render();
	        game.balloon.render();

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
	            var collides = collidesBalloon(game.entities[i], game.balloon, game);
	            if (collides) {
	                window.cancelAnimationFrame(game.animId);

	                // show next layer
	            }

	            game.entities[i].render();
	        }

	        // display scores
	        Draw.text(game, 'Cakes killed: ' + game.score.hit, 20, 30, 14, '#fff');
	        Draw.text(game, 'Accuracy: ' + game.score.accuracy + '%', 180, 30, 14, '#fff');
	    },


	    // the actual loop
	    // requests animation frame
	    // then proceeds to update
	    // and render
	    loop: function() {

	        game.animId = requestAnimationFrame( game.loop );

	        game.update();
	        game.render();
	    },

	    // helper to add particles for artifacts
	    addParticles: function(artifact, radius, strength) {
	        for (var n = 0; n < 5; n +=1 ) {
	            game.entities.push(new Particle(
	                game,
	                artifact.x,
	                artifact.y,
	                radius,
	                // random opacity to spice it up a bit
	                'rgba(255,255,255,' + (Math.random() * 0.5 + 0.5) + ')',
	                strength
	            ));
	        }
	    }
	};

	module.exports = game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    //
	    // общеигровые настройки
	    //

	    width: 640, // ширина канваса
	    height: 960, // высота

	    // цвет фона
	    bgColor: '#6ee5dd',
	    groundColorUp: '#00a651',
	    groundColorDown: '#7cc576',
	    hoseColor: '#f26122',

	    groundUpWidth: 10,
	    groundDownWidth: 20,
	    groundWidth: this.groundUpWidth + this.groundDownWidth,

	    // времени до появления первого артифакта (условные единицы)
	    firstArtifact: 100,

	    // параметры для облаков вверху экрана
	    wave: {
	        x: -25, // x coord of first circle
	        y: -40, // y coord of first circle
	        r: 50, // circle radius
	        time: 0, // we'll use this in calculating the sine wave
	        offset: 0, // this will be the sine wave offset
	        sinTime: 0.8, // коэффициент для синусоиды (меньше значение - дольше интервал)
	        rangeIndex: 10 // коэффициент насколько сильно будут качаться облака (больше значение - больше дистанция)
	    },

	    // коэффициент для синусоиды (меньше значение - дольше интервал накачивания и спускания)
	    timeOfBlowing: 0.5,


	    //
	    // настройки шарика
	    //

	    balloon: {
	        // интенсивность надувания шарика
	        blowingSpeed: 0.2,
	        // коэффициент уменьшения шарика для начала игры
	        minIndex: 0.2,
	        // коэффициент сдутия шарика (blowingSpeed * unblowingIndex)
	        unblowingIndex: 0.3,
	        // как широко будет раскачиваться
	        rangeIndex: 10
	    },

	    //
	    // настройка артифакта
	    //

	    artifact: {
	        // разброс скорости в пределах которого она может меняться
	        speedRange: 4,
	        // количество артифактов
	        quantity: 4,
	        // высота появления артифактов: heightRange * random + heightOfAppearing
	        heightOfAppearing: -100,
	        heightRange: -100,
	        waveRange: 5
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);
	var config = __webpack_require__(2);

	module.exports = function(game) {
	    var artifact = this;
	    
	    artifact.type = 'artifact';
	    artifact.speed = (Math.random() * config.artifact.speedRange) + 1;
	    artifact.remove = false;

	    // we have four types of pictures, named from 1 to 4.
	    var picNum = (Math.floor(Math.random() * config.artifact.quantity) + 1);

	    artifact.pic = new Image();
	    artifact.pic.src = './i/a' + picNum + '.png';

	    artifact.pic.onload = function() {
	        // todo: clear the division
	        artifact.w = artifact.pic.naturalWidth / 1.5;
	        artifact.h = artifact.pic.naturalHeight / 1.5;

	        artifact.r = Math.min(artifact.w, artifact.h) / 2;

	        artifact.x = Math.random() * game.WIDTH - artifact.w / 2;
	        artifact.y = Math.random() * config.artifact.heightRange + config.artifact.heightOfAppearing;

	        // the amount by which the bubble
	        // will move from side to side
	        artifact.waveSize = config.artifact.waveRange + artifact.w / 2;
	        // we need to remember the original
	        // x position for our sine wave calculation
	        artifact.initX = artifact.x;
	    };

	    artifact.update = function() {

	        // a sine wave is commonly a function of time
	        var time = Date.now() * 0.002;

	        artifact.y += artifact.speed;
	        // the x coord to follow a sine wave
	        artifact.x = artifact.waveSize * Math.sin(time) + artifact.initX;

	        // if offscreen flag for removal
	        if (artifact.y > (game.HEIGHT - artifact.h + 10)) {
	            game.artifactCrashed = true;
	            game.score.escaped += 1; // update score
	            artifact.remove = true;
	        }

	    };

	    artifact.render = function() {
	        Draw.pic(game, artifact.pic, artifact.x, artifact.y, artifact.w, artifact.h);
	    };

	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);
	var config = __webpack_require__(2);

	module.exports = function (game) {
	    var balloon = this;

	    balloon.type = 'balloon';

	    balloon.pic = new Image();
	    balloon.pic.src = './i/shar-size-1.png';

	     var groundWidth = config.groundUpWidth + config.groundDownWidth;

	    balloon.pic.onload = function () {
	        balloon.w = balloon.pic.naturalWidth * config.balloon.minIndex;
	        balloon.h = balloon.pic.naturalHeight * config.balloon.minIndex;

	        // center the balloon
	        balloon.x = game.WIDTH / 2 - balloon.w / 2;
	        balloon.y = game.HEIGHT - balloon.h - groundWidth - 10;

	        balloon.ratio = balloon.h / balloon.w;
	        balloon.r = balloon.w / 2; // we know that width < height
	        balloon.initX = balloon.x;
	    };

	    balloon.update = function() {
	        // a sine wave is commonly a function of time
	        var time = Date.now() * 0.002;

	        if (game.blowing) {
	            balloon.w += config.balloon.blowingSpeed;
	            balloon.h += (balloon.ratio * config.balloon.blowingSpeed);
	            balloon.r = balloon.w / 2;
	        } else {
	            balloon.w -= config.balloon.blowingSpeed * config.balloon.unblowingIndex;
	            balloon.h -= (balloon.ratio * config.balloon.blowingSpeed * config.balloon.unblowingIndex);
	            balloon.r = balloon.w / 2;
	        }

	        balloon.x = config.balloon.rangeIndex * Math.sin(time) + (game.WIDTH / 2 - balloon.w / 2);
	        balloon.y = game.HEIGHT - balloon.h - groundWidth - 10;
	    };

	    balloon.render = function() {
	        Draw.pic(game, balloon.pic, balloon.x, balloon.y, balloon.w, balloon.h);
	    };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);

	module.exports = function(game, x, y) {
	    var touch = this;

	    touch.type = 'touch';    // we'll need touch later
	    touch.x = x;             // the x coordinate
	    touch.y = y;             // the y coordinate
	    touch.r = 5;             // the radius
	    touch.opacity = 1;       // inital opacity. the dot will fade out
	    touch.fade = 0.05;       // amount by which to fade on each game tick
	    // touch.remove = false;    // flag for removing touch entity. balloon.update
	                            // will take care of touch

	    touch.update = function() {
	        // reduct the opacity accordingly
	        touch.opacity -= touch.fade;
	        // if opacity if 0 or less, flag for removal
	        touch.remove = (touch.opacity < 0) ? true : false;
	    };

	    touch.render = function() {
	        Draw.circle(game, touch.x, touch.y, touch.r, 'rgba(255,0,0,'+touch.opacity+')');
	    };

	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);

	module.exports = function(game, x, y, r, col, strength) {
	    var particle = this;
	    
	    particle.x = x;
	    particle.y = y;
	    particle.r = r;
	    particle.col = col;

	    // determines whether particle will
	    // travel to the right of left
	    // 50% chance of either happening
	    particle.dir = (Math.random() * 2 > 1) ? 1 : -1;

	    // random values so particles do no
	    // travel at the same speeds
	    particle.vx = ~~(Math.random() * 4) * particle.dir;
	    particle.vy = ~~(Math.random() * strength);

	    particle.remove = false;

	    particle.update = function() {

	        // update coordinates
	        particle.x += particle.vx;
	        particle.y -= particle.vy;

	        // increase velocity so particle
	        // accelerates off screen
	        particle.vx *= 0.99;
	        particle.vy *= 0.99;

	        // adding particle negative amount to the
	        // y velocity exerts an upward pull on
	        // the particle, as if drawn to the
	        // surface
	        particle.vy -= 0.25;

	        // offscreen
	        if (particle.y > game.HEIGHT) {
	            particle.remove = true;
	        }

	    };

	    particle.render = function() {
	        Draw.circle(game, particle.x, particle.y, particle.r, particle.col);
	    };

	};

/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(a, b) {
	    var centerArtifactX = a.x + a.w / 2;
	    var centerArtifactY = a.y + a.h / 2;

	    var distance_squared = ( ((centerArtifactX - b.x) * (centerArtifactX - b.x)) +
	                            ((centerArtifactY - b.y) * (centerArtifactY - b.y)));

	    var radii_squared = (a.r + b.r) * (a.r + b.r);

	    return distance_squared < radii_squared;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);

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

	    return distance_squared - radii_squared < 10;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Draw = __webpack_require__(8);
	var config = __webpack_require__(2);

	module.exports = function (game) {
	    var pump = this;

	    pump.type = 'pump';

	    pump.pump1 = new Image();
	    pump.pump1.src = './i/pump1.png';

	    pump.pump2 = new Image();
	    pump.pump2.src = './i/pump2.png';

	    var groundWidth = config.groundUpWidth + config.groundDownWidth;
	    var scale = game.HEIGHT / 960;

	    pump.pump1.onload = function () {
	        pump.pump1.w = pump.pump1.naturalWidth * scale;
	        pump.pump1.h = pump.pump1.naturalHeight * scale;

	        // use 'dx' instead of 'x' because pump.pump1 is picture object
	        // and already has property 'x'
	        pump.pump1.dx = game.WIDTH / 5 - pump.pump1.w / 2;
	        pump.pump1.dy = game.HEIGHT - pump.pump1.h - groundWidth;
	    };

	    pump.pump2.onload = function () {
	        pump.pump2.w = pump.pump2.naturalWidth * scale;
	        pump.pump2.h = pump.pump2.naturalHeight * scale;

	        pump.pump2.dx = game.WIDTH / 5 - pump.pump2.w / 2;
	        pump.pump2.dy = game.HEIGHT - pump.pump2.h - groundWidth;
	    };

	    pump.update = function() {
	        // a sine wave is commonly a function of time
	        var time = Date.now() * 0.002;

	        if (game.blowing) {
	            pump.pump1.dy = 30 * Math.sin(time * 5) + game.HEIGHT - pump.pump1.h - groundWidth - 35;
	        }
	    };

	    pump.render = function() {
	        Draw.pic(game, pump.pump1, pump.pump1.dx, pump.pump1.dy, pump.pump1.w, pump.pump1.h);
	        Draw.pic(game, pump.pump2, pump.pump2.dx, pump.pump2.dy, pump.pump2.w, pump.pump2.h);
	    };
	};

/***/ }
/******/ ]);
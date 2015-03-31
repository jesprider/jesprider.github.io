var config = require('./config');
var Input = require('./input');
var Artifact = require('./artifact');
var Balloon = require('./balloon');
var Touch = require('./touch');
var Particle = require('./particle');
var Draw = require('./draw');
var hitArtifact = require('./hitArtifact');
var collidesBalloon = require('./collidesBalloon');
var Pump = require('./pump');
var Cloud = require('./cloud');
window.hookjs = window.hookjs || null;

var game = {
    // set up some inital values
    WIDTH: config.width,
    HEIGHT: config.height,
    scale: 1,
    imageScale: 1,
    // the position of the canvas
    // in relation to the screen
    offset: {top: 0, left: 0},
    // store all artifacts, touches, particles etc
    entities: [],
    clouds: [],
    // the amount of game ticks until
    // we spawn a artifact
    nextArtifact: config.firstArtifact,
    blowing: false,
    needTutorial: false,
    // for tracking player's progress
    score: {
        taps: 0,
        hit: 0,
        escaped: 0,
        accuracy: 0,
        total: 0
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
        var wh = window.innerHeight;
        var ww = window.innerWidth;

        if (wh/ww > 1 && ww < 767) {
            game.WIDTH = ww * 2;
            game.HEIGHT = wh * 2;
        }

        if (document.location.search === '?showtutorial') {
            game.needTutorial = true;
        }

        // will think that 640 - normal height of canvas
        game.imageScale = Math.min(wh / 640, 1);

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

        // Шарик и насос
        game.balloon = new Balloon(game);
        game.pump = new Pump(game);

        function addEventListener(eventType) {
            return function (e) {
                e.preventDefault();

                if (eventType === 'touchstart') {
                    Input.set(game, e.touches[0]);
                } else if (eventType === 'MSPointerDown') {
                    Input.set(game, e);
                } else {
                    Input.set(game, e);
                }
            }
        }

        var pointerDisabled = function (e) {
            e.preventDefault();
        };

        if ('ontouchstart' in window) {

            window.addEventListener('touchstart', addEventListener('touchstart'), false);
            window.addEventListener('touchmove', pointerDisabled, false);
            window.addEventListener('touchend', pointerDisabled, false);

        } else if (window.navigator && window.navigator.msPointerEnabled) {

            window.addEventListener('MSPointerDown', addEventListener('MSPointerDown'), false);
            window.addEventListener('MSPointerMove', pointerDisabled, false);
            window.addEventListener('MSPointerUp', pointerDisabled, false);

        } else {

            window.addEventListener('mousedown', addEventListener('mousedown'), false);
            window.addEventListener('mousemove', pointerDisabled, false);
            window.addEventListener('mouseup', pointerDisabled, false);

        }


        // we're ready to resize
        game.resize();
        game.loop();
    },


    resize: function() {
        if (game.currentWidth > window.innerWidth) {
            game.currentWidth = window.innerWidth;
            game.currentHeight = game.currentWidth / game.RATIO;
        }

        if (game.android || game.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        game.currentHeight = window.innerHeight;
        // check if we in android native app
        if (window.hookjs && window.hookjs.hideLoading) {
            game.currentHeight -= 50;
        }
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

        window.setTimeout(function() {
            window.scrollTo(0,1);
        }, 1);
    },

    // this is where all entities will be moved
    // and checked for collisions etc
    update: function() {
        var i, n;
        var checkCollision = false; // we only need to check for a collision if the user tapped on this game tick
        var time = Date.now() * 0.002;

        game.blowing = Math.sin(time * config.timeOfBlowing) > 0; // используется для синхронизации насоса и шарика
        game.artifactCrashed = false;

        // decrease our nextBubble counter
        game.nextArtifact -= 1;
        // if the counter is less than zero
        if (game.nextArtifact < 0) {
            if (game.clouds.length < 2 && !game.needTutorial) {
                game.clouds.push(new Cloud(game));
            }
            // put a new instance of bubble into our entities array
            game.entities.push(new Artifact(game));
            game.score.total += 1;
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
                        game.addParticles(game.entities[i], 3, 7);

                        game.score.hit += 1;
                        game.entities[i].remove = true;
                        game.needTutorial = false;
                    }
                }

                if (game.artifactCrashed) {
                    game.addParticles(game.entities[i], 4, 10);
                }

            }

            // delete from array if remove property
            // flag is set to true
            if (game.entities[i].remove) {
                game.entities.splice(i, 1);
            }
        }

        for (n = 0; n < game.clouds.length; n++) {
            game.clouds[n].update();

            if (game.clouds[n].remove) {
                game.clouds.splice(n, 1);
            }
        }

        game.balloon.update();
        game.pump.update();


        // calculate accuracy
        game.score.accuracy = (game.score.hit / game.score.taps) * 100;
        game.score.accuracy = isNaN(game.score.accuracy) ?
            0 :
            ~~(game.score.accuracy); // a handy way to round floats

    },


    // this is where we draw all the entities
    render: function() {
        var i, n;

        // фон
        Draw.rect(game, 0, 0, game.WIDTH, game.HEIGHT, config.bgColor);
        // земля верхний слой
        Draw.rect(game, 0, game.HEIGHT - config.groundWidth, game.WIDTH, config.groundUpWidth, config.groundColorUp);
        // земля нижний слой
        Draw.rect(game, 0, game.HEIGHT - config.groundDownWidth, game.WIDTH, config.groundDownWidth, config.groundColorDown);
        // шланг
        Draw.rect(game, game.WIDTH/5 - 25 * game.imageScale, game.HEIGHT - config.groundWidth - config.hoseWidth, game.WIDTH/2 - game.WIDTH/5, config.hoseWidth, config.hoseColor);
        // платформа под шариком
        Draw.rect(game, game.WIDTH/2 - 25, game.HEIGHT - config.groundUpWidth - config.groundDownWidth - 10, config.platformWidth, config.platformHeight, config.hoseColor);

        for (n = 0; n < game.clouds.length; n++) {
            game.clouds[n].render();
        }

        if (game.needTutorial && game.score.total > 0) {
            Draw.text(game, 'Нажимай', game.WIDTH / 4 + 70, game.HEIGHT / 3, 42, config.tutorialColor);
            Draw.text(game, 'на предметы,', game.WIDTH / 4 + 40, game.HEIGHT / 3 + 48, 42, config.tutorialColor);
            Draw.text(game, 'чтобы не дать им', game.WIDTH / 4, game.HEIGHT / 3 + 96, 42, config.tutorialColor);
            Draw.text(game, 'коснуться шарика!', game.WIDTH / 4 - 10, game.HEIGHT / 3 + 144, 42, config.tutorialColor);
        }

        game.pump.render();
        game.balloon.render();

        // cycle through all entities and render to canvas
        for (i = 0; i < game.entities.length; i += 1) {
            var collides = collidesBalloon(game.entities[i], game.balloon, game);
            if (collides) {
                window.cancelAnimationFrame(game.animId);
                // 67 balloon.pic.naturalHeight * config.balloon.minIndex (335 * 0.2)
                var statusIndex = ~~(config.animalsNum * game.balloon.h / (game.HEIGHT - config.groundWidth - config.platformHeight - 67));
                statusIndex = Math.min(statusIndex, config.animalsNum - 1);
                window.location = 'result.html?result=' + statusIndex;
            }

            game.entities[i].render();
        }

        // display scores
        Draw.text(game, 'Очки: ' + game.score.hit, 20, 32, 28, config.textColor);
        Draw.text(game, 'Меткость: ' + game.score.accuracy + '%', game.WIDTH - 230, 32, 28, config.textColor);
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
        for (var n = 0; n < 7; n +=1 ) {
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
    },

    restart: function() {
        game.entities = [];
        game.score = {
            taps: 0,
            hit: 0,
            escaped: 0,
            accuracy: 0
        };
        delete game.balloon;
        delete game.pump;
    }
};

module.exports = game;
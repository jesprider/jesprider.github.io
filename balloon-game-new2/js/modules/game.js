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
var Input = require('./input');
var Bubble = require('./bubble');
var Artifact = require('./artifact');
var Balloon = require('./balloon');
var Touch = require('./touch');
var Particle = require('./particle');
var Draw = require('./draw');
var hitBubble = require('./hitBubble');
var hitArtifact = require('./hitArtifact');
var collidesBalloon = require('./collidesBalloon');

var game = {

    // set up some inital values
    WIDTH: 320,
    HEIGHT:  480,
    scale:  1,
    // the position of the canvas
    // in relation to the screen
    offset: {top: 0, left: 0},
    // store all bubble, touches, particles etc
    entities: [],
    // the amount of game ticks until
    // we spawn a bubble
    nextBubble: 100,
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
        game.nextBubble -= 1;
        // if the counter is less than zero
        if (game.nextBubble < 0) {
            // put a new instance of bubble into our entities array
            game.entities.push(new Artifact(game));
            // reset the counter with a random value
            game.nextBubble = ( Math.random() * 100 ) + 100;
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
                            'rgba(255,255,255,'+Math.random()*1+')'
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
        game.wave.time = new Date().getTime() * 0.002;
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

        Draw.rect(game, 0, 0, game.WIDTH, game.HEIGHT, '#9ed8d4');

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
            var collides = collidesBalloon(game.entities[i], game.balloon);
            if (collides) {
                window.cancelAnimationFrame(game.requestId);
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

        game.requestId = requestAnimFrame( game.loop );

        game.update();
        game.render();
    }
};

module.exports = game;
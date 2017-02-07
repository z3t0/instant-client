
var PIXI = require('pixi.js')
var player = require('./player.js')

function Game () {
	var game = {}

	game.players = []
	game.world = null

	game.log = log
	game.newPlayer = newPlayer

	game.connect = connect

	game.init = init
	game.me = null
	game.loop = loop
		// Load Resources
	PIXI.loader
	.add('circle', "res/img/circle.png")
	.on("progress", loadProgressHandler)
	.load(game.init.bind(game))

	return game
}

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the precentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}


function init() {
	var self = this

	//Create the renderer
	var renderer = PIXI.autoDetectRenderer(256, 256);

	//Add the canvas to the HTML document
	document.getElementById("game").appendChild(renderer.view)

	// Autoresize
	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);

	//Create a container object called the `stage`
	var stage = new PIXI.Container();

	this.renderer = renderer
	this.stage = stage
	this.pixi = PIXI

	// keyboard
	//Capture the keyboard arrow keys
	var left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40);

  	//Left arrow key `press` method
	left.press = function() {
		self.me.setVelocityX(-1)
	}

	//Up
	up.press = function() {
		self.me.setVelocityY(-1)
	}

	//Right
	right.press = function() {
		self.me.setVelocityX(1)
	}
	
	//Down
	down.press = function() {
		self.me.setVelocityY(1)
	};

	this.connect()
}

function loop(time) {

	requestAnimationFrame(loop)

	var game = window.game
	game.deltatTime = time - game.lastTime
	game.lastTime = time

	if (time != null) {
		for (var i = 0; i < game.players.length; i++) {
			game.players[i].update(game.deltatTime)
		}

		game.renderer.render(game.stage)
	}


}

function connect() {
		var self = this
		self.client = require('./client.js')({path: "http://localhost:3000"})

		var client = self.client.emitter

		client.on('new_player', function(data) {
			console.log('new player')
			self.players.push(player(data, self))
		})

		client.on('connect', function(data) {
			self.me = player(data, self)
			self.players.push(self.me)
			loop()
		})

		client.on('update', function(world) {
			console.log('received update')
	})
		
	}

function log(msg) {
	console.log("Game > " + msg)
}

function newPlayer(client) {
	log("Created a new player")
	var new_player = player({client: client})
	this.players.push(new_player)

}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}


module.exports = Game

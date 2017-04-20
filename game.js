// client - game.js
var PIXI = require('pixi.js')
var player = require('./player.js')

class Game {
  constructor () {
    this.players = []
    this.world = null

    this.me = null
    // Load Resources
    PIXI.loader
    .add('circle', 'res/img/circle.png')
    .on('progress', loadProgressHandler)
    .load(() => {
      this.init()
    })
  }

  loop (time) {
    requestAnimationFrame((time) => {
      this.loop(time)
    })

    this.deltatTime = time - this.lastTime
    this.lastTime = time

    if (time != null) {
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].update(this.deltatTime)
      }

      this.renderer.render(this.stage)
    }
  }

  connect () {
    this.client = require('./client.js')({path: 'http://localhost:3000'})

    var client = this.client.emitter

    client.on('new_player', (data) => {
      console.log('new player')
      this.players.push(new player(data, this))
    })

    client.on('connect', (data) => {
      this.me = new player(data, this)
      this.players.push(this.me)
      this.loop()
    })

    client.on('update', (data) => {
      let syncedList = []

      for (var i = 0; i < this.players.length; i++) {
        for (var k = 0; i < data.length; k++) {
          // console.log('data' + data.length)
          // console.log('k' + k)
          if (data[k].id === this.players[i].id) {
            this.players[i].sync(data[k])
            // console.log('found')
            break;
          }
        }
      }

    })
  }

  log (msg) {
    console.log('Game > ' + msg)
  }

  newPlayer (client) {
    log('Created a new player')
    var new_player = new player({client: client})
    this.players.push(new_player)
  }

  init () {
  // Create the renderer
    var renderer = PIXI.autoDetectRenderer(256, 256)

  // Add the canvas to the HTML document
    document.getElementById('game').appendChild(renderer.view)

  // Autoresize
    renderer.view.style.position = 'absolute'
    renderer.view.style.display = 'block'
    renderer.autoResize = true
    renderer.resize(window.innerWidth, window.innerHeight)

  // Create a container object called the `stage`
    var stage = new PIXI.Container()

    this.renderer = renderer
    this.stage = stage
    this.pixi = PIXI

  // keyboard
  // Capture the keyboard arrow keys
    var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40)

    // Left arrow key `press` method
    left.press = () => {
      this.me.setVelocityX(-1)
    }

  // Up
    up.press = () => {
      this.me.setVelocityY(-1)
    }

  // Right
    right.press = () => {
      this.me.setVelocityX(1)
    }

  // Down
    down.press = () => {
      this.me.setVelocityY(1)
    }

    this.connect()
  }
}

function loadProgressHandler (loader, resource) {
  // Display the file `url` currently being loaded
  console.log('loading: ' + resource.url)

  // Display the precentage of files currently loaded
  console.log('progress: ' + loader.progress + '%')

  // If you gave your files names as the first argument
  // of the `add` method, you can access them like this
  // console.log("loading: " + resource.name);
}

function keyboard (keyCode) {
  var key = {}
  key.code = keyCode
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined
  // The `downHandler`
  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press()
      key.isDown = true
      key.isUp = false
    }
    event.preventDefault()
  }

  // The `upHandler`
  key.upHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release()
      key.isDown = false
      key.isUp = true
    }
    event.preventDefault()
  }

  // Attach event listeners
  window.addEventListener(
    'keydown', key.downHandler.bind(key), false
    )
  window.addEventListener(
    'keyup', key.upHandler.bind(key), false
    )
  return key
}

module.exports = Game

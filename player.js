var PIXI = require('pixi.js')

class Player {
  constructor (data, game) {
    this.id = data.id
    this.isMe = data.isMe

    this.speed = data.speed
    this.color = data.color

    this.sprite = new PIXI.Sprite(PIXI.loader.resources.circle.texture)
    this.sprite.x = data.x
    this.sprite.x = data.y
    this.sprite.scale.x = data.sizeX
    this.sprite.scale.y = data.sizeY
    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
    this.sprite.tint = data.color

    game.stage.addChild(this.sprite)

    this.game = game
  }

  update (deltaTime) {
    if (deltaTime) {
      var sprite = this.sprite
      const speed = 0.05
      deltaTime = deltaTime / 1000
      sprite.x += sprite.vx * this.speed * deltaTime
      sprite.y += sprite.vy * this.speed * deltaTime
    }
  }

  sync (data){

    if (data.x < 0)

      this.sprite.x -= Math.abs(data.x - this.sprite.x) / 3

    else {

      this.sprite.x += Math.abs(data.x - this.sprite.x) / 3
    }

    if (data.y < 0)
      this.sprite.y -= Math.abs(data.y - this.sprite.y) / 3
    else {
      this.sprite.y += Math.abs(data.y - this.sprite.y) / 3
    }
  }

  setVelocityY (vy) {
    var sprite = this.sprite
    sprite.vy = vy
  }

  setVelocityX (vx) {
    var sprite = this.sprite
    sprite.vx = vx
  }
}

module.exports = Player

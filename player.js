var PIXI = require('pixi.js')


function Player(data, game) {

	var player = {} 
    player.id = data.id
    player.isMe = data.isMe

    player.speed = data.speed
    player.color = data.color

    player.sprite = new PIXI.Sprite(PIXI.loader.resources.circle.texture)
    player.sprite.x = data.x
    player.sprite.x = data.y
    player.sprite.scale.x = data.sizeX
    player.sprite.scale.y = data.sizeY
    player.sprite.vx = data.vx
    player.sprite.vy = data.vy
    player.sprite.tint = data.color

    game.stage.addChild(player.sprite)

    player.game = game
    player.update = update
    player.setVelocityX = setVelocityX
    player.setVelocityY = setVelocityY

	return player
}

function update(deltaTime) {

    if (deltaTime) {
        var sprite = this.sprite
        sprite.x += sprite.vx * this.speed * deltaTime
        sprite.y += sprite.vy * this.speed * deltaTime

    }

}

function setVelocityY(vy) {
    
    var sprite = this.sprite
    sprite.vy = vy
}

function setVelocityX(vx) {
    
    var sprite = this.sprite
    sprite.vx = vx
}

module.exports = Player

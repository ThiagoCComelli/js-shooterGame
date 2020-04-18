document.addEventListener("keydown",function(e){
    keys[e.keyCode] = true
})
document.addEventListener("keyup",function(e){
    delete keys[e.keyCode]
})
document.addEventListener("mousemove",function(e){
    MOUSEX = e.clientX
    MOUSEY = e.clientY
})
document.addEventListener("mousedown",function(e){
    keys[3737] = true
})
document.addEventListener("mouseup",function(e){
    delete keys[3737]
})

var canv = document.getElementById("canvasGame")
var ctx = canv.getContext("2d")
var keys = {}
var bullets = []
var player
var enemy
var MOUSEX
var MOUSEY
var angle
var FPS = 60
var VELOCITY = 5
var BULLET_SPEED = 10


function setup(){
    player = new Player()
    enemy = new Enemy()
}

function move(){
    if(37 in keys){
        player.move(-VELOCITY,0)
    } if (39 in keys){
        player.move(VELOCITY,0)
    } if (38 in keys){
        player.move(0,-VELOCITY)
    } if (40 in keys){
        player.move(0,VELOCITY)
    } if (3737 in keys){
        player.shoot()
    }
}

function draw(){
    angle = Math.atan2(MOUSEY-player.getPos.y,MOUSEX-player.getPos.x) 

    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)

    move()
    
    enemy.draw()
    player.draw()

    for(let i = 0; i < bullets.length; i++){
        bullets[i].draw()
        // console.log(bullets[i].position.x)
        let bullet = bullets[i]
        if(bullet.position.x > canv.width || bullet.position.y > canv.height){
            bullets.splice(i,1)
        }
    }

}

setup()
setInterval(draw,1000/FPS)
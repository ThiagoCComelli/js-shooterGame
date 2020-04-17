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
document.addEventListener("click",function(e){
    player.shoot()
})

var canv = document.getElementById("canvasGame")
var ctx = canv.getContext("2d")
var keys = {}
var bullets = []
var player
var MOUSEX
var MOUSEY
var FPS = 60
var VELOCITY = 5
var BULLET_SPEED = 10
var angle


function setup(){
    player = new Player()
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
    }
}

function draw(){
    angle = Math.atan2(MOUSEY-player.getY,MOUSEX-player.getX) 

    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)

    move()
    
    player.draw()

    for(let i = 0; i < bullets.length; i++){
        bullets[i].draw()
        let bullet = bullets[i]
        if(bullet.position.x > canv.width || bullet.position.y > canv.height){
            bullets.splice(i,1)
        }
    }
    console.log(bullets.length)
}

setup()
setInterval(draw,1000/FPS)
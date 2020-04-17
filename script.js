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

var canv = document.getElementById("canvasGame")
var ctx = canv.getContext("2d")
var keys = {}
var player
var MOUSEX = 0
var MOUSEY = 0
var FPS = 60
var VELOCITY = 5

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
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)

    move()
    player.draw()

}

setup()
setInterval(draw,1000/FPS)
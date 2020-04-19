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
var canvStats = document.getElementById("canvasStats")
var ctxStats = canvStats.getContext("2d")
var canvShop = document.getElementById("canvasShop")
var ctxShop = canvShop.getContext("2d")
var keys = {}
var bullets = []
var enemys = []
var player = new Player("Thiago Comelli")
var enemy
var MOUSEX
var MOUSEY
var angle
var FPS
var VELOCITY
var BULLET_SPEED
var BULLET_DAMAGE
var WEAPON_COOLDOWN
var ENEMY_LIFE
var PLAYER_LIFE
var gameState


function setup(){
    canv = document.getElementById("canvasGame")
    ctx = canv.getContext("2d")
    canvStats = document.getElementById("canvasStats")
    ctxStats = canvStats.getContext("2d")
    canvShop = document.getElementById("canvasShop")
    ctxShop = canvShop.getContext("2d")
    enemys = []
    FPS = 60
    VELOCITY = 5
    BULLET_SPEED = 20
    BULLET_DAMAGE = 10
    WEAPON_COOLDOWN = 0
    ENEMY_LIFE = 100
    PLAYER_LIFE = 100
    gameState = true

    player = new Player("Thiago Comelli")

    spawnEnemys()
}

function spawnEnemys(){
    for(let i = 0;i<10;i++){
        enemys.push(new Enemy(ENEMY_LIFE))
    }
}

function move(){
    if(gameState == true){
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
}

function drawShop(){
    ctxShop.fillStyle = "rgb(175, 175, 175)"
    ctxShop.fillRect(0,0,canvShop.width,canvShop.height)

    ctxShop.fillStyle = "black"
    ctxShop.font = "bold 30px Arial"
    ctxShop.fillText("SHOP",canvShop.width/2-40,30)
    ctxShop.font = "bold 17px Arial"
    ctxShop.fillText("Damage:",10,88)
    ctxShop.fillText("Player Speed:",10,130)
    ctxShop.fillText("Bullet Speed:",10,170)
    ctxShop.fillText("Cooldown:",10,210)

    ctxShop.beginPath()
    ctxShop.moveTo(0,240)
    ctxShop.lineTo(200,240)
    ctxShop.lineWidth = 2
    ctxShop.stroke()

}

function drawStats(){
    ctxStats.fillStyle = "rgb(175, 175, 175)"
    ctxStats.fillRect(0,0,canvStats.width,canvStats.height)

    ctxStats.fillStyle = "black"
    ctxStats.font = "bold 30px Arial"
    ctxStats.fillText("STATS",canvStats.width/2-40,30)
    ctxStats.fillText("Name: "+player.nome,10,70)
    ctxStats.fillText("Money: "+(player.money).toFixed(2),10,100)
    ctxStats.fillText("Kill count: "+player.kills,10,130)
    ctxStats.fillText("Bullet Speed: "+BULLET_SPEED,10,160)
    ctxStats.fillText("Bullet Damage: "+BULLET_DAMAGE,10,190)
    ctxStats.fillText("Player Life: "+player.life+"/100",canvStats.width/2,70)
    ctxStats.fillText("Player Speed: "+VELOCITY,canvStats.width/2,100)
    ctxStats.fillText("Player Level: "+player.level,canvStats.width/2,130)
    ctxStats.fillText("Enemys alive: "+enemys.length,canvStats.width/2,160)
    ctxStats.fillText("Weapon cooldown: "+player.weapon.cooldownWeaponReady,canvStats.width/2,190)
}

function drawGame(){
    ctx.fillStyle = "rgb(150, 214, 108)"
    ctx.fillRect(0,0,canv.width,canv.height)

    if (gameState == true){
        angle = Math.atan2(MOUSEY-player.getPos.y,MOUSEX-player.getPos.x) 

        move()
        
        for(let i of enemys){
            i.draw()
        }
        player.draw()

        for(let i = 0; i < bullets.length; i++){
            bullets[i].draw()
            let bullet = bullets[i]
            if(bullet.bulletXY.x > canv.width || bullet.bulletXY.x < 0 || bullet.bulletXY.y > canv.height || bullet.bulletXY.y < 0){
                bullets.splice(i,1)
            } else {
                for(let j = 0; j < enemys.length; j++){
                    let condition = enemys[j].checkCollisionBullet(bullet.bulletXY.x,bullet.bulletXY.y,bullet,enemys[j])

                    if (condition.hit) {
                            bullets.splice(i,1)
                            if(condition.kill){
                                enemys.splice(j,1)
                            }
                        }
                }
            }
        }
        for(let i of enemys){
            i.checkCollisionPlayer(i)
        }
        if(enemys.length == 0){
            spawnEnemys()
        }
        if(player.life <= 0){
            gameState = false
        }
        drawStats()
        drawShop()
    } else {
        ctx.fillStyle = "black"
        ctx.font = "100px Arial"
        ctx.fillText("GAME OVER",100,canv.height/2)
    }
}

setup()
setInterval(drawGame,1000/FPS)
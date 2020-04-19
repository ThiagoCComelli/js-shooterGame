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
var token = new Token()
var song = new Sound()
var gameState
var soundState
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

function setup(){
    canv = document.getElementById("canvasGame")
    ctx = canv.getContext("2d")
    canvStats = document.getElementById("canvasStats")
    ctxStats = canvStats.getContext("2d")
    canvShop = document.getElementById("canvasShop")
    ctxShop = canvShop.getContext("2d")
    enemys = []
    FPS = 60
    VELOCITY = 2
    BULLET_SPEED = 5
    BULLET_DAMAGE = 10
    WEAPON_COOLDOWN = 60
    ENEMY_LIFE = 100
    PLAYER_LIFE = 100
    gameState = true
    soundState = true

    player = new Player("Thiago Comelli")
    token = new Token()

    spawnEnemys()
}

function spawnEnemys(){
    for(let i = 0;i<10;i++){
        enemys.push(new Enemy(ENEMY_LIFE))
    }
}

function buyShop(type){
    player.useToken(type)
}

function changeSong(type){
    song.changeSelector(type)
}

function changeSound(type){
    if(type == "on"){
        soundState = true
    } else {
        soundState = false
    }
}

function move(){
    if(gameState == true){
        if(37 in keys){
            player.move(-player.velocity,0)
        } if (39 in keys){
            player.move(player.velocity,0)
        } if (38 in keys){
            player.move(0,-player.velocity)
        } if (40 in keys){
            player.move(0,player.velocity)
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
    ctxShop.font = "normal 15px Arial"
    ctxShop.fillText("Your tokens: "+player.tokens,10,58)
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

    ctxShop.font = "bold 30px Arial"
    ctxShop.fillText("TOKEN",canvShop.width/2-50,270)
    ctxShop.font = "normal 15px Arial"
    ctxShop.fillText("Each token (price): "+(token.price).toFixed(2),10,305)
    ctxShop.font = "bold 17px Arial"
    ctxShop.fillText("Token:",10,342)

    ctxShop.beginPath()
    ctxShop.moveTo(0,372)
    ctxShop.lineTo(200,372)
    ctxShop.lineWidth = 2
    ctxShop.stroke()

    ctxShop.font = "bold 30px Arial"
    ctxShop.fillText("CONFIG",canvShop.width/2-55,402)
    ctxShop.font = "bold 17px Arial"
    ctxShop.fillText("Music:           "+((song.musicSelector)+1)+"/"+song.musicSounds.length,10,450)
    ctxShop.fillText("Music: ",10,490)
    ctxShop.fillText("Sounds: ",10,530)

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
    ctxStats.fillText("Bullet Speed: "+(player.weapon.weaponBulletSpeed).toFixed(2),10,160)
    ctxStats.fillText("Bullet Damage: "+(player.weapon.weaponDamage).toFixed(2),10,190)
    ctxStats.fillText("Player Life: "+player.life+"/100",canvStats.width/2,70)
    ctxStats.fillText("Player Speed: "+(player.velocity).toFixed(2),canvStats.width/2,100)
    ctxStats.fillText("Player Level: "+player.level,canvStats.width/2,130)
    ctxStats.fillText("Enemys alive: "+enemys.length,canvStats.width/2,160)
    ctxStats.fillText("Weapon cooldown: "+(player.weapon.weaponFirerate).toFixed(2),canvStats.width/2,190)
}

function drawGame(){
    ctx.fillStyle = "rgb(150, 214, 108)"
    ctx.fillRect(0,0,canv.width,canv.height)

    if (gameState == true){
        angle = Math.atan2(MOUSEY-player.position.y,MOUSEX-player.position.x) 

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
            ENEMY_LIFE *= 1.3
            spawnEnemys()
            player.level++
            
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
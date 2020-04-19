
class Player{
    constructor(nome){
        this.nome = nome
        this.position = {x:canv.width/2,y:canv.height/2}
        this.r = 20
        this.life = 100
        this.money = 10000
        this.kills = 0
        this.level = 0
        this.tokens = 0
        this.weapon = new Weapon()
        this.healthbar = null
        this.velocity = VELOCITY
        this.sound = new Sound()
    }

    move(valX,valY){
        let condition = false

        this.position.x += valX
        this.position.y += valY

        if(this.position.x < 0){
            this.position.x = 0
        } else if (this.position.x > canv.width){
            this.position.x = canv.width
        } else if(this.position.y < 0){
            this.position.y = 0
        } else if (this.position.y > canv.height){
            this.position.y = canv.height
        } else {
            condition = true
        }
        
        if(this.healthbar != null && condition){
            this.healthbar.move(valX,valY)
        }
    }

    shoot(){
        this.weapon.shoot()
    }

    useToken(type){
        if(type == "token"){
            token.buy()
        } else if(player.tokens > 0){
            if(type == "damage"){
                this.weapon.weaponDamage *= 1.05
            } else if(type == "pSpeed"){
                this.velocity *= 1.005
            } else if(type == "bSpeed"){
                this.weapon.weaponBulletSpeed *= 1.005
            } else if(type == "cooldown"){
                this.weapon.weaponFirerate *= .985
            }
            this.tokens--
            this.sound.tokenSound()
        }
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.r,0,Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()

        this.weapon.draw()

        if(this.healthbar != null){
            this.healthbar.draw()
        }
    }
}


class Weapon{
    constructor(){
        this.width = 50
        this.height = 10
        this.cooldownWeapon = 0
        this.weaponFirerate = WEAPON_COOLDOWN
        this.weaponDamage = BULLET_DAMAGE
        this.weaponBulletSpeed = BULLET_SPEED
        this.sound = new Sound()
    }

    shoot(){
        this.cooldownWeapon++
        if (this.cooldownWeapon >= this.weaponFirerate){
            bullets.push(new Bullet(this.weaponDamage,this.weaponBulletSpeed))
            this.cooldownWeapon = 0
            this.sound.bulletSound()
        }
    }

    draw(){
        ctx.save()
        ctx.translate(player.position.x,player.position.y)
        ctx.rotate(angle)
        ctx.fillStyle = "red"
        ctx.fillRect(0,-this.height/2,this.width,this.height)
        ctx.restore()
    }
}

class Bullet{
    constructor(damage,speed){
        this.position = {x:0,y:0}
        this.r = 5
        this.angleL = Math.atan2(MOUSEY-player.position.y,MOUSEX-player.position.x)
        this.translateX = player.position.x
        this.translateY = player.position.y
        this.damage = damage
        this.speed = speed
    }
    
    get bulletXY(){
        let dx = canv.width-(canv.width-this.position.x)
        let dy = canv.height-(canv.height-this.position.y)
        let length = Math.sqrt(dx*dx+dy*dy)
        let bulletAngle = Math.atan2(dy,dx)
        let screenX = this.translateX+length*Math.cos(bulletAngle+this.angleL)
        let screenY = this.translateY+length*Math.sin(bulletAngle+this.angleL)
        return {x:screenX,y:screenY}
    }

    draw(){
        this.damage *= .99

        ctx.save()
        ctx.translate(this.translateX,this.translateY)
        ctx.rotate(this.angleL)
        ctx.beginPath()
        ctx.arc(this.position.x+50,this.position.y,this.r*=.99,0,Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.restore()

        this.position.x += this.speed
    }
}

class Enemy{
    constructor(life){
        this.life = life
        this.position = {x:Math.floor(Math.random() * canv.width) + 0,y:Math.floor(Math.random() * canv.height) + 0}
        this.r = 20
        this.damage = 1.5
        this.translateX = canv.width/2
        this.translateY = canv.height/2
        this.healthbar = new HealthBar(this.position.x-(this.r*1.25),this.position.y+this.r+5,false)
    }

    checkCollisionBullet(bulletX,bulletY,bullet_,enemy_){
        if((Math.sqrt(Math.pow(bulletX-this.position.x,2) + Math.pow(bulletY-this.position.y,2))) <= this.r+bullet_.r){
            this.life -= bullet_.damage
            if(this.life <= 0){
                player.money += (Math.random() * 0.7 + 0.3)
                player.kills++
                return {hit:true,kill:true}
            }
            let size = (enemy_.healthbar.sizeBar.w*this.life-bullet_.damage)/ENEMY_LIFE
            enemy_.healthbar.sizeLifeBar.w = size

            return {hit:true,kill:false}
        } else {
            return {hit:false,kill:false}
        }
    }

    checkCollisionPlayer(enemy_){
        if((Math.sqrt(Math.pow(this.position.x-player.position.x,2) + Math.pow(this.position.y-player.position.y,2))) <= this.r*2){
            if(player.healthbar == null){
                player.healthbar = new HealthBar(player.position.x-(player.r*1.25),player.position.y+player.r+5,true)
            } 
            player.life -= this.damage
            let size = (player.healthbar.sizeBar.w*player.life-enemy_.damage)/PLAYER_LIFE
            player.healthbar.sizeLifeBar.w = size

            return {hit:true}
        } else {
            return {hit:false}
        }
        
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.r,0,Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()

        if(this.life < ENEMY_LIFE){
            this.healthbar.draw()
        }
    }
}

class HealthBar{
    constructor(x,y,player){
        this.position = {x:x,y:y}
        this.sizeBar = {w:50,h:10}
        this.sizeLifeBar = {w:50,h:10}
        this.playerVerify = player
    }

    move(x,y){
        if(this.playerVerify){
            this.position.x += x
            this.position.y += y
        }
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x,this.position.y,this.sizeBar.w,this.sizeBar.h)
        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.fillRect(this.position.x,this.position.y,this.sizeLifeBar.w,this.sizeLifeBar.h)
        ctx.fill()
    }
}

class Token{
    constructor(){
        this.price = 10
        this.sound = new Sound()
    }

    buy(){
        if(player.money >= this.price){
            player.money -= this.price
            player.tokens++
            this.price *= 1.2
            this.sound.tokenSound()
            return true
        } else {
            return false
        }
    }
}

class Sound{
    constructor(){
        this.bulletSounds = ["./sounds/laser1.wav","./sounds/laser4.wav","./sounds/laser5.wav","./sounds/laser7.wav"]
        this.tokenSounds = ["./sounds/token.ogg"]
        this.musicSounds = ["./sounds/soundtrack0.mp3","./sounds/soundtrack1.mp3","./sounds/soundtrack2.mp3","./sounds/soundtrack3.mp3","./sounds/soundtrack4.mp3","./sounds/soundtrack5.mp3"]
        this.sound = null
        this.musicSelector = 0
    }

    changeSelector(type){
        if(type == "-"){
            if(this.musicSelector == 0){
                this.musicSelector = this.musicSounds.length-1
            } else {
                this.musicSelector--
            }
            song.musicSound()
        } else if(type == "+"){
            if(this.musicSelector == this.musicSounds.length-1){
                this.musicSelector = 0
            } else {
                this.musicSelector++
            }
            song.musicSound()
        } else if(type == "off"){
            if(this.sound != null){
                this.sound.pause()
                this.sound = null
            }
        } else {
            if(this.sound == null){
                this.sound = new Audio(this.musicSounds[this.musicSelector])
                this.sound.loop = true
                this.sound.play()
            }
        }
    }

    tokenSound(){
        if(soundState){
            this.sound = new Audio(this.tokenSounds[0])
            this.sound.play()
        }
    }

    bulletSound(){
        if(soundState){
            this.sound = new Audio(this.bulletSounds[(Math.floor(Math.random() * 4) + 0)])
            this.sound.play()
        }
    }

    musicSound(){
        if(this.sound != null){
            this.sound.pause()
            this.sound = new Audio(this.musicSounds[this.musicSelector])
            this.sound.loop = true
            this.sound.play()
        }
    }
}


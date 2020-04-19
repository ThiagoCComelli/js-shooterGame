
class Player{
    constructor(nome){
        this.nome = nome
        this.x = canv.width/2
        this.y = canv.height/2
        this.r = 20
        this.life = 100
        this.money = 0
        this.kills = 0
        this.level = 0
        this.weapon = new Weapon()
        this.healthbar = null
    }

    get getPos(){
        return {x:this.x,y:this.y}
    }

    get getCooldown(){
        return this.cooldown
    }

    addMoney(money_){
        this.money += money_
    }

    move(valX,valY){
        this.x += valX
        this.y += valY

        this.x = this.x < 0 ? this.x = 0 : this.x
        this.x = this.x > canv.width ? this.x = canv.width : this.x

        this.y = this.y < 0 ? this.y = 0 : this.y
        this.y = this.y > canv.height ? this.y = canv.height : this.y
        
        if(this.healthbar != null){
            this.healthbar.move(valX,valY)
        }
    }

    shoot(){
        this.weapon.shoot()
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
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
        this.cooldownWeaponReady = WEAPON_COOLDOWN
    }

    shoot(){
        this.cooldownWeapon++
        if (this.cooldownWeapon >= this.cooldownWeaponReady){
            bullets.push(new Bullet(player.getPos.x,player.getPos.y))
            this.cooldownWeapon = 0
        }
    }

    draw(){
        ctx.save()
        ctx.translate(player.getPos.x,player.getPos.y)
        ctx.rotate(angle)
        ctx.fillStyle = "red"
        ctx.fillRect(0,-this.height/2,this.width,this.height)
        ctx.restore()
    }
}

class Bullet{
    constructor(){
        this.x = 0
        this.y = 0
        this.r = 5
        this.angleL = Math.atan2(MOUSEY-player.getPos.y,MOUSEX-player.getPos.x)
        this.translateX = player.getPos.x
        this.translateY = player.getPos.y
        this.damage = BULLET_DAMAGE
    }

    get position(){
        return {x: this.x, y:this.y}
    }

    get getStats(){
        return this.r
    }
    
    get bulletXY(){
        let dx = canv.width-(canv.width-this.x)
        let dy = canv.height-(canv.height-this.y)
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
        ctx.arc(this.x+50,this.y,this.r*=.99,0,Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.restore()

        this.x += BULLET_SPEED
    }
}

class Enemy{
    constructor(life){
        this.life = life
        this.x = Math.floor(Math.random() * canv.width) + 0 
        this.y = Math.floor(Math.random() * canv.height) + 0
        this.r = 20
        this.damage = 1.5
        this.translateX = canv.width/2
        this.translateY = canv.height/2
        this.healthbar = new HealthBar(this.x-(this.r*1.25),this.y+this.r+5,false)
    }

    checkCollisionBullet(bulletX,bulletY,bullet_,enemy_){
        if((Math.sqrt(Math.pow(bulletX-this.x,2) + Math.pow(bulletY-this.y,2))) <= this.r+bullet_.r){
            this.life -= bullet_.damage
            if(this.life <= 0){
                player.addMoney(Math.random() * 0.7 + 0.3)
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
        if((Math.sqrt(Math.pow(this.x-player.x,2) + Math.pow(this.y-player.y,2))) <= this.r*2){
            if(player.healthbar == null){
                player.healthbar = new HealthBar(player.x-(player.r*1.25),player.y+player.r+5,true)
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
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
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
class Player{
    constructor(){
        this.x = canv.width/2
        this.y = canv.height/2
        this.r = 20
        this.weapon = new Weapon()
    }

    get getPos(){
        return {x:this.x,y:this.y}
    }

    get getCooldown(){
        return this.cooldown
    }

    move(valX,valY){
        this.x += valX
        this.y += valY

        this.x = this.x < 0 ? this.x = 0 : this.x
        this.x = this.x > canv.width ? this.x = canv.width : this.x

        this.y = this.y < 0 ? this.y = 0 : this.y
        this.y = this.y > canv.height ? this.y = canv.height : this.y
        
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
    }
}


class Weapon{
    constructor(){
        this.width = 50
        this.height = 10
        this.cooldownWeapon = 0
        this.cooldownWeaponReady = 10
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
        this.damage = 10
    }

    get position(){
        return {x: this.x, y:this.y}
    }

    get getDamage(){
        return this.damage
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

// class Enemy{
//     constructor(){
//         this.x = Math.floor(Math.random() * canv.width) + 0 
//         this.y = Math.floor(Math.random() * canv.height) + 0
//         this.r = 20
//         this.translateX = canv.width/2
//         this.translateY = canv.height/2
//     }

//     draw(){
//         ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
//         ctx.fillStyle = "black"
//         ctx.fill()
//     }
// }
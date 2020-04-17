class Player{
    constructor(){
        this.x = canv.width/2
        this.y = canv.height/2
        this.r = 20
        this.weapon = new Weapon()
    }

    get getX(){
        return this.x
    }

    get getY(){
        return this.y
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
    }

    shoot(){
        bullets.push(new Bullet(player.getX,player.getY))
    }

    draw(){
        ctx.save()
        ctx.translate(player.getX,player.getY)
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
        this.angleL = Math.atan2(MOUSEY-player.getY,MOUSEX-player.getX)
        this.translateX = player.getX
        this.translateY = player.getY
    }

    get position(){
        return {x: this.x, y:this.y}
    }

    draw(){
        ctx.save()
        ctx.translate(this.translateX,this.translateY)
        ctx.rotate(this.angleL)
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.restore()

        this.x += BULLET_SPEED
    }
}
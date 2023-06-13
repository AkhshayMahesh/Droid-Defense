let myreq, s, p, b, SLife, BLife, hits, grids, temp, hitb, bots, f, f1, f2, f3, f4, t, time, mouse, B, Bb, u, score, best, paused, gname, rank, h

let inner = document.getElementById("inner")
let c = inner.getContext("2d")
let outer = document.getElementById("outer")
let c1 = outer.getContext("2d")

outer.width = innerWidth
outer.height = innerHeight
inner.width = innerWidth * 0.835
inner.height = innerHeight * 0.81
inner.style.left = `${0.0825 * innerWidth}px`
inner.style.top = `${0.15 * innerHeight}px`
let inner1 = getComputedStyle(inner)

window.onresize = () => {
    inner.width = innerWidth * 0.835
    inner.height = innerHeight * 0.81
    inner.style.left = `${0.085 * innerWidth}px`
    bots = [new ShootBot()]
    s = new Shooter()
    p = new Pointer()
}

window.onload = () => {
    document.getElementById("over").close()
    document.getElementById("intro").showModal()
}

class Shooter {
    constructor() {
        this.position = {
            x: inner.width / 2,
            y: inner.height - 20
        }
        this.speed = {
            x: 0,
            y: 0
        }
        this.radius = 20
    }

    draw() {
        c.beginPath()
        c.fillStyle = "cyan"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        if (this.position.x - this.radius + this.speed.x > 0 && this.position.x + this.radius + this.speed.x < inner.width) {
            this.position.x += this.speed.x
        } else {
            this.speed.x = 0
        }
        if (this.position.y - this.radius + this.speed.y > 0 && this.position.y + this.radius + this.speed.y < inner.height) {
            this.position.y += this.speed.y
        } else {
            this.speed.y = 0
        }

        this.draw()
    }
}

class Pointer {
    constructor() {
        this.position = {
            x: inner.width / 2,
            y: inner.height - 47
        }
        this.speed = {
            x: 0,
            y: 0
        }
        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.fillStyle = "white"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        this.radians = Math.atan((mouse.y - s.position.y) / (mouse.x - s.position.x))

        if ((mouse.x - s.position.x) < 0) {
            this.radians += Math.PI
        }

        this.position.x = Math.cos(this.radians) * (s.radius + 7) + s.position.x
        this.position.y = Math.sin(this.radians) * (s.radius + 7) + s.position.y

        this.draw()
    }
}

class Base {
    constructor() {
        this.position = {
            x: inner.width / 2,
            y: inner.height * 0.75
        }
        this.radius = 50
        this.flag = false
        this.elife = 6
        this.eradius = 55
    }

    draw() {
        if (this.flag) {
            c.beginPath()
            c.arc(this.position.x, this.position.y, this.eradius, 0, 2 * Math.PI)
            c.strokeStyle = "yellow"
            c.stroke()
        }
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = "#BD00FF"
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 20;
        c.shadowColor = 'rgba(255,255,255,0.7)'
        c.fill()
    }

    update() {
        if (this.elife < 1) {
            this.flag = false
            this.elife = 6
        }
        this.position = {
            x: inner.width / 2,
            y: inner.height * 0.75
        }
        this.draw()
    }
}

class StaticBot {
    constructor({ position }) {
        this.size = 20
        this.position = { ...position }
    }

    draw() {
        c.beginPath()
        c.fillStyle = "#FF007A"
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 20;
        c.shadowColor = 'rgba(255,255,255,0.7)'
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update({ velocity }) {
        this.position.x += velocity.x
        this.position.y += velocity.y
        this.draw()
    }
}

class ShootBot {
    constructor() {
        this.velocity = 0.5
        this.radius = 20
        this.width = 15
        this.length = 35
        this.position = { x: randRange(this.radius, inner.width - this.radius), y: randRange(this.radius, inner.height - b.position.y - 20) }
        this.direction = Math.atan((this.position.y - b.position.y) / (this.position.x - b.position.x))
        if ((this.position.x - b.position.x) >= 0) {
            this.direction += Math.PI
        }
        this.count = 0
    }

    draw() {
        c.shadowColor = "transparent"
        c.fillStyle = "brown"
        c.beginPath()
        c.fillRect(this.position.x, this.position.y - this.width / 2, this.length, this.width)
        c.fillStyle = "black"
        c.shadowColor = "red"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        if (this.count % 447 == 0) {
            hitb.push(new EBullet({ position: this.position }))
        }
        this.count++
        this.direction = Math.atan((this.position.y - b.position.y) / (this.position.x - b.position.x))
        if ((this.position.x - b.position.x) >= 0) {
            this.direction += Math.PI
        }
        if (this.position.x + this.radius > inner.width || this.position.x - this.radius < 0) this.velocity = -this.velocity
        this.position.x += this.velocity
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.direction)
        c.translate(-this.position.x, -this.position.y)
        this.draw()
        c.restore()
    }
}

class EBullet {
    constructor({ position }) {
        this.position = { ...position }
        this.velocity = 7
        this.direction = Math.atan((this.position.y - b.position.y) / (this.position.x - b.position.x))
        if ((this.position.x - b.position.x) >= 0) {
            this.direction += Math.PI
        }
        this.radius = 4
    }

    draw() {
        c.shadowColor = "transparent"
        c.beginPath()
        c.fillStyle = "yellow"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        this.position.x += Math.cos(this.direction) * this.velocity
        this.position.y += Math.sin(this.direction) * this.velocity
        this.draw()
    }
}

class Grid {
    constructor() {
        this.speed = { x: 5, y: 0 }
        this.StaticBots = []
        let row = randRange(2, 4)
        let col = randRange(2, 4)
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                this.StaticBots.push(new StaticBot({
                    position: {
                        x: i * 30,
                        y: j * 30
                    }
                }))
            }
        }
        this.length = row * 30 - 20
        this.position = { x: 0, y: 0 }
    }

    update() {
        this.position.x += this.speed.x
        this.position.y += this.speed.y

        this.speed.y = 0
        if (this.position.x + this.length > inner.width || this.position.x + 10 < 0) {
            this.speed.x = -this.speed.x
            this.speed.y = 25
        }
    }
}

class SBullet {
    constructor() {
        this.position = {
            x: p.position.x,
            y: p.position.y
        }
        this.velocity = 12
        this.direction = Math.atan((mouse.y - s.position.y) / (mouse.x - s.position.x))
        if ((mouse.x - s.position.x) < 0) {
            this.direction += Math.PI
        }
        this.radius = 3
    }

    draw() {
        c.shadowColor = "transparent"
        c.beginPath()
        c.fillStyle = "white"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        if (isCollide1(this, b) && !isCollide1(p, b)) {
            if ((mouse.x - s.position.x) <= 0) this.direction -= Math.PI / 2
            else this.direction += Math.PI / 2
        }
        this.position.x += Math.cos(this.direction) * this.velocity
        this.position.y += Math.sin(this.direction) * this.velocity
        this.draw()
    }
}

class BBullet {
    constructor() {
        this.position = {
            x: B.position.x,
            y: B.position.y
        }
        this.velocity = 14
        this.direction = Math.atan((-this.position.y + s.position.y) / (-this.position.x + s.position.x))
        if ((-this.position.x + s.position.x) <= 0) {
            this.direction += Math.PI
        }
        this.radius = 10
    }

    draw() {
        c.shadowColor = "transparent"
        c.beginPath()
        c.fillStyle = "yellow"
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
    }

    update() {
        this.position.x += Math.cos(this.direction) * this.velocity
        this.position.y += Math.sin(this.direction) * this.velocity
        this.draw()
    }
}

class BossBot {
    constructor() {
        this.velocity = 2
        this.radius = 37
        this.width = 20
        this.length = 55
        this.position = { x: randRange(this.radius, inner.width - this.radius), y: randRange(this.radius, inner.height - b.position.y - this.radius) }
        this.direction = Math.atan((this.position.y - b.position.y) / (this.position.x - b.position.x))
        if ((this.position.x - b.position.x) >= 0) {
            this.direction += Math.PI
        }
        this.count = 0
        this.moveAngle = 0
        this.rx = this.position.x
        this.ry = this.position.y
        this.life = 10
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.direction)
        c.translate(-this.position.x, -this.position.y)
        c.shadowColor = "transparent"
        c.beginPath()
        c.fillStyle = "#DDD"
        c.fillRect(this.position.x, this.position.y - this.width - 4, this.length, this.width)
        c.fillStyle = "#DDD"
        c.fillRect(this.position.x, this.position.y + 4, this.length, this.width)
        c.fillStyle = "#666"
        c.shadowColor = "grey"
        c.shadowBlur = 10
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        c.fill()
        c.restore()
        c.beginPath()
        c.fillStyle = "white"
        c.roundRect(this.position.x - 5 - this.radius, this.position.y - this.radius - 9, 2 * this.radius + 10, 6, 3)
        c.fill()
        c.beginPath()
        c.fillStyle = "red"
        c.roundRect(this.position.x - 4 - this.radius, this.position.y - this.radius - 8, (2 * this.radius + 8) * (this.life / 10), 4, 2)
        c.fill()

    }

    update() {
        this.direction = Math.atan((this.position.y - p.position.y) / (this.position.x - p.position.x))
        if ((this.position.x - p.position.x) >= 0) {
            this.direction += Math.PI
        }
        if ((Math.abs(this.position.x - this.rx) > 1) && (Math.abs(this.position.y - this.ry) > 1)) {
            this.position.x -= this.velocity * Math.cos(this.moveAngle)
            this.position.y -= this.velocity * Math.sin(this.moveAngle)
        }
        this.draw()
    }

    move() {
        this.rx = randRange(this.radius, inner.width - this.radius)
        this.ry = randRange(this.radius, inner.height - this.radius - b.position.y)
        this.moveAngle = Math.atan((this.ry - this.position.y) / (this.rx - this.position.x))
        if ((this.rx - this.position.x) >= 0) {
            this.moveAngle += Math.PI
        }
    }
}

class Homing {
    constructor({ position }) {
        this.size = 20
        this.position = { ...position }
        this.direction = Math.atan((this.position.y - s.position.y) / (this.position.x - s.position.x))
        if ((this.position.x - s.position.x) >= 0) this.direction += Math.PI
        this.velocity = 2
    }

    draw() {
        c.beginPath()
        c.fillStyle = "orange"
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 20;
        c.shadowColor = 'red'
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update() {
        this.direction = Math.atan((this.position.y - s.position.y) / (this.position.x - s.position.x))
        if ((this.position.x - s.position.x) >= 0) this.direction += Math.PI
        this.position.x += this.velocity * Math.cos(this.direction)
        this.position.y += this.velocity * Math.sin(this.direction)
        this.draw()
    }
}

class Powerups {
    constructor() {
        this.position = {
            x: randRange(50, inner.width - 50),
            y: randRange(50, inner.height - 20)
        }
        this.radius = 4
        this.rvelocity = 0.1
    }

    draw() {
        c.beginPath()
        c.fillStyle = "white"
        c.shadowColor = "yellow"
        c.shadowBlur = 8
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fill()
    }

    update() {
        if (this.radius < 3 || this.radius > 9) {
            this.rvelocity = -this.rvelocity
        }
        this.radius += this.rvelocity
        this.draw()
    }
}

function randRange(x, y) {
    let max, min
    (x > y) ? (max = x, min = y) : (max = y, min = x)
    return Math.floor(Math.random() * (max - min) + min)
}

function isCollide1(circle1, circle2) {
    return (Math.sqrt(Math.pow(circle1.position.x - circle2.position.x, 2) + Math.pow(circle1.position.y - circle2.position.y, 2)) < circle1.radius + circle2.radius)
}

function isCollide2(circle, rect) {
    return (circle.position.x > (rect.position.x - circle.radius) && circle.position.x < (rect.position.x + rect.size + circle.radius) && circle.position.y > (rect.position.y - circle.radius) && circle.position.y < rect.position.y + rect.size + circle.radius)
}

function initGame() {
    gname = document.getElementById("name").value
    if (gname != "") {
        document.getElementById("intro").close()
        c.fillStyle = 'rgba(0,0,0,0.65)'
        c.fillRect(0, 0, innerWidth, innerHeight)
        s = new Shooter()
        s.draw()
        p = new Pointer()
        p.draw()
        b = new Base()
        b.draw()
        grids = []
        hits = []
        hitb = []
        bots = []
        f = f4 = t = score = paused = 0
        SLife = BLife = 10
        f2 = f3 = f1 = 1
        mouse = { x: 0, y: 0 }

        rank = JSON.parse(localStorage.getItem("rank"))
        if(rank != null) best = rank[0].Score
        else if(rank == null) {
            localStorage.setItem("rank", JSON.stringify([]))
            rank = []
            best = 0
        }

        myreq = requestAnimationFrame(animate)
    }
    else if (gname == "") {
        document.getElementById("name").classList.add("error")
    }
}

function animate() {
    myreq = requestAnimationFrame(animate)
    game()
}

function game() {
    c.beginPath()
    c.shadowColor = "transparent"
    c.clearRect(0, 0, inner.width, inner.height)
    c.fillStyle = 'rgba(0,0,0,0.65)'
    c.fillRect(0, 0, innerWidth, innerHeight)
    c1.clearRect(0, 0, outer.width, outer.height)
    c1.beginPath()
    c1.fillStyle = 'white'
    c1.font = `${0.0225 * innerWidth}px other`
    c1.fillText(`SCORE: ${score}`, 0.0825 * innerWidth, 0.0525 * innerWidth)
    c1.font = `${0.0375 * innerWidth}px title`
    c1.fillText("Droid Defense", 0.35 * innerWidth, 0.0525 * innerWidth)
    c1.font = `${0.0225 * innerWidth}px other`
    c1.fillText(`BEST: ${best}`, 0.81 * innerWidth, 0.0525 * innerWidth)
    c1.roundRect(0.5 * parseInt(inner1.left) - (0.025 * innerWidth) / 2, 0.325 * innerHeight, 0.025 * innerWidth, inner.height * 0.79, (0.025 * innerWidth) / 2)
    c1.fill()
    c1.roundRect(inner.width + 1.5 * parseInt(inner1.left) - (0.025 * innerWidth) / 2, 0.325 * innerHeight, 0.025 * innerWidth, inner.height * 0.79, (0.025 * innerWidth) / 2)
    c1.fill()
    c1.beginPath()
    c1.fillStyle = "#00FFF0"
    c1.roundRect(0.5 * parseInt(inner1.left) - (0.018 * innerWidth) / 2, 0.335 * innerHeight, 0.018 * innerWidth, inner.height * 0.77 * (SLife / 10), (0.018 * innerWidth) / 2)
    c1.fill()
    c1.beginPath()
    c1.roundRect(inner.width + 1.5 * parseInt(inner1.left) - (0.018 * innerWidth) / 2, 0.335 * innerHeight, 0.018 * innerWidth, inner.height * 0.77 * (BLife / 10), (0.018 * innerWidth) / 2)
    c1.fillStyle = "#BD00FF"
    c1.fill()

    b.update()
    s.update()
    p.update()

    if (h) h.update()
    if (Bb) Bb.update()
    if (B) B.update()
    if (u) u.update()

    hits.forEach((bullet, i) => {
        bullet.update()
        if (B && isCollide1(bullet, B)) {
            score += 5
            if (B.life > 0) {
                B.life--
            } else {
                B = ""
            }
            hits.splice(i, 1)
        }
        else if (Bb && isCollide1(bullet, Bb)) {
            score += 3
            Bb = ""
            hits.splice(i, 1)
        }
        else if (h && isCollide2(bullet, h)) {
            score += 3
            h = ""
            hits.splice(i, 1)
        }
    })

    grids.forEach((grid, k) => {
        grid.update()
        if (grid.StaticBots.length == 0) {
            grids.splice(k, 1)
        }

        grid.StaticBots.forEach((staticBot, i) => {
            staticBot.update({ velocity: grid.speed })
            if (isCollide2(b, staticBot)) {
                if (b.flag) {
                    b.elife--
                } else {
                    BLife--
                }
                grid.StaticBots.splice(i, 1)
            }
            if (isCollide2(s, staticBot)) {
                SLife--
                grid.StaticBots.splice(i, 1)
            }
            if (staticBot.position.y > inner.height) {
                setTimeout(() => {
                    grid.StaticBots.splice(i, 1)
                }, 0)
            }

            hits.forEach((bullet, j) => {
                if (bullet.position.y - bullet.radius > inner.height || bullet.position.x + bullet.radius > inner.width || bullet.position.x - bullet.radius < 0 || bullet.position.y - bullet.radius < 0) {
                    hits.splice(j, 1)
                }
                if (isCollide2(bullet, staticBot)) {
                    setTimeout(() => {
                        grid.StaticBots.splice(i, 1)
                        hits.splice(j, 1)
                        score += 2
                    }, 0)
                }
            })
        })
    })

    hitb.forEach((ebullet, j) => {
        if (isCollide1(ebullet, s)) {
            SLife--
            hitb.splice(j, 1)
        } else if (isCollide1(ebullet, b)) {
            if (b.flag) {
                b.elife--
            } else {
                BLife--
            }
            hitb.splice(j, 1)
        }
        for (let k = 0; k < hits.length; k++) {
            if (isCollide1(ebullet, hits[k])) {
                hitb.splice(j, 1)
                hits.splice(k, 1)
                score += 1
            }
        }
        ebullet.update()
    })

    bots.forEach((bot, i) => {
        hits.forEach((bullet, k) => {
            if (isCollide1(bullet, bot)) {
                bots.splice(i, 1)
                hits.splice(k, 1)
                score += 3
            }
        })
        bot.update()
    })

    if (u && isCollide1(u, s)) {
        u = ""
        b.flag = true
    }

    if (Bb && isCollide1(Bb, b)) {
        if (b.flag) {
            b.elife--
        } else {
            BLife--
        }
        Bb = ""
    }
    if (Bb && isCollide1(s, Bb)) {
        SLife--
        Bb = ""
    }

    if (h && isCollide2(b, h)) {
        if (b.flag) {
            b.elife--
        } else {
            BLife--
        }
        h = ""
    }
    if (h && isCollide2(s, h)) {
        SLife--
        h = ""
    }

    if (!B && f2 % 1845 == 0) {
        B = new BossBot()
        B.draw()
    }

    if (f3 % 3007 == 0) {
        u = new Powerups()
        u.draw()
    }

    if (f++ % 1800 == 0 || grids.length < 1) {
        grids.push(new Grid())
        f = 1
    }

    if (score>15 && f1++ % 500 == 0) {
        bots.push(new ShootBot())
    }

    if (f2++ % 80 == 0 && B) {
        B.move()
    }

    if (f3++ % 293 == 0 && B) {
        Bb = new BBullet()
    }

    if (score > best) {
        best = score
        localStorage.setItem("high", best)
    }

    if (!h && B) {
        f4++
        if (f4 % 179 == 0) h = new Homing({ position: B.position })
    }

    if (SLife <= 0 || BLife <= 0) {
        cancelAnimationFrame(myreq)
        rank.push({
            Name: gname,
            Score: score
        })
        rank.sort(function (a, d) {
            return d.Score - a.Score
        })
        var len = (rank.length < 3) ? rank.length : 3
        for (let i = 0; i < len; i++) {
            let panel = document.createElement("div")
            if (i == 0) panel.innerHTML = `🥇 ${rank[i].Name} <div>${rank[i].Score}</div>`
            else if (i == 1) panel.innerHTML = `🥈 ${rank[i].Name}  <div>${rank[i].Score}</div>`
            else if (i == 2) panel.innerHTML = `🥉 ${rank[i].Name}  <div>${rank[i].Score}</div>`
            document.getElementById("lb").appendChild(panel)
        }
        for (i = 3; i < rank.length; i++) rank.splice(i, 1)
        localStorage.setItem("rank", JSON.stringify(rank))
        document.getElementById("over").showModal()
    }
}

function pause(e) {
    if (e.key == "Escape") {
        if (paused == 0) {
            cancelAnimationFrame(myreq)
            paused = 1
            c1.beginPath()
            c1.fillStyle = "rgba(0,0,0,0.5)"
            c1.fillRect(0, 0, outer.width, outer.height)
        }
        else if (paused == 1) {
            myreq = requestAnimationFrame(animate)
            paused = 0
        }
    }
}

function mouseMove(e) {
    mouse.x = e.x - parseInt(inner1.left)
    mouse.y = e.y - parseInt(inner1.top)
}

function shooterMove(e) {
    if (e.key == "a") s.speed.x = -6
    else if (e.key == "d") s.speed.x = 6
    else if (e.key == "w") s.speed.y = -6
    else if (e.key == "s") s.speed.y = 6
}

function shooterStop(e) {
    s.speed.x = 0
    s.speed.y = 0
}

inner.addEventListener("mousemove", mouseMove)
window.addEventListener("keyup", pause)
window.addEventListener("keydown", shooterMove)
window.addEventListener("keyup", shooterStop)
inner.addEventListener("mousedown", ({ buttons }) => {
    // time = new Date()
    // if (buttons == 1 && (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - t > 0.1) {
    if (buttons == 1)
        hits.push(new SBullet())
    //     t = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()
    // }
})

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Player {

    constructor() {
        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        this.direction = "Right";
        this.speed = 40;
        this.position = new Vector2D(100, 100);
    }

    keyDownHandler(event) {
        switch(event.key) {
            case "ArrowLeft":
                this.direction = "Left";
                break;
            case "ArrowRight":
                this.direction = "Rgiht";
                break;
            case "ArrowUp":
                this.direction = "Up";
                break;
            case "ArrowDown":
                this.direction = "Down";
                break;
        }
    }

    process(delta) {
        switch(this.direction) {
            case "Left":
                this.position.x -= this.speed*delta;
                break;
            case "Right":
                this.position.x += this.speed*delta;
                break;
            case "Up":
                this.position.y -= this.speed*delta;
                break;
            case "Down":
                this.position.y += this.speed*delta;
                break;
        }

        if (this.position.x < 20) this.position.x = 20;
        if (this.position.x > 580) this.position.x = 580;
        if (this.position.y < 20) this.position.y = 20;
        if (this.position.y > 380) this.position.y = 380;
    }

    render(ctx) {
        const time = Math.floor(Date.now()/1000);
        ctx.fillStyle = '#fcdf03';
        ctx.beginPath();
        ctx.moveTo(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20);
        if(time%2) {
            switch(this.direction) {
                case "Up":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -0.25*Math.PI, 1.25*Math.PI);
                    break;
                case "Down":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0.75*Math.PI, 0.25*Math.PI);
                    break;
                case "Left":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 1.25*Math.PI, 0.75*Math.PI);
                    break
                case "Right":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0.25*Math.PI, -0.25*Math.PI);
                    break;
            }
        } else {
            switch(this.direction) {
                case "Up":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -0.5*Math.PI, 1.5*Math.PI);
                    break;
                case "Down":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -1.5*Math.PI, 0.5*Math.PI);
                    break;
                case "Left":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 1*Math.PI, -1*Math.PI);
                    break
                case "Right":
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0*Math.PI, 2*Math.PI);
                    break;
            }
        }
        ctx.lineTo(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20);
        ctx.fill();
        ctx.stroke();
    }
}

class Chip {
    constructor(x, y) {
        this.position = new Vector2D(x,y);
    }

    render(ctx) {
        ctx.fillStyle = '#fcdf03';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0*Math.PI, 2*Math.PI);
        ctx.fill();
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.objects = [];
        this.lastTimestamp = 0;
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    process(delta) {
        for(let obj of this.objects) {
            obj.process(delta);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let obj of this.objects) {
            obj.render(this.ctx);
        }
    }

    run() {
        const newTimestamp = Date.now();
        let delta = 0;
        if (this.lastTimestamp) {
            delta = newTimestamp - this.lastTimestamp;
        }
        this.lastTimestamp = newTimestamp;
        try{this.process(delta/1000)} catch(e) {};
        try{this.render()} catch(e) {};
        window.requestAnimationFrame(this.run.bind(this));
    }
}

const game = new Game(document.getElementById("game"));
game.addObject(new Player());
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
        game.addObject(new Chip(i*40+20, j*40+20));
    }
}
game.run();
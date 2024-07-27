interface Vector2D {
    x: number;
    y: number;
}


class GameObject {
    process(delta: number) {}
    render(ctx: CanvasRenderingContext2D) {}
}

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

class Player extends GameObject {

    private direction: Direction;
    private speed: number;
    private position: Vector2D;

    constructor() {
        super();
        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        this.direction = Direction.RIGHT;
        this.speed = 40;
        this.position = { x: 100, y: 100 };
    }

    keyDownHandler(event: KeyboardEvent) {
        switch(event.key) {
            case "ArrowLeft":
                this.direction = Direction.LEFT;
                break;
            case "ArrowRight":
                this.direction = Direction.RIGHT;
                break;
            case "ArrowUp":
                this.direction = Direction.UP;
                break;
            case "ArrowDown":
                this.direction = Direction.DOWN;
                break;
        }
    }

    process(delta:number) {
        switch(this.direction) {
            case Direction.LEFT:
                this.position.x -= this.speed*delta;
                break;
            case Direction.RIGHT:
                this.position.x += this.speed*delta;
                break;
            case Direction.UP:
                this.position.y -= this.speed*delta;
                break;
            case Direction.DOWN:
                this.position.y += this.speed*delta;
                break;
        }

        if (this.position.x < 20) this.position.x = 20;
        if (this.position.x > 580) this.position.x = 580;
        if (this.position.y < 20) this.position.y = 20;
        if (this.position.y > 380) this.position.y = 380;
    }

    render(ctx: CanvasRenderingContext2D) {
        const time = Math.floor(Date.now()/1000);
        ctx.fillStyle = '#fcdf03';
        ctx.beginPath();
        ctx.moveTo(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20);
        if(time%2) {
            switch(this.direction) {
                case Direction.UP:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -0.25*Math.PI, 1.25*Math.PI);
                    break;
                case Direction.DOWN:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0.75*Math.PI, 0.25*Math.PI);
                    break;
                case Direction.LEFT:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 1.25*Math.PI, 0.75*Math.PI);
                    break
                case Direction.RIGHT:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0.25*Math.PI, -0.25*Math.PI);
                    break;
            }
        } else {
            switch(this.direction) {
                case Direction.UP:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -0.5*Math.PI, 1.5*Math.PI);
                    break;
                case Direction.DOWN:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, -1.5*Math.PI, 0.5*Math.PI);
                    break;
                case Direction.LEFT:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 1*Math.PI, -1*Math.PI);
                    break
                case Direction.RIGHT:
                    ctx.arc(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20, 16, 0*Math.PI, 2*Math.PI);
                    break;
            }
        }
        ctx.lineTo(Math.floor(this.position.x/40)*40 + 20, Math.floor(this.position.y/40)*40 + 20);
        ctx.fill();
        ctx.stroke();
    }
}

class Chip extends GameObject {

    private position: Vector2D;

    constructor(x: number, y:number) {
        super();
        this.position ={ x, y };
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#fcdf03';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0*Math.PI, 2*Math.PI);
        ctx.fill();
    }
}

class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTimestamp: number;
    private objects: GameObject[];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = this.canvas.getContext("2d")!;
        this.ctx = ctx;
        this.objects = [];
        this.lastTimestamp = 0;
    }

    addObject(obj: GameObject) {
        this.objects.push(obj);
    }

    process(delta: number) {
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

const game = new Game(document.getElementById("game")! as HTMLCanvasElement);
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
        game.addObject(new Chip(i*40+20, j*40+20));
    }
}
game.addObject(new Player());
game.run();
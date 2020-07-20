export class Timeline {
    constructor() {
        this.animations = [];
        this.requestID = null;
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime;
            let animations = this.animations.filter(animation => !animation.finished);
            for (let animation of animations) {
    
                let { object, property, start, end, timingFunction, duration, delay, template, startTime } = animation;
    
                let progression = timingFunction((t - delay - startTime) / duration); // 百分比 0-1之间的数
                if (t > duration + delay + startTime) {
                    progression = 1;
                    animation.finished = true;
                }
    
                let value = animation.valueFromProgression(progression);
    
                object[property] = template(value);
            }
            if (animations.length)
                this.requestID = requestAnimationFrame(this.tick);
        }
    }
    pause() {
        if (this.state !== "playing")
            return ;
        this.state = "paused";
        this.puaseTime = Date.now();
        if (this.requestID !== null)
            cancelAnimationFrame(this.requestID);
    }
    resume() {
        if (this.state !== "paused")
            return ;
        this.state = "playing";
        this.startTime += Date.now() - this.puaseTime;
        this.tick();
    }
    start() {
        if (this.state !== "inited")
            return ;
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }
    restart() {
        if (this.state === "playing") {
            this.pause();
        }
        this.animations = [];
        this.requestID = null;
        this.state = "inited";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }
    add(animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state === "playing")
            animation.startTime = startTime !== (void 0) ? startTime : Date.now() - this.startTime;
        else 
            animation.startTime = startTime !== (void 0) ? startTime : 0;
    }
}

export class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.template = template;
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}


export class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a),
        }
    }
}

/*

let animation = new Animation(object, property, start, end, duration, delay, timingFunction);
let animation2 = new Animation(object2, property2, start, end, duration, delay, timingFunction);


let timeline = new Timeline();

timeline.add(animation);
timeline.add(animation2);

timeline.start();
timeline.pause();
timeline.resume();
timeline.stop();

setTimeout();
setInterval();
requestAnimationFrame();


*/
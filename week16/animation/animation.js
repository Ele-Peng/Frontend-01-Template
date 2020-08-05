export class Timeline {
    constructor() {
      this.animations = new Set();
      this.finishedAnimations = new Set();
      this.id = null;
      this.addTimes = new Map();
      this.state = 'init';
    }
  
    tick() {
      let t = Date.now() - this.startTime;
      for (let animation of this.animations) {
        let {
          object,
          property,
          duration,
          delay,
          template,
          timingFunction,
        } = animation;

        const addTime = this.addTimes.get(animation);

        let progression = timingFunction((t - delay - addTime) / duration)
        if (t < delay + addTime) {
          continue;
        }
        if (t > duration + delay + addTime) {
          t = duration + delay;
          progression = 1;
          this.finishedAnimations.add(animation)
          this.animations.delete(animation)
        }
        const val = animation.valueFromProgression(progression)
        object[property] = template(val)
      }
      if (this.animations.size) {
        this.id = requestAnimationFrame(() => this.tick())
      } else {
        this.id = null;
      }
    }
    start() {
      if (this.state !== 'init') {
        return;
      }
      this.state = 'playing';
      this.startTime = Date.now();
      this.tick();
    }
    
    pause() {
      if (this.state !== 'playing') {
        return;
      }
      this.state = 'paused';
      if (this.id !== null) {
        cancelAnimationFrame(this.id)
        this.id = null;
        this.pauseTime = Date.now();
      }
    }
    resume() {
      if (this.state !== 'paused') {
        return;
      }
      this.state = 'playing';
      this.startTime += Date.now() - this.pauseTime;
      this.tick();
    }
  
    reStart() {
      if (this.state !== 'playing') {
        this.pause();
      }
      for (let animation of this.finishedAnimations) {
        this.animations.add(animation)
      }
      this.id = null;
      this.finishedAnimations = new Set();
      this.startTime = Date.now();
      this.pauseTime = null;
      this.state = 'playing';
      this.tick();
    }
  
    add(animation, addTime) {
      if (this.state === 'playing') {
        this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime);
      } else if(this.state === 'init'){
        this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
      } else {
        this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.pauseTime);
      }
      
      this.animations.add(animation);
      if (this.state === 'playing' && this.id === null) {
        this.tick();
      }
    }
  
    reset(){
      if (this.state !== 'playing') {
        this.pause();
      }
      this.id = null;
      this.animations = new Set();
      this.finishedAnimations = new Set();
      this.addTimes = new Map();
      this.startTime = Date.now();
      this.pauseTime = null;
      this.state = 'init';
    }
  }
  
  export class Animation {
    constructor({object, property, template, start, end, duration, delay, timingFunction}) {
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
    constructor({object, property, template, start, end, duration, delay, timingFunction}) {
      this.object = object;
      this.template = template || (v => `rgba(${v.r},${v.g},${v.b},${v.a || 1})`);
      this.property = property;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.delay = delay || 0;
      this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
      return ({
        r: this.start.r + progression * (this.end.r - this.start.r),
        g: this.start.g + progression * (this.end.g - this.start.g),
        b: this.start.b + progression * (this.end.b - this.start.b),
        a: this.start.a + progression * (this.end.a - this.start.a),
      })
    }
  }
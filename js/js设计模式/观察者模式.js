/* 定义对象间的一种一对多的依赖关系，
当一个对象的状态发生改变时，
所有依赖于它的对象都将得到通知.
解决了主体对象与观察者之间功能的耦合，
即一个对象状态改变给其他对象通知的问题。 */


class Subject {
    constructor () {
      this.state = 0;
      this.observers = [];
    }
    getState () {
      return this.state;
    }
    setState (state) {
      this.state = state;
      this.notify();
    }
    notify () {
      this.observers.forEach(observer => {
        observer.update();
      })
    }
    attach (observer) {
      this.observers.push(observer);
    }
}
  
  
class Observer {
    constructor (name, subject) {
        this.name = name;
        this.subject = subject;
        this.subject.attach(this);
    }
    update () {
        console.log(`${this.name} update, state: ${this.subject.getState()}`);
    }
}
  
let sub = new Subject();
let observer1 = new Observer('o1', sub);
let observer2 = new Observer('o2', sub);
sub.setState(1)
  
const [count, setCount] = useState(6)
const intervalCb = useRef(null)
useEffect(() => {
    intervalCb.current = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }
}, [count])

useEffect(() => {
    function itvFn() {
        intervalCb.current()
    }
    let CountTimer = window.setInterval(itvFn, 1000)
    return () => window.clearInterval(CountTimer)
}, [])

for (var i = 1; i <= 5; i++) {
    (function(i){
        setTimeout( function timer() {
  
            console.log(i);
      
        }, 1000 );
    })(i)
  }

  (function(){
    var x=y=1
  })()
  console.log(x)
  console.log(y)

  let foo = {}
  let obj = {}
  foo[obj]='hello'
  console.log(foo)

  Array.__proto__
  
  var a = {
    name : "Cherry",
    fn : function (a,b) {
     console.log( a + b)
    }
   }
   var b = a.fn;
   b.bind(a,1,2)() 

   for(var i=0; i<2; i++){
       setTimeout(() => {
           console.log(i)
       },0)
   }
   Promise.resolve().then(() => console.log(3))
   (() => console.log(4))()

   var F = function() {}
   Object.prototype.a = function(){console.log('object')}
   Function.prototype.b = function(){console.log('function')}  
  var f = new F()
  try{f.a()} catch(e){console.log('faerror')} //faerror
  try{f.b()} catch(e){console.log('fberror')} // function
  try{F.a()} catch(e){console.log('Faerror')} // object
  try{F.b()} catch(e){console.log('Fberror')} // function

  var obj1 = {
      name:'obj1',
      sayName:function sayName(){
          console.log(this.name)
      }
  }
  name = 'name'
  var obj2 = {name:'obj2'}
  var obj3 = {
      name: 'obj3',
      sayName:function(){
          (function(){
             console.log(this.name)
          })()
      }
  }

  var obj4 = {
    name:'obj4',
    sayName:() => {
        console.log(this.name)
    }
}
obj1.sayName() // obj1
obj3.sayName() // undef
obj4.sayName() // name

obj1.sayName.call(obj2) // obj2
obj3.sayName.call(obj2) // un
obj4.sayName.call(obj2) // name
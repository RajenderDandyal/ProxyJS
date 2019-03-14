let bears = {grizzly: true};

let grizzlyCount = 0;

bears = new Proxy(bears, {
  get: (target, prop, receiver) => {

    if (prop === 'grizzly') grizzlyCount++;
    // both return works
    // return Reflect.get(target, prop, receiver)
    // return Reflect.get(...arguments);
    return target[prop]
  },
  set: (target, prop, value) => {
    if (["grizzly", "polar", "brown"].indexOf(prop) === -1) {
      throw new Error("Bear category is invalid")
    } else {
      return Reflect.set(target, prop, value)
      //return target[prop] = value;
    }
  },
  deleteProperty: (target, prop) => {
    console.log(`You have deleted ${prop}`);
    delete target[prop]
  }
});
/*bears.grizzly
bears.grizzly
bears.grizzly*/
//bears.polar = true;
//bears.brown = true;
//delete bears.brown;
//bears.bhalluu = true;

//console.log(bears);
//console.log(grizzlyCount);


// proxying a function

function Name(fn, ln) {
  this.firstName = fn;
  this.lastName = ln;
  this.fullName = this.firstName + " " + this.lastName;
  return this.fullName;
}

const loudName = new Proxy(Name, {
  apply: (target, thisArg, argArray) => {
    return target(...argArray).toUpperCase() + "!!!";
  }
});

/*
console.log((new Name('rajender', "dindyal")).firstName);
console.log((new loudName('rajender', "dindyal")).firstName);
console.log(loudName('rajender', 'dindyal'));
*/


// computed properties

const person = {
  first: "Rajender",
  last: "Dindyal"
};
const cleverPerson = new Proxy(person, {
  get: function (target, prop) {
    if (!(prop in target)) {
      return prop.split('_').map(item => target[item]).join(" ")
    }
    return target[prop]
  }
});
//console.log(cleverPerson.first_last);


// proxy index for array of objects

const Bears = [
  {id: 1, name: "polar"},
  {id: 2, name: "black"},
  {id: 3, name: "brown"},
  {id: 4, name: "grizzly"}
];
/*
let index = [];
creating index on Array
let index = new Array([1,2,3,4])*/
const index = {}
const indexedArray = new Proxy(Array, {
  construct: (target, argsList, newTarget) => {
    console.log(argsList)
    argsList.forEach(item => {
      index[item.id] = item;
    });
    //bcoz constructor is first method that runs

    //so we will return new array here with Proxy to catch push method on that
    const newArray = new target(...argsList);
    //const newArray = newTarget(...argsList);
    //return newArray
    return new Proxy(newArray, {
      get: (target, prop) => {
        if (prop === 'push') {
          return function (item) {
            console.log(item)
            index[item.id] = item;
            //return Reflect.get(target,item)
            return target[prop].call(target, item)
          }
        } else Reflect.get(target,prop)
      }
    })

  },
  get: (target, prop, receiver) => {
    if (prop === "push") {
      console.log("push")
    }

  }
})

let indArr = new indexedArray(...Bears);
console.log(indArr)
indArr.push({id: 6, name: "bhalluu"});
console.log(indArr);
//console.log(index);

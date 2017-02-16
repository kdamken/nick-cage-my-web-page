// Show how assigning a function to a variable works

// Declare object
var myO = {}

// Assign the functions we declared later to it. We can do this because they're function declarations, not expressions, so they get hoisted like any other variable
myO.test = stuff;
myO.me = things();

// Declare our functions
function stuff() {
    console.log('hiding');
}

function things() {
    return "to me";
}


function foo() {
    if(false) {
        function x() {return "butts"};
    }
    return x;
}
console.log(foo());


function foo() {
    if(false) {
        function x() {return "butts"};
    }
    return x();
}
console.log(foo());

//Function Declaration
function add(a,b) {return a + b};
//Function Expression
var add2 = function(a,b) {return a + b};



var obj = {};
obj.meth = function(){
    console.log('stuff');
    return "things";
}














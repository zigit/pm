'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('law.json');
let law = JSON.parse(rawdata);

var cmdArgs = process.argv.slice(2);
// let sepLaw = cmdArgs[0].split('#', 2);

var re = /([0-9]+:[0-9]+)#?K?([0-9]*)P?([0-9]*)S?([0-9]*)(.*)/;
var str = cmdArgs[0];
var myArray = str.match(re);
console.log(myArray);

let finalStr = law[myArray[1]] 
if (myArray[2] != '') {
	finalStr = finalStr + ", Kapitel " + myArray[2];
}
if (myArray[3] != '') {
	finalStr = finalStr + ", Paragraf " + myArray[3];
}
if (myArray[4] != '') {
	finalStr = finalStr + ", Stycke " + myArray[4];
}
console.log(finalStr)  

//console.log(law[sepLaw[0]]);
//console.log(sepLaw[1]);

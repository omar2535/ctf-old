var fs = require("fs");
const https = require('https');
const axios = require('axios');
var cities = fs.readFileSync("./cities.json");
var cities = JSON.parse(cities);

var datasend;
var message = 'vancouver';
message = message.toLowerCase();

function brailConverter(message){
  message = message.toLowerCase();
  // will need cities[i].name

  // paris: 1234010123502402340 = 12340-p 10-a 12350-r 240-i 2340-s
  // paris: 1234010123502402340
  // zurich: 135601360123502401401250
  // bangalore: 120101345012450101230135012350150
  var blindvalues = [
    "10", //a
    "120", //b
    "140", //b
    "1450", //d
    "150", //e
    "1240", //f
    "12450", //g
    "1250", //h
    "240", //i
    "2450", //j
    "130", //k
    "1230", //l
    "1340", //m
    "13450", //n
    "1350", //o
    "12340", //p
    "123450", //q
    "12350", //r
    "2340", //s
    "23450", //t
    "1360", //u
    "12360", //v
    "24560", //w
    "13460", //x
    "134560", //y
    "13560" //z
  ];

  var blindmap = new Map();
  var i;
  var message_new = "";

  // 26 blind values
  for (i = 0; i < blindvalues.length; i++) {
    blindmap[i + 97] = blindvalues[i];
  }

  for (i = 0; i < message.length; i++) {
    message_new += blindmap[message[i].charCodeAt(0)];
  }
  return message_new
}

// datasend = JSON.stringify({
//   message: message_new
// });


// for(var i=0; i<cities.length; i++){
//   const data = JSON.stringify({
//     message: brailConverter(cities[i].name)
//   })
//   axios.post('https://bnv.web.ctfcompetition.com/api/search', {
//     message: brailConverter(cities[i].name)
//   })
//   .then((res) => {
//     console.log(`statusCode: ${res.statusCode}`)
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
// }

for(var i=0; i<2; i++){
  axios.post('https://bnv.web.ctfcompetition.com/api/search', {
    message: String(brailConverter(cities[i].name))
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    //console.log(`statusCode: ${res.statusCode}`)
    //if(res.data.ValueSearch != 'No result found'){
      console.log(res.data)
      console.log(cities[i].name)
    //}
  })
  .catch((error) => {
    console.error(error)
  })
}

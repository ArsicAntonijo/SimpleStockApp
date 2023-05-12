// A stock server
//
// Example usage:
//
//   node server.js
const net = require('net');
const { send } = require('process');
var clients = [];
var stockValues = genereateInitialStockValues();

const server = net.createServer((socket) => {
  console.log('Connection from', socket.remoteAddress, 'port', socket.remotePort);
  var client = {
    active: 0,
    choise: "",
    socket: socket
  }
  clients.push(client);

  socket.on('data', (buffer) => {
    console.log('Request from', socket.remoteAddress, 'port', socket.remotePort, 'mess', buffer.toString('utf-8'));

    for (let j = 0; j < clients.length; j++) {
      if(clients[j] === undefined) continue;

      if(clients[j].socket == socket){
        clients[j].active = 2;
        clients[j].choise = buffer;
      }
    }
   // let  mess = "{ \"id\": 2, \"text\": \"Hello " + socket.remotePort+"\" }";
   // socket.write(mess);
  });

  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });

  socket.on('error', (err) => {
    // delete user here form global user array
    console.log('ERROR', err);

    for (let j = 0; j < clients.length; j++) {
      if(clients[j] === undefined) continue;

      if(clients[j].socket == socket){
        clients[j].active = -1;
      }
    }
  });
  const myTimeout = setInterval(sendMessage, 5000, stockValues);
});

server.maxConnections = 20;
server.listen(59898);

function sendMessage(stockValues) {  
  stockValues = genereateNewStockValues(stockValues);
  //console.log(arr[0]);

  console.log(clients.length);
  for (let j = 0; j < clients.length; j++) {
    if(clients[j] === undefined) continue;
    
    if(clients[j].active == 0) {
      let helloMessage = "{ \"id\": 2, \"text\": \"Dobro dosli, izaberite koje kompanije hocete da pratite!\", \"stocks\":  [] }";
      clients[j].socket.write(helloMessage);
      clients[j].active = 1;
    } else if(clients[j].active > 1) {

      const choiseIDs = clients[j].choise.toString().split(',');
      var arr = "[ ";

      for(var i = 0; i < choiseIDs.length; i++){
        var id = choiseIDs[i].trim();
        arr += "{ \"stock\": \"" + stockValues[id - 1].stock + "\", \"value\": " + stockValues[id - 1].value + "}";

        if(i < choiseIDs.length - 1) arr += ", ";
      }
      arr += "]";
      //console.log(arr);

      let mess = "{ \"id\": 2, \"text\": \"Saljem informacije za + " + clients[j].choise + "\", \"stocks\":  " + arr + "}";
      clients[j].socket.write(mess);
      console.log(j, " | Message sent to socket ", clients[j].socket.remotePort);
    }    
  }
}

function genereateInitialStockValues(){
  // add random values
  var arr = [
    {stock: "Apple", value: 20},
    {stock: "Microsoft", value: 20},
    {stock: "Google", value: 20},
    {stock: "Amazon", value: 20},
    {stock: "Tesla", value: 20},
    {stock: "Facebook", value: 20},
    {stock: "Nvidia", value: 20},
    {stock: "Adobe", value: 20},
    {stock: "Mastercard", value: 20},
    {stock: "Netflix", value: 20}
  ];
  return arr;
}

function genereateNewStockValues(stockValues){
  // add random values
  for(var i = 0; i < stockValues.length; i++){
    var rnd = getRndInteger(-10, 10);
    stockValues[i].value += rnd;
  }
  
  return stockValues;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

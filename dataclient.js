// A client for the stocks server.
//
// Example usage:
//
//   node dateclient.js 127.0.0.1

const net = require('net');
const readline = require('readline');
var i = 0;
var oldRecord = [];

const client = new net.Socket();
client.connect({ port: 59898, host: process.argv[2] });
client.on('data', (data) => {
  const obj = JSON.parse(data);
 

  if(i == 0){
    console.log(welcomeMessage());

    const rl = readline.createInterface({ input: process.stdin });
    rl.on('line', (line) => {
      var input = line.trim();

      input = input.replace(' ', '');
      if(input[input.length - 1] == ','){
        input = input.slice(0, input.length - 1);
      }

      client.write(input);
      rl.close();
    });
    i++;
  } else {
    oldRecord = writeTableWithStocks(obj, oldRecord);
  }
});

function welcomeMessage(){
  var mess = "Dobro dosli, izaberite koje kompanije hocete da pratite! \n";
  mess += "Za Apple izaberite: 1 \n";
  mess += "Za Microsoft izaberite: 2 \n";
  mess += "Za Google izaberite: 3 \n";
  mess += "Za Amazon izaberite: 4 \n";
  mess += "Za Tesla izaberite: 5 \n";
  mess += "Za Facebook izaberite: 6 \n";
  mess += "Za Nvidia izaberite: 7 \n";
  mess += "Za Adobe izaberite: 8 \n";
  mess += "Za Mastercard izaberite: 9 \n";
  mess += "Za Netflix izaberite: 10 \n";
  mess += "Izaberite broj kompanije u formatu: 1,2,3"

  return mess;
}

function writeTableWithStocks(obj, oldRecord){
  const arr = obj.stocks;

  const d = new Date();
  var date = d.getDate() + "."+ d.getMonth() + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  
  //var percentValues = getPecents(oldRecord);
  if(oldRecord.length == 0){
    for(var i = 0; i < obj.stocks.length; i++){
      oldRecord.push(obj.stocks[i].value.toString());
    }
  }

  console.log("\n\n\n\n", date);
  for(var i = 0; i < obj.stocks.length; i++){
    var percent = getPercent(oldRecord[i], obj.stocks[i].value);
    oldRecord[i] = obj.stocks[i].value;

    console.log("----------------------------------------------------------");
    console.log("| ", obj.stocks[i].stock.toString('utf-8'), " | ", obj.stocks[i].value.toString(), " | ", percent[0], percent[1], " |");
    
  }
  console.log("----------------------------------------------------------");

  return oldRecord;
}

function getPercent(oldValue, newValue){
  var sign = ' ';
  if(oldValue < newValue){
    sign = '↑';
  } 
  if(oldRecord > newValue){
    sign = '↓';
  }
  var percent =  Math.abs(newValue - oldValue);

  var output = [percent, sign];
  return output;
}
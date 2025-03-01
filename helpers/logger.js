const fs = require('fs');

let date = new Date();
//let filename = `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`

 const getCurrentDate = () => {
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${year}${month}${date}`;
  }
  let filename = 'Logs/' + getCurrentDate() + '.txt';



const logData = (data) =>{
    let stream = fs.createWriteStream(filename, {flags:'a'});
    let eventTime = new Date().toISOString().replace('T', ' ').split('.')[0];
    stream.write( eventTime + ': ' + data + "\n \n");
stream.end();
}

module.exports = {logData}
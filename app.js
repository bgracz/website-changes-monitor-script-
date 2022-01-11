const MD5 = require("crypto-js/md5");
const rp = require('request-promise');
var nodemailer = require('nodemailer');

const url = 'http://127.0.0.1:8080/test.html';  //put your URL

let pattern;    //keep pattern 
let current;    //current hash

let downloadPattern = (function () {

    return function () {
        let alreadyDone = false;
        if (!alreadyDone) {
            alreadyDone = true;
            rp(url)
                .then(function (html) {
                    pattern = MD5(html).toString();
                    current = MD5(html).toString();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    };
})();  //create pattern

downloadPattern();

setInterval(check => {
    rp(url)
        .then(function (html) {
            current = MD5(html).toString();
        })
        .catch(function (err) {
            console.log(err);
        });
    if (pattern === current) {
        console.log("Bez zmian");
    } else {
        console.log("AAAA! Są zmiany!");
        main().catch(console.error);
        pattern = current;
    }
}, 2000);  //check website

async function main() {  

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'wilfred.bauch48@ethereal.email', // generated ethereal user
        pass: 'NzCVudem5TFYfWJEc3', // generated ethereal password
      },
    });
  
    let info = await transporter.sendMail({
      from: '"Notification', // sender address
      to: "test@test.com", // list of receivers
      subject: "Pojawiły się zmiany na stronie!", // Subject line
      text: "Strona, którą monitorujesz zmieniła się! Zajrzyj: " + url // plain text body
    });
  
    console.log("Message sent: %s", info.messageId);
  };
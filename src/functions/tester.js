const { statusJava } = require("node-mcstatus"); 
const ips = [ "mc.hypixel.net", "mc.librecraft.net", "play.twi.en" ];

function checkStatusJava(ipIn) {
  let res = []
  ipIn.map((ip) => {
    const server = statusJava(ip)
    .then((response) => {
      res += response.online
    })
  })
  setTimeout(() => { return res }, 3000)
  return res;
}

const func = checkStatusJava(ips);
console.log(func);
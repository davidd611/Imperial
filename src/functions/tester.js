const { statusJava } = require("node-mcstatus"); 
const ips = [ "mc.hypixel.net", "mc.librecraft.net", "play.twi.en" ];

async function checkStatusJava(ipIn) {
  let res = []
  let mapa = await ipIn.map(async (ip) => {
    const server = await statusJava(ip);
    res.push(server.online)
    console.log(`[checkStatusJava] ${ip}: ${server.online?"online":"offline"}`)
  })
  await Promise.all(mapa);
  return res;
}

const func = checkStatusJava(ips);
setTimeout(() => { console.log(func); }, 4000)
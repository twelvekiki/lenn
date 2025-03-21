const fs = require('fs')

global.owner = "6285724170749"
global.linkch = "https://whatsapp.com/channel/0029Vb0rTBG0AgWCjANsxh2d"

global.status = true
global.welcome = false

global.mess = {
    owner: "no, this is for owners only",
    admin: "no, this is for admin groups only",
    group: "this is for groups only",
    private: "this is specifically for private chat"
}

global.packname = ''
global.author = '— lenn\n⁶²⁸⁵⁷²⁴¹⁷⁰⁷⁴⁹'
global.elevenlabs = "sk_afd78ee6550a00d8d10c1fa766e3a0096f659281f0a2281b"

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})

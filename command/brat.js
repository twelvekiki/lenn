require('../settings/config');

let handler = async (m, { client, text, reaction, reply, prefix, command }) => {
  if (!text) return reply(`contoh: ${prefix + command} apanih cok`)
  const media = `https://aqul-brat.hf.space/?text=${encodeURIComponent(text)}`;
  await reaction(m.chat, "⚡")

  client.sendImageAsSticker(m.chat, media, m, {
    packname: packname,
    author: author
  });
}

handler.help = ['sticker brat'];
handler.tags = ['sticker'];
handler.command = ["sbrat", "brat"];

module.exports = handler;

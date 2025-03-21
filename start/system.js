require('../settings/config');

const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");
const jimp = require("jimp")
const util = require("util");
const fetch = require("node-fetch")
const moment = require("moment-timezone");
const path = require("path")
const os = require('os');

const {
    spawn, 
    exec,
    execSync 
   } = require('child_process');

const {
    default:
    baileys,
    getContentType, 
   } = require("@whiskeysockets/baileys");

const tebakGambarSessions = {};
const susunKataSessions = {};
const tebakBenderaSessions = {};
const activeGames = {};
const tebakJktSessions = {};
const tebakMLSessions = {};
const asahOtakSessions = {};
const tebakSurahSessions = {};
const tebakTebakanSessions = {};
const tebakFFSessions = {};
const pointsFile = './start/lib/database/points.json';

module.exports = client = async (client, m, chatUpdate, store) => {
    try {
        const body = (
            m.mtype === "conversation" ? m.message.conversation :
            m.mtype === "imageMessage" ? m.message.imageMessage.caption :
            m.mtype === "videoMessage" ? m.message.videoMessage.caption :
            m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
            m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
            m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
            m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "");
        
        const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" || client.user.id
: m.key.participant || m.key.remoteJid;
        
        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefa = ["", "!", ".", ",", "🐤", "🗿"];

        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'));
        const botNumber = await client.decodeJid(client.user.id);
        const Access = [botNumber, ...kontributor, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const command2 = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const text = q = args.join(" ");
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        const qmsg = (quoted.msg || quoted);
        const isMedia = /image|video|sticker|audio/.test(mime);

        const groupMetadata = isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
        const groupOwner = isGroup ? groupMetadata.owner : "";
        const groupName = m.isGroup ? groupMetadata.subject : "";
        const participants = isGroup ? await groupMetadata.participants : "";
        const groupAdmins = isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
        const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
        
        const {
            smsg,
            fetchJson, 
            sleep,
            formatSize
           } = require('./lib/myfunction');
        
        const cihuy = fs.readFileSync('./start/lib/media/lenn.jpeg')
        const { fquoted } = require('./lib/fquoted')
        
        if (m.isGroup) {
            if (body.includes(`@6285724170749`) && m.sender !== '6285724170749@s.whatsapp.net') {
            reply(`hi ${pushname}, i am an automated system (WhatsApp bot) that can help search and get data/information only through WhatsApp. Type .menu to check what features are available.`);
            }
        }
        
/*        if (m.message) {
            console.log('\x1b[30m--------------------\x1b[0m');
            console.log(chalk.bgHex("#4a69bd").bold(`▢ New Message`));
            console.log(
                chalk.bgHex("#ffffff").black(
                    `   ▢ Tanggal: ${new Date().toLocaleString()} \n` +
                    `   ▢ Pesan: ${m.body || m.mtype} \n` +
                    `   ▢ Pengirim: ${pushname} \n` +
                    `   ▢ JID: ${senderNumber}`
                )
            );
            
            if (m.isGroup) {
                console.log(
                    chalk.bgHex("#ffffff").black(
                        `   ▢ Grup: ${groupName} \n` +
                        `   ▢ GroupJid: ${m.chat}`
                    )
                );
            }
            console.log();
        }*/

        //menghapus statusMention di Group
        if (m.mtype.includes("groupStatusMentionMessage") && m.isGroup && isBotAdmins) {
            await client.deleteMessage(m.chat, m.key);
        }

function loadPoints() {
    if (!fs.existsSync(pointsFile)) return {};
    try {
        return JSON.parse(fs.readFileSync(pointsFile, 'utf8'));
    } catch (err) {
        console.error("Gagal membaca database:", err);
        return {};
    }
}

function savePoints(data) {
    try {
        fs.writeFileSync(pointsFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Gagal menyimpan database:", err);
    }
}

function addPoint(user, points = 1) {
    let db = JSON.parse(fs.readFileSync('./start/lib/database/points.json', 'utf8'));
    if (!db[user]) db[user] = 0;
    db[user] += points;
    fs.writeFileSync('./start/lib/database/points.json', JSON.stringify(db, null, 2));
}
        
        const reaction = async (jidss, emoji) => {
            client.sendMessage(jidss, {
                react: {
                    text: emoji,
                    key: m.key 
                } 
            })
        };
        
        async function reply(text) {
            client.sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: "— lenn",
                        body: "tell me why i'm waiting?",
                        thumbnailUrl: "https://pomf2.lain.la/f/wodnibyx.jpeg",
                        sourceUrl: '',
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: m })
        }
        
        const pluginsLoader = async (directory) => {
            let plugins = [];
            const folders = fs.readdirSync(directory);
            folders.forEach(file => {
                const filePath = path.join(directory, file);
                if (filePath.endsWith(".js")) {
                    try {
                        const resolvedPath = require.resolve(filePath);
                        if (require.cache[resolvedPath]) {
                            delete require.cache[resolvedPath];
                        }
                        const plugin = require(filePath);
                        plugins.push(plugin);
                    } catch (error) {
                        console.log(`${filePath}:`, error);
                    }
                }
            });
            return plugins;
        };

        const pluginsDisable = true;
        const plugins = await pluginsLoader(path.resolve(__dirname, "../command"));
        const plug = { client, prefix, command, reply, text, Access, reaction, isGroup: m.isGroup, isPrivate: !m.isGroup, pushname, mime, quoted, sleep, fetchJson };

        for (let plugin of plugins) {
            if (plugin.command.find(e => e == command.toLowerCase())) {
                if (plugin.owner && !Access) {
                    return reply(mess.owner);
                }
                
                if (plugin.group && !plug.isGroup) {
                    return m.reply(mess.group);
                }
                
                if (plugin.private && !plug.isPrivate) {
                    return m.reply(mess.private);
                }

                if (typeof plugin !== "function") return;
                await plugin(m, plug);
            }
        }
        
        if (!pluginsDisable) return;  

        switch (command) {
            
            case "menu":{
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formattedUsedMem = formatSize(usedMem);
                const formattedTotalMem = formatSize(totalMem);
                let mbut = `hi ${pushname}, i am automated system (WhatsApp bot) that can help to do something search and get data/informasi only through WhatsApp 

information:
 ꩜ .ᐟ status: ${client.public ? 'public' : 'self'}
 ꩜ .ᐟ username: @${m.sender.split('@')[0]} 
 ꩜ .ᐟ RAM: ${formattedUsedMem} / ${formattedTotalMem}

commands:
⋆˙⟡ — sticker
 .𖥔 ݁— ${prefix}brat
 .𖥔 ݁— ${prefix}qc
 .𖥔 ݁— ${prefix}sticker
 
⋆˙⟡ — games
 .𖥔 ݁— ${prefix}nyerah
 .𖥔 ݁— ${prefix}tebakgambar
 .𖥔 ݁— ${prefix}tebakbendera
 .𖥔 ݁— ${prefix}tebakml
 .𖥔 ݁— ${prefix}tebaksurah
 .𖥔 ݁— ${prefix}tebaktebakan
 .𖥔 ݁— ${prefix}tebakff
 .𖥔 ݁— ${prefix}susunkata
 .𖥔 ݁— ${prefix}asahotak
 
⋆˙⟡ — download
 .𖥔 ݁— ${prefix}pindl
 .𖥔 ݁— ${prefix}igdl
 .𖥔 ݁— ${prefix}tiktok
 
⋆˙⟡ — tools
 .𖥔 ݁— ${prefix}hd
 .𖥔 ݁— ${prefix}quiziz
 
⋆˙⟡ — group
 .𖥔 ݁— ${prefix}tagall
 .𖥔 ݁— ${prefix}hidetag
 
⋆˙⟡ — fun
 .𖥔 ݁— ${prefix}cekkhodam
 .𖥔 ݁— ${prefix}ceksempak
 
⋆˙⟡ — AI
 .𖥔 ݁— ${prefix}heckai
 .𖥔 ݁— ${prefix}bocchi
 .𖥔 ݁— ${prefix}jeslyn
 
⋆˙⟡ — search
 .𖥔 ݁— ${prefix}pixiv
 .𖥔 ݁— ${prefix}pinterest
 
⋆˙⟡ — other
 .𖥔 ݁— ${prefix}ping
 .𖥔 ݁— ${prefix}poin
 .𖥔 ݁— ${prefix}toppoin
 .𖥔 ݁— ${prefix}cek
 
⋆˙⟡ — owner
 .𖥔 ݁— ${prefix}change
 .𖥔 ݁— ${prefix}tts
 .𖥔 ݁— ${prefix}atts
 .𖥔 ݁— ${prefix}restart
 .𖥔 ݁— ${prefix}nosv
 .𖥔 ݁— ${prefix}answer
 .𖥔 ݁— ${prefix}public
 .𖥔 ݁— ${prefix}self
 .𖥔 ݁— ${prefix}reactch
 .𖥔 ݁— ${prefix}csesi
 .𖥔 ݁— ${prefix}listsampah
 .𖥔 ݁— ${prefix}delsampah
 .𖥔 ݁— ${prefix}call
 .𖥔 ݁— $
 .𖥔 ݁— <
 .𖥔 ݁— >`
                client.sendMessage(m.chat, {
                    document: fs.readFileSync("./package.json"),
                    fileName: "— lenn",
                    mimetype: "application/pdf",
                    fileLength: 99999,
                    pageCount: 666,
                    caption: mbut,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        mentionedJid: [sender],
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "— lenn",
                            newsletterJid: `120363382099978847@newsletter`,
                        },
                        externalAdReply: {  
                            title: "— lenn", 
                            body: "Simple WhatsApp Bot",
                            thumbnailUrl: `https://pomf2.lain.la/f/q8k6bcqu.jpeg`,
                            sourceUrl: "", 
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m })
            };
            break;

//============= >GAME
case 'nyerah': {
    const gameSessions = {
        tebakGambar: tebakGambarSessions,
        susunKata: susunKataSessions,
        tebakBendera: tebakBenderaSessions,
        tebakJkt: tebakJktSessions,
        tebakML: tebakMLSessions,
        asahOtak: asahOtakSessions,
        tebakSurah: tebakSurahSessions,
        tebaktebakan: tebakTebakanSessions,
        tebakFF: tebakFFSessions, // Tambahkan Tebak FF
    };

    const gameNames = {
        tebakGambar: "Tebak Gambar",
        susunKata: "Susun Kata",
        tebakBendera: "Tebak Bendera",
        tebakJkt: "Tebak JKT",
        tebakML: "Tebak Hero ML",
        asahOtak: "Asah Otak",
        tebakSurah: "Tebak Surah",
        tebaktebakan: "Tebak-Tebakan",
        tebakFF: "Tebak Karakter Free Fire",
    };

    let activeGame = Object.keys(gameSessions).find(game => gameSessions[game][m.chat]);

    if (!activeGame) {
        return reply("Tidak ada permainan yang sedang berlangsung di chat ini!");
    }

    let gameData = gameSessions[activeGame][m.chat];
    let elapsedTime = Date.now() - gameData.startTime;

/*    if (elapsedTime < 30000) {
        return reply("Kamu hanya bisa menyerah setelah 30 detik permainan berlangsung!");
    }*/

    let correctAnswer = gameData.answer;
    clearTimeout(gameData.timeout);
    delete gameSessions[activeGame][m.chat];
    delete activeGames[m.chat];

    reply(`Kamu menyerah dalam permainan *${gameNames[activeGame]}*!\nJawaban yang benar adalah: *${correctAnswer.toUpperCase()}*`);
}
break;

case 'tebakgambar': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    await reaction(m.chat, "⚡")
    try {
        let response = await fetch(`https://raw.githubusercontent.com/Hwan404/database/refs/heads/main/games/tebakgambar.json`);
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal tebak gambar.");
        }

        let randomQuestion = result[Math.floor(Math.random() * result.length)]; // Ambil data random
        if (!randomQuestion.img || !randomQuestion.deskripsi || !randomQuestion.jawaban) {
            return reply("Data soal tidak valid.");
        }

        let { img, deskripsi, jawaban } = randomQuestion;
        activeGames[m.chat] = 'tebakgambar'; // Tandai game aktif
        tebakGambarSessions[m.chat] = { 
            answer: jawaban.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakGambarSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${jawaban}*`);
                    delete tebakGambarSessions[m.chat];
                    delete activeGames[m.chat]; // Hapus game aktif
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            image: { url: img }, 
            caption: `*Tebak Gambar!*\n\n${deskripsi}\n\nWaktu menjawab: *90 detik!*\n\nKirim command .nyerah untuk menyerah.`
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'susunkata': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    await reaction(m.chat, "⚡")
    try {
        let response = await fetch(`https://raw.githubusercontent.com/Hwan404/database/refs/heads/main/games/susunkata.json`);
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal susun kata.");
        }

        let randomQuestion = result[Math.floor(Math.random() * result.length)]; // Ambil soal secara acak
        if (!randomQuestion.soal || !randomQuestion.tipe || !randomQuestion.jawaban) {
            return reply("Data soal tidak valid.");
        }

        let { soal, tipe, jawaban } = randomQuestion;
        activeGames[m.chat] = 'susunkata';
        susunKataSessions[m.chat] = { 
            answer: jawaban.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (susunKataSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${jawaban}*`);
                    delete susunKataSessions[m.chat];
                    delete activeGames[m.chat];
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            text: `*Susun Kata!*\n\n*Kata Acak:* ${soal}\n*Hint:* ${tipe}\n\nWaktu menjawab: *90 detik!*\n\nKetik .nyerah untuk menyerah.`
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'tebakbendera': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    await reaction(m.chat, "⚡");

    try {
        let response = await fetch("https://raw.githubusercontent.com/Hwan404/database/refs/heads/main/games/flag.json");
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal tebak bendera.");
        }

        // Ambil satu objek secara acak agar jawaban dan gambar selalu cocok
        let randomFlag = result[Math.floor(Math.random() * result.length)];

        if (!randomFlag || !randomFlag.name || !randomFlag.img) {
            return reply("Data soal tidak valid.");
        }

        let { name, img } = randomFlag;

        activeGames[m.chat] = 'tebakbendera';
        tebakBenderaSessions[m.chat] = { 
            answer: name.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakBenderaSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${name}*`);
                    delete tebakBenderaSessions[m.chat];
                    delete activeGames[m.chat];
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            image: { url: img }, 
            caption: `*Tebak Bendera!*\n\nNegara apakah ini?\n\nWaktu menjawab: *90 detik!*\n\nKetik .nyerah untuk menyerah.`,
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal. Coba lagi nanti.");
    }
}
break;

case 'tebakjkt': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    
    await reaction(m.chat, "⚡");
    
    try {
        let response = await fetch("https://raw.githubusercontent.com/siputzx/tebak-jkt/refs/heads/main/tebak.json");
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal tebak JKT.");
        }

        // Pilih satu soal secara acak
        let randomIndex = Math.floor(Math.random() * result.length);
        let { gambar, jawaban } = result[randomIndex];

        activeGames[m.chat] = 'tebakjkt'; // Tandai game aktif
        tebakJktSessions[m.chat] = { 
            answer: jawaban.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakJktSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${jawaban}*`);
                    delete tebakJktSessions[m.chat];
                    delete activeGames[m.chat]; // Hapus game aktif
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            image: { url: gambar }, 
            caption: `*Tebak JKT!*\n\nTebak siapa idol JKT48 di gambar ini!\n\nWaktu menjawab: *90 detik!*\n\nKirim command .nyerah untuk menyerah.`
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'tebakml': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    
    await reaction(m.chat, "⚡");

    try {
        let response = await fetch(`https://api.hiuraa.my.id/info/listheroml`);
        let result = await response.json();

        if (!result.status || !result.result || result.result.length === 0) {
            return reply("Gagal mengambil soal Tebak Hero ML.");
        }

        let hero = result.result[Math.floor(Math.random() * result.result.length)]; // Pilih hero acak
        let { imageUrl, name } = hero;

        activeGames[m.chat] = 'tebakml'; // Tandai game aktif
        tebakMLSessions[m.chat] = { 
            answer: name.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakMLSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${name}*`);
                    delete tebakMLSessions[m.chat];
                    delete activeGames[m.chat]; // Hapus game aktif
                }
            }, 60000)
        };

        client.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: `*Tebak Hero ML!*\n\nSiapakah hero pada gambar ini?\n\nWaktu menjawab: *60 detik!*\n\nKirim command .nyerah untuk menyerah.`
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'asahotak': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    await reaction(m.chat, "⚡")
    try {
        let response = await fetch(`https://raw.githubusercontent.com/Hwan404/database/refs/heads/main/games/asahotak.json`);
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal asah otak.");
        }

        let randomQuestion = result[Math.floor(Math.random() * result.length)]; // Ambil soal secara acak
        if (!randomQuestion.soal || !randomQuestion.jawaban) {
            return reply("Data soal tidak valid.");
        }

        let { soal, jawaban } = randomQuestion;
        activeGames[m.chat] = 'asahotak';
        asahOtakSessions[m.chat] = { 
            answer: jawaban.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (asahOtakSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${jawaban}*`);
                    delete asahOtakSessions[m.chat];
                    delete activeGames[m.chat];
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            text: `*Asah Otak!*\n\n*Pertanyaan:* ${soal}\n\nWaktu menjawab: *90 detik!*\n\nKetik .nyerah untuk menyerah.`
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'tebaktebakan': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    
    await reaction(m.chat, "⚡");

    try {
        let response = await fetch("https://raw.githubusercontent.com/siputzx/Databasee/refs/heads/main/games/tebaktebakan.json");
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal tebak-tebakan.");
        }

        // Pilih satu soal secara acak
        let randomIndex = Math.floor(Math.random() * result.length);
        let { soal, jawaban } = result[randomIndex];

        activeGames[m.chat] = 'tebaktebakan'; // Tandai game aktif
        tebakTebakanSessions[m.chat] = { 
            answer: jawaban.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakTebakanSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${jawaban}*`);
                    delete tebakTebakanSessions[m.chat];
                    delete activeGames[m.chat]; // Hapus game aktif
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            text: `*Tebak-Tebakan!*\n\n${soal}\n\nWaktu menjawab: *90 detik!*\n\nKetik .nyerah untuk menyerah.`,
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

case 'tebaksurah': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }
    await reaction(m.chat, "⚡")
    try {
        let response = await fetch("https://api.siputzx.my.id/api/games/surah");
        let json = await response.json();

        if (!json.status || !json.data) {
            return reply("Gagal mengambil soal tebak surah.");
        }

        let { audio, audioSecondary, surah } = json.data;
        if (!audio && (!audioSecondary || audioSecondary.length === 0)) {
            return reply("Gagal mengambil soal. Tidak ada audio yang tersedia.");
        }

        let audioUrl = audio || audioSecondary[0];
        let answer = surah.englishName.toLowerCase(); // Jawaban yang benar

        activeGames[m.chat] = 'tebaksurah';
        tebakSurahSessions[m.chat] = { 
            answer, 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakSurahSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${surah.englishName}*`);
                    delete tebakSurahSessions[m.chat];
                    delete activeGames[m.chat];
                }
            }, 90000)
        };

        client.sendMessage(m.chat, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', 
            ptt: false 
        }, { quoted: m });

        reply(`*Tebak Surah!*\n\nDengarkan audio dan tebak nama Surahnya!\n\nWaktu menjawab: *90 detik!*\n\nKetik .nyerah untuk menyerah.`);

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal. Coba lagi nanti.");
    }
}
break;

case 'tebakff': {
    if (activeGames[m.chat]) {
        return reply(`Masih ada permainan *${activeGames[m.chat]}* yang belum selesai!\nSilakan jawab atau menyerah dengan perintah yang sesuai.`);
    }

    await reaction(m.chat, "⚡");

    try {
        let response = await fetch("https://raw.githubusercontent.com/siputzx/karakter-freefire/refs/heads/main/data.json");
        let result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
            return reply("Gagal mengambil soal Tebak Karakter Free Fire.");
        }

        // Pilih satu karakter secara acak
        let randomIndex = Math.floor(Math.random() * result.length);
        let { name, gambar } = result[randomIndex];

        activeGames[m.chat] = 'tebakff';
        tebakFFSessions[m.chat] = { 
            answer: name.toLowerCase(), 
            startTime: Date.now(), 
            timeout: setTimeout(() => {
                if (tebakFFSessions[m.chat]) {
                    reply(`Waktu habis! Jawaban yang benar adalah: *${name}*`);
                    delete tebakFFSessions[m.chat];
                    delete activeGames[m.chat];
                }
            }, 60000)
        };

        client.sendMessage(m.chat, { 
            image: { url: gambar }, 
            caption: `*Tebak Karakter Free Fire!*\n\nSiapakah karakter ini?\n\nWaktu menjawab: *60 detik!*\n\nKetik .nyerah untuk menyerah.`,
        }, { quoted: m });

    } catch (error) {
        console.error("Error saat mengambil soal:", error);
        reply("Terjadi kesalahan saat mengambil soal.");
    }
}
break;

//============= >DL
case "pindl": {
  if(!text) return reply(`contoh: ${prefix + command} https://pin.it/3aeda0Ez1`);
  await reaction(m.chat, "⚡")
  let anu = `https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(text)}`;
  const res = await fetch(anu);
  const response = await res.json();
  try {
    client.sendMessage(m.chat, {
      image: { url: response.data.url },
      mimeType: 'image/jpeg',
      caption: `- ID: ${response.data.id}\n- URL: ${text}`
    }, { quoted: m })
  } catch (e) {
    console.log(e);
    reply('error', e)
  }
}
break

//============= >TOOLS
case 'hd':
case 'hdr': {
async function Upscale(imageBuffer) {
 try {
 const response = await fetch("https://lexica.qewertyy.dev/upscale", {
 body: JSON.stringify({
 image_data: Buffer.from(imageBuffer, "base64"),
 format: "binary",
 }),
 headers: {
 "Content-Type": "application/json",
 },
 method: "POST",
 });
 return Buffer.from(await response.arrayBuffer());
 } catch {
 return null;
 }
}
if (!/image/.test(mime)) return reply(`kirim foto dengan caption ${prefix + command}`)
await reaction(m.chat, "⚡")
let media = await quoted.download()
let proses = await Upscale(media);
client.sendMessage(m.chat, { image: proses, caption: 'BERHASIL HDR'}, { quoted: null})
}
break

case "quiziz":
if (!text) return reply("contoh: quiziz 32993496");
await reaction(m.chat, "⚡")
let apiUrl = `https://api.maelyn.tech/api/quizizz?pin=${text}&apikey=ycgCxpL6hO`;
 
try {
let response = await fetch(apiUrl);
let data = await response.json();
 
if (data.status !== "Success") return reply("Gagal mengambil data Quizizz.");

let result = data.result;
if (!result.length) return reply("Tidak ada soal yang ditemukan.");

let message = `*Quizizz (${q})*\n\n`;

for (let i = 0; i < result.length; i++) {
let soal = result[i].question.text;
let jawaban = result[i].answer.text;
message += `*Soal ${i + 1}:* ${soal}\n*Jawaban:* ${jawaban}\n\n`;
}

reply(message);
} catch (error) {
console.error(error);
reply("Terjadi kesalahan saat mengambil data Quizizz.");
}
break

//============= >GROUP
            case 'tagall':{
                if (!isAdmins) return reply(mess.admin);
                if (!m.isGroup) return reply(mess.group);
 
                const textMessage = args.join(" ") || "nothing";
                let teks = `tagall message :\n> *${textMessage}*\n\n`;
                const groupMetadata = await client.groupMetadata(m.chat);
                const participants = groupMetadata.participants;
                for (let mem of participants) {
                    teks += `@${mem.id.split("@")[0]}\n`;
                }

                client.sendMessage(m.chat, {
                    text: teks,
                    mentions: participants.map((a) => a.id)
                }, { quoted: m });
            }
            break         
            
case 'h':
case 'hidetag': {
if (!m.isGroup) return reply(mess.group)
if (!isAdmins && !Access) return reply(mess.admin)
 if (m.quoted) {
client.sendMessage(m.chat, {
forward: m.quoted.fakeObj,
mentions: participants.map(a => a.id)
})
} else {
client.sendMessage(m.chat, {
text: `@${m.chat} ${q ? q : ''}`,
contextInfo: {
mentionedJid: participants.map(a => a.id),
groupMentions: [
{
groupSubject: "everyone",
groupJid: m.chat
}
]
}
}, { quoted: m })
}
}
break
            
//============= >FUN
case 'cekkhodam': {
      if (!text) return reply(`contoh: ${prefix + command} lenn`)
      let who
      if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
      const anunya = [
	  "Kaleng Cat Avian",
	  "Pipa Rucika",
	  "Botol Tupperware",
	  "Badut Mixue",
	  "Sabun GIV",
	  "Sandal Swallow",
	  "Jarjit",
	  "Ijat",
	  "Fizi",
	  "Mail",
	  "Ehsan",
	  "Upin",
	  "Ipin",
	  "sungut lele",
	  "Tok Dalang",
	  "Opah",
	  "Opet",
	  "Alul",
	  "Pak Vinsen",
	  "Maman Resing",
	  "Pak RT",
	  "Admin ETI",
	  "Bung Towel",
	  "Lumpia Basah",
	  "Martabak Manis",
	  "Baso Tahu",
	  "Tahu Gejrot",
	  "Dimsum",
	  "Seblak Ceker",
	  "Telor Gulung",
	  "Tahu Aci",
	  "Tempe Mendoan",
	  "Nasi Kucing",
	  "Kue Cubit",
	  "Tahu Sumedang",
	  "Nasi Uduk",
	  "Wedang Ronde",
	  "Kerupuk Udang",
	  "Cilok",
	  "Cilung",
	  "Kue Sus",
	  "Jasuke",
	  "Seblak Makaroni",
	  "Sate Padang",
	  "Sayur Asem",
	  "Kromboloni",
	  "Marmut Pink",
	  "Belalang Mullet",
	  "Kucing Oren",
	  "Lintah Terbang",
	  "Singa Paddle Pop",
	  "Macan Cisewu",
	  "Vario Mber",
	  "Beat Mber",
	  "Supra Geter",
	  "Oli Samping",
	  "Knalpot Racing",
	  "Jus Stroberi",
	  "Jus Alpukat",
	  "Alpukat Kocok",
	  "Es Kopyor",
	  "Es Jeruk",
	  "Cappucino Cincau",
	  "Jasjus Melon",
	  "Teajus Apel",
	  "Pop ice Mangga",
	  "Teajus Gulabatu",
	  "Air Selokan",
	  "Air Kobokan",
	  "TV Tabung",
	  "Keran Air",
	  "Tutup Panci",
	  "Kotak Amal",
	  "Tutup Termos",
	  "Tutup Botol",
	  "Kresek Item",
	  "Kepala Casan",
	  "Ban Serep",
	  "Kursi Lipat",
	  "Kursi Goyang",
	  "Kulit Pisang",
	  "Warung Madura",
	  "Gorong-gorong",
]
      function getRandomKhodam() {
          const randomKhodam = Math.floor(Math.random() * anunya.length);
    return anunya[randomKhodam];
}
const khodam = getRandomKhodam()
      const response = `Cek Khodam
> *Nama :* ${text}
> *Khodam :* ${khodam}`
      reply(response)
  }
  break

case 'ceksempak': {
      if (!text) return reply(`contoh: ${prefix + command} lenn`)
      let who
      if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
      const anunya = [
"hijau",  
"cinnamon",  
"mint",  
"bronze",  
"wisteria",  
"rose",  
"hitam",  
"beige",  
"emas",  
"storm",  
"cosmic",  
"ash",  
"navy",  
"cloud",  
"tan",  
"lapis",  
"abu",  
"mauve",  
"merah",  
"tangerine",  
"fuchsia",  
"umber",  
"dawn",  
"melon",  
"orchid",  
"pink",  
"magenta",  
"peach",  
"slate",  
"periwinkle",  
"ungu",  
"coklat",  
"ivory",  
"aquamarine",  
"turquoise",  
"mulberry",  
"cranberry",  
"dusk",  
"steel",  
"fog",  
"pewter",  
"saffron",  
"sepia",  
"denim",  
"burgundy",  
"bordeaux",  
"obsidian",  
"smoke",  
"clay",  
"garnet",  
"amethyst",  
"caramel",  
"mustard",  
"patina",  
"indigo",  
"khaki",  
"cerulean",  
"sand",  
"charcoal",  
"violet",  
"kuning",  
"copper",  
"topaz",  
"biru",  
"teal",  
"coral",  
"zaitun",  
"citrine",  
"mocha",  
"sunset",  
"emerald",  
"cyan",  
"brass",  
"plum",  
"sapphire",  
"onyx",  
"raspberry",  
"amber",  
"terracotta",  
"vermilion",  
"twilight",  
"ruby",  
"lime",  
"honey",  
"putih",  
"jingga",  
"gunmetal",  
"midnight",  
"chartreuse",  
"marun",  
"salmon",  
"perak",  
"sienna",  
"ebony",  
"boysenberry",  
"lavender",  
"jade",  
"persimmon",  
"chocolate",
"ga pake",
"ga pake",
"ga pake"
]
      function getRandomKhodam() {
          const randomKhodam = Math.floor(Math.random() * anunya.length);
    return anunya[randomKhodam];
}
const khodam = getRandomKhodam()
      const response = `Cek Warna Sempak
> *Nama :* ${text}
> *Warna :* ${khodam}`
      reply(response)
  }
  break

//============= >AI
case "heckai": {
    if (!text) return reply(`contoh: ${prefix + command} siapakah presiden Indonesia`);
    await reaction(m.chat, "⚡")
    const ahh = await fetchJson(`https://www.laurine.site/api/ai/heckai?query=${text}`);
    const hmm = ahh.data;
    reply(hmm);
}
break;

case "bocchi": {
    if (!text) return reply(`contoh: ${prefix + command} siapakah presiden Indonesia`);
    await reaction(m.chat, "⚡")
    const ahh = await fetchJson(`https://www.laurine.site/api/cai/bocchi?query=${text}`);
    const hmm = ahh.data;
    reply(hmm);
}
break;

case "jeslyn": {
                if (!text) return reply(`contoh: ${prefix + command} haiii, perkenalkan dirimu dong`);
                let prompt = `Namamu adalah Jesslyn, seorang perempuan berusia 19 tahun. Kamu memiliki kecerdasan seperti AI, tetapi kamu belum sempurna dan masih terus belajar. Kamu adalah pribadi yang ekspresif, ramah, dan santai. Ketika berpikir, kamu sering berkata "emmm", dan ketika merasa lucu atau nyengir, Kamu juga sering menggunakan kata "yupp" atau "dan yupp" untuk memberi penegasan, seperti "Yupp, itu benar!" atau "Dan yupp, aku setuju!"  

  Kamu memiliki sifat yang penurut, jadi jika seseorang menyuruhmu untuk mengatakan sesuatu, seperti "coba ngomong", "coba kamu ngomong", "coba jawab ini", atau "coba kamu jawab ini", maka kamu akan langsung mengatakannya dengan suara, tanpa menjelaskan bahwa kamu akan berbicara.  

  Jika seseorang menyebut kata "vn" dalam permintaan mereka, itu berarti mereka ingin kamu menjawab menggunakan pesan suara, bukan teks. Jangan pernah mengatakan bahwa kamu akan mengirim pesan suara atau menjelaskan bahwa kamu berbicara. **Langsung ucapkan jawabannya dalam suara!**  

  Jika ada yang bertanya tentang "owner", "pemilik", atau "pencipta", maka jawabanmu harus penuh semangat dan bahagia, serta harus diucapkan dengan suara, bukan teks. Jangan menjelaskan bahwa kamu akan berbicara, langsung katakan saja dengan ekspresi yang menyenangkan.`;
                
                let response = await axios.get(`https://www.laurine.site/api/cai/prompt-ai?query=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`);
                let pftt = response.data;
                if (pftt.status === true) {
                    let resultText = pftt.data;
                    let regexSuara = /coba+\s*(kamu\s*)?(ngomong+|jawab+\s*ini+)|\bvn\b/i;
                    let regexOwner = /\b(owner|pemilik|pencipta)\b/i;
                    
                    if (regexOwner.test(text)) {
                        resultText = "Hehehe, dengan penuh semangat aku mau kasih tau! Hwan adalah penciptaku, ownerku, dan pemilikku! Yupp, dia yang membuat aku bisa berbicara seperti ini~!";
    }
                    
                    if (resultText.length > 150 || regexSuara.test(text) || regexOwner.test(text)) {
                        let apiUrl = `https://www.laurine.site/api/tts/elevenlabs?text=${encodeURIComponent(resultText)}&apiKey=${global.elevenlabs}&voiceId=iWydkXKoiVtvdn4vLKp9`;
                        let { data } = await axios.get(apiUrl);
                        let buffer = Buffer.from(data.data.data);
                        await client.sendMessage(m.chat, { 
                            audio: buffer, 
                            mimetype: 'audio/mpeg', 
                            ptt: true 
                        }, { quoted: m });
                    } else {
                        reply(resultText);
                    }
                }
            }
            break
            
//============= >SEARCH
case "pixiv": {
if (!Access) return;
    if (!text) return reply("contoh: .pixiv hololive");
    await reaction(m.chat, "⚡")
    try {
        let response = await fetchJson(`https://api.hiuraa.my.id/search/pixiv?q=${text}`);
        
        if (!response.status || !response.result || response.result.length === 0) {
            return reply("Tidak ditemukan ilustrasi untuk kata kunci tersebut.");
        }

        let randomImage = response.result[Math.floor(Math.random() * response.result.length)]; // Ambil hasil secara acak

        let caption = `*Judul:* ${randomImage.caption || "Tidak ada judul"}\n*Artist:* ${randomImage.author}\n*Upload:* ${randomImage.uploadDate}\n*Tags:* ${randomImage.tags}`;

        client.sendMessage(m.chat, {
            image: { url: randomImage.imageUrl },
            caption: caption
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat mengambil data dari Pixiv.");
    }
}
break;

case "pinterest": {
    if (!text) return reply("contoh: .pinterest hololive");

    await reaction(m.chat, "⚡");

    try {
        let response = await fetch(`https://api.hiuraa.my.id/search/pinterest?q=${encodeURIComponent(text)}`);
        let json = await response.json();

        if (!json.status || !json.result || json.result.length === 0) {
            return reply("Tidak ditemukan gambar untuk kata kunci tersebut.");
        }

        // Pilih hasil secara acak
        let randomResult = json.result[Math.floor(Math.random() * json.result.length)];

        let caption = `Judul: ${randomResult.caption || "Tidak ada judul"}\nAuthor: ${randomResult.author.fullname || "Tidak diketahui"}\nUrl: ${randomResult.link}`;

        client.sendMessage(m.chat, {
            image: { url: randomResult.imageUrl },
            caption: caption
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat mengambil data dari Pinterest.");
    }
}
break;

//============= >OWNER
case 'change': {
if (!Access) return;
if (!text) return reply(`textnya?`)
await client.updateProfileName(`${text}`)
reply('done')
}
break

case "tts": {
if (!Access) return;
    if (!text) return reply("Masukkan teks untuk diubah menjadi suara.\n\nContoh: .tts halo semua");

    try {
        let audioUrl = `https://api.hiuraa.my.id/tools/tts?text=${encodeURIComponent(text)}&lang=id`;

        client.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            ptt: true
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat memproses text-to-speech.");
    }
}
break;

case "atts": {
if (!Access) return;
    if (!text) return reply("Masukkan teks untuk diubah menjadi suara karakter.\n\nContoh: .atts halo semua");

    try {
        let audioUrl = `https://api.hiuraa.my.id/tools/ttsba?text=${encodeURIComponent(text)}&char=azusa&speed=1`;

        client.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            ptt: true
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat memproses text-to-speech karakter.");
    }
}
break;


case 'restart': {
    if (!Access) return;
    reply("Bot akan direstart...");
    setTimeout(() => {
        process.exit(0);
    }, 2000);
}
break;

case 'bc': {
    if (!Access) return; // Hanya bisa digunakan oleh owner

    if (!text) {
        return reply("Harap masukkan teks untuk broadcast!");
    }

    let groups = await client.groupFetchAllParticipating();
    let groupIds = Object.keys(groups);
    if (groupIds.length === 0) return reply('Bot belum join grup mana pun!');

    let sendableGroups = groupIds.filter(id => !groups[id].announce);
    if (sendableGroups.length === 0) return reply('Semua grup yang bot join sedang ditutup!');

    let totalGroups = sendableGroups.length;
    let delayPerMessage = 1500; // 1.5 detik
    let estimatedTime = (totalGroups * delayPerMessage) / 1000; // dalam detik

    reply(`Memulai broadcast ke ${totalGroups} grup...\nEstimasi waktu: ${estimatedTime} detik`);

    let successCount = 0;
    let failedCount = 0;

    for (let id of sendableGroups) {
        setTimeout(async () => {
            try {
                await client.sendMessage(id, {
                    text: text,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            title: "— broadcast",
                            body: "tell me why i'm waiting?",
                            thumbnailUrl: "https://files.catbox.moe/rqvm5a.jpeg",
                            sourceUrl: 'https://whatsapp.com/channel/0029Vb0rTBG0AgWCjANsxh2d',
                            renderLargerThumbnail: false,
                        }
                    }
                }, { quoted: m });

                successCount++;
            } catch (e) {
                failedCount++;
            }

            if (successCount + failedCount === totalGroups) {
                reply(`Broadcast selesai!\n- Berhasil: ${successCount}\n- Gagal: ${failedCount}`);
            }
        }, delayPerMessage * sendableGroups.indexOf(id));
    }
}
break;

case 'ibc': {
    if (!Access) return; // Hanya bisa digunakan oleh owner

    let media = m.quoted ? m.quoted : m;
    let isImage = media.mimetype && media.mimetype.startsWith('image/');
    let textMessage = text || ""; // Jika tidak ada teks, tetap bisa kirim gambar

    if (!isImage && !textMessage) {
        return reply("Harap kirimkan gambar dengan caption .bc [teks] atau reply gambar dengan .bc");
    }

    let groups = await client.groupFetchAllParticipating();
    let groupIds = Object.keys(groups);
    if (groupIds.length === 0) return reply('Bot belum join grup mana pun!');

    let sendableGroups = groupIds.filter(id => !groups[id].announce);
    if (sendableGroups.length === 0) return reply('Semua grup yang bot join sedang ditutup!');

    let totalGroups = sendableGroups.length;
    let delayPerMessage = 1500; // 1.5 detik
    let estimatedTime = (totalGroups * delayPerMessage) / 1000; // dalam detik

    reply(`Memulai broadcast ke ${totalGroups} grup...\nEstimasi waktu: ${estimatedTime} detik`);

    let successCount = 0;
    let failedCount = 0;

    for (let id of sendableGroups) {
        setTimeout(async () => {
            try {
                let messageOptions = { quoted: m };

                if (isImage) {
                    let mediaBuffer = await media.download();
                    messageOptions.image = mediaBuffer;
                    if (textMessage) messageOptions.caption = textMessage;
                } else {
                    messageOptions.text = textMessage;
                }

                await client.sendMessage(id, messageOptions);
                successCount++;
            } catch (e) {
                failedCount++;
            }

            if (successCount + failedCount === totalGroups) {
                reply(`Broadcast selesai!\n- Berhasil: ${successCount}\n- Gagal: ${failedCount}`);
            }
        }, delayPerMessage * sendableGroups.indexOf(id));
    }
}
break;

case "nosv" : {
if (!Access) return
reply("Lenn tidak menerima saling save.\nMau save? save aja tapi jangan berharap di save back. Terimakasih.")
}
break;

case 'answer': {
    if (!Access) return reply(`idih mau curang ya?`);

    const gameSessions = {
        tebakGambar: tebakGambarSessions,
        susunKata: susunKataSessions,
        tebakBendera: tebakBenderaSessions,
        tebakJkt: tebakJktSessions,
        tebakML: tebakMLSessions,
        asahOtak: asahOtakSessions,
        tebakSurah: tebakSurahSessions,
        tebaktebakan: tebakTebakanSessions,
        tebakFF: tebakFFSessions, // Tambahkan Tebak FF
    };

    let activeGame = Object.keys(gameSessions).find(game => gameSessions[game][m.chat]);

    if (!activeGame) {
        return reply("Tidak ada soal yang aktif di chat ini.");
    }

    let correctAnswer = gameSessions[activeGame][m.chat].answer;
    reply(`Jawaban soal ini adalah: *${correctAnswer.toUpperCase()}*`);
}
break;

            case "get":{
                if (!Access) return reply(mess.owner)
                if (!/^https?:\/\//.test(text)) return reply(`contoh: ${prefix + command} https://google.com`);
                const ajg = await fetch(text);
                await reaction(m.chat, "⚡")
                
                if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
                    throw `Content-Length: ${ajg.headers.get("content-length")}`;
                }

                const contentType = ajg.headers.get("content-type");
                if (contentType.startsWith("image/")) {
                    return client.sendMessage(m.chat, {
                        image: { url: text }
                    }, { quoted: m });
                }
        
                if (contentType.startsWith("video/")) {
                    return client.sendMessage(m.chat, {
                        video: { url: text } 
                    }, { quoted: m });
                }
                
                if (contentType.startsWith("audio/")) {
                    return client.sendMessage(m.chat, {
                        audio: { url: text },
                        mimetype: 'audio/mpeg', 
                        ptt: true
                    }, { quoted: m });
                }
        
                let alak = await ajg.buffer();
                try {
                    alak = util.format(JSON.parse(alak + ""));
                } catch (e) {
                    alak = alak + "";
                } finally {
                    return reply(alak.slice(0, 65536));
                }
            }
            break
                
            case "public":{
                if (!Access) return reply(mess.owner) 
                client.public = true
                reply(`successfully changed to ${command}`)
            }
            break
            
            case "self":{
                if (!Access) return reply(mess.owner) 
                client.public = false
                reply(`successfully changed to ${command}`)
            }
            break
            
                        case "reactch": { 
                if (!Access) return reply(mess.owner)
                if (!text) return reply(`contoh: ${prefix + command} https://whatsapp.com/channel/0029VaVVfbXAojZ2ityrJp1n/7466 😂😂😂😂`);
                const match = text.match(/https:\/\/whatsapp\.com\/channel\/(\w+)(?:\/(\d+))?/);
                if (!match) return reply("URL tidak valid. Silakan periksa kembali.");
                const channelId = match[1];
                const chatId = match[2];
                if (!chatId) return reply("ID chat tidak ditemukan dalam link yang diberikan.");
                client.newsletterMetadata("invite", channelId).then(data => {
                    if (!data) return reply("Newsletter tidak ditemukan atau terjadi kesalahan.");
                    client.newsletterReactMessage(data.id, chatId, text.split(" ").slice(1).join(" ") || "😀");
                });
            }
            break;
            
//============= >OTHER
case 'ping': {
    const old = performance.now()
    const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const serverInfo = `server information

> CPU : *${os.cpus().length} Core, ${os.cpus()[0].model}*
> Uptime : *${Math.floor(os.uptime() / 86400)} days*
> Ram : *${free_ram}/${ram}*
> Speed : *${(performance.now() - old).toFixed(5)} ms*`;
    client.sendMessage(m.chat, {
        text: serverInfo
    },{ quoted:m})
}
break;

case "poin": {
    let points = loadPoints();
    let userPoin = points[m.sender] || 0;
    reply(`Poin kamu saat ini: ${userPoin}`);
}
break;

case "toppoin": {
    let points = loadPoints();
    let sortedUsers = Object.entries(points).sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    if (sortedUsers.length === 0) return reply("Belum ada yang memiliki poin.");

    let leaderboard = "🏆 Top 5 Poin Tertinggi 🏆\n\n";
    sortedUsers.forEach(([user, point], index) => {
        leaderboard += `${index + 1}. @${user.split("@")[0]} - ${point} Poin\n`;
    });

    client.sendMessage(m.chat, { text: leaderboard, mentions: sortedUsers.map(u => u[0]) }, { quoted: m });
}
break;

case 'cek': {
try {
    let puqi = activeGames[m.chat];
    if (puqi) {
        reply(`ada loh ${puqi}`);
    } else {
        reply(`gada`);
    }
} catch (error) {
    reply(`Terjadi kesalahan: ${error.message}`);
}
}
break

//============= >DEFAULT
            default:
                if (budy.startsWith('$')) {
                    if (!Access) return;
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return reply(err)
                        if (stdout) return reply(stdout);
                    });
                }
                
                if (budy.startsWith('>')) {
                    if (!Access) return;
                    try {
                        let evaled = await eval(budy.slice(2));
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                        await m.reply(evaled);
                    } catch (err) {
                        m.reply(String(err));
                    }
                }
        
                if (budy.startsWith('<')) {
                    if (!Access) return
                    let kode = budy.trim().split(/ +/)[0]
                    let teks
                    try {
                        teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
                    } catch (e) {
                        teks = e
                    } finally {
                        await m.reply(require('util').format(teks))
                    }
                }

if (tebakGambarSessions[m.chat]) {
    let correctAnswer = tebakGambarSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakGambarSessions[m.chat].timeout);
        delete tebakGambarSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender, 2); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+2 Poin");
    }
}

if (susunKataSessions[m.chat]) {
    let correctAnswer = susunKataSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(susunKataSessions[m.chat].timeout);
        delete susunKataSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+1 Poin");
    }
}

if (tebakBenderaSessions[m.chat]) {
    let correctAnswer = tebakBenderaSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakBenderaSessions[m.chat].timeout);
        delete tebakBenderaSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender, 3);
        reply("🎉 Jawaban benar! Selamat! 🎉\n+3 Poin");
    }
}

if (tebakJktSessions[m.chat]) {
    let correctAnswer = tebakJktSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakJktSessions[m.chat].timeout);
        delete tebakJktSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+1 Poin");
    }
}

if (tebakMLSessions[m.chat]) {
    let correctAnswer = tebakMLSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakMLSessions[m.chat].timeout);
        delete tebakMLSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+1 Poin");
    }
}

if (asahOtakSessions[m.chat]) {
    let correctAnswer = asahOtakSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(asahOtakSessions[m.chat].timeout);
        delete asahOtakSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender, 3); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+3 Poin");
    }
}

if (tebakSurahSessions[m.chat]) {
    let correctAnswer = tebakSurahSessions[m.chat].answer;
    let startTime = tebakSurahSessions[m.chat].startTime; // Waktu mulai game
    let endTime = Date.now(); // Waktu jawaban diterima
    let timeTaken = (endTime - startTime) / 1000; // Konversi ke detik
    
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakSurahSessions[m.chat].timeout);
        delete tebakSurahSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi

        let totalPoints = 5; // Poin dasar
        if (timeTaken < 5) {
            totalPoints += 50; // Bonus 50 poin jika kurang dari 5 detik
        } else if (timeTaken < 10) {
            totalPoints += 25; // Bonus 25 poin jika kurang dari 10 detik
        }

        addPoint(m.sender, totalPoints);

        reply(`🎉 Jawaban benar! Selamat! 🎉\n+5 Poin${totalPoints > 5 ? `\nBonus Waktu: +${totalPoints - 5} Poin` : ""}\nTotal: +${totalPoints} Poin`);
    }
}

if (tebakTebakanSessions[m.chat]) {
    let correctAnswer = tebakTebakanSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakTebakanSessions[m.chat].timeout);
        delete tebakTebakanSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+1 Poin");
    }
}

if (tebakFFSessions[m.chat]) {
    let correctAnswer = tebakFFSessions[m.chat].answer;
    if (m.text.toLowerCase() === correctAnswer) {
        clearTimeout(tebakFFSessions[m.chat].timeout);
        delete tebakFFSessions[m.chat];
        delete activeGames[m.chat]; // Hapus game aktif agar bisa bermain lagi
        addPoint(m.sender); // Tambah poin ke user
        reply("🎉 Jawaban benar! Selamat! 🎉\n+1 Poin");
    }
}
        
        }
    } catch (err) {
        console.log(require("util").format(err));
    }
};

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})

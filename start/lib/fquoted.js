const fs = require("fs");

const fquoted = {
    forder: {
        key: {
            fromMe: false,
            participant: "13135550002@s.whatsapp.net",
            remoteJid: "status@broadcast"
        },
        message: {
            orderMessage: {
                orderId: "2009",
                thumbnail: fs.readFileSync('./start/lib/media/lenn.jpeg'),
                itemCount: "505",
                status: "INQUIRY",
                surface: "CATALOG",
                message: `— lenn`,
                token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
            }
        }
    }
};

module.exports = { fquoted };

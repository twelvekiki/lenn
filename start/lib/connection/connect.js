const konek = async ({
    client,
    update,
    clientstart,
    DisconnectReason,
    Boom
}) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') { 
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
            await client.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            clientstart();
        }
    } else if (connection === "open") {
        console.log('sukses terkoneksi');
        console.log(update);
    }
};

module.exports = { konek };

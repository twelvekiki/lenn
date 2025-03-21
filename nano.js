const jsonfile = require("jsonfile");
const simpleGit = require("simple-git");
(async () => {
  const chalk = (await import("chalk")).default;
  const boxen = (await import("boxen")).default;
  const moment = (await import("moment")).default;
  const randomInt = (await import("random-int")).default; // Dynamic import
  const path = "./kiki.json";

  // Fungsi untuk menampilkan UI di terminal
  const displayUI = async (message, type = "info") => {
    const colors = {
      info: "blue",
      success: "green",
      warning: "yellow",
      error: "red",
    };
    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: colors[type],
    };
    console.log(boxen(chalk[colors[type]](message), boxenOptions));
  };

  // Fungsi untuk membuat commit otomatis (dijalankan secara berurutan)
  const makeCommits = async (n) => {
    if (n === 0) {
      await displayUI("🎉 Semua commit telah dibuat dan dipush!", "success");
      await simpleGit().push(); // Pastikan hanya dipanggil sekali
      return;
    }

    const x = randomInt(0, 54);
    const y = randomInt(0, 6);
    const date = moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(x, "w")
      .add(y, "d")
      .format();

    await displayUI(`✨  Membuat commit #${n} pada: ${date}`, "info");

    const data = { date, message: `Commit #${n} pada ${date}` };

    try {
      // Tunggu proses writeFile selesai
      await jsonfile.writeFile(path, data);

      // Tambahkan file dan commit
      await simpleGit().add([path]).commit(`Commit #${n}`, { "--date": date });

      // Lanjut ke commit berikutnya setelah yang ini selesai
      await makeCommits(n - 1);
    } catch (error) {
      await displayUI(`❌ ERROR: ${error.message}`, "error");
    }
  };

  // Menampilkan pesan awal
  await displayUI(
    "🚀 Memulai proses auto-commit...\n" + "📌 Project: Lenn\n" + "📌 Version: 1.0.0",
    "info"
  );

  await makeCommits(5);
})();

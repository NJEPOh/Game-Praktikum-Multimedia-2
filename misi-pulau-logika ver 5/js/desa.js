/**
 * File: js/desa.js
 * Deskripsi: Mekanik permainan Wilayah Desa (Pilar Pengenalan Pola).
 * Mengambil data soal dari data/desa.json menggunakan Fetch API, mengacak soal,
 * memilih 5 soal unik untuk 5 tahap, dan mengelola penilaian.
 */

const PETA_GAMBAR_UBIN_DESA = {
    "?": {
        nomorGambar: 34,
        namaFile: "ubin_rumpang.png",
        jalur: "assets/images/tiles/ubin_rumpang.png",
        label: "Ubin Rumpang (?)"
    },
    "lingkaran": {
        nomorGambar: 35,
        namaFile: "ubin_lingkaran.png",
        jalur: "assets/images/tiles/ubin_lingkaran.png",
        label: "Lingkaran"
    },
    "persegi": {
        nomorGambar: 36,
        namaFile: "ubin_persegi.png",
        jalur: "assets/images/tiles/ubin_persegi.png",
        label: "Persegi"
    },
    "segitiga": {
        nomorGambar: 37,
        namaFile: "ubin_segitiga.png",
        jalur: "assets/images/tiles/ubin_segitiga.png",
        label: "Segitiga"
    },
    "bintang": {
        nomorGambar: 38,
        namaFile: "ubin_bintang.png",
        jalur: "assets/images/tiles/ubin_bintang.png",
        label: "Bintang"
    },
    "belah_ketupat": {
        nomorGambar: 39,
        namaFile: "ubin_belah_ketupat.png",
        jalur: "assets/images/tiles/ubin_belah_ketupat.png",
        label: "Belah Ketupat"
    },
    "merah": {
        nomorGambar: 40,
        namaFile: "ubin_merah.png",
        jalur: "assets/images/tiles/ubin_merah.png",
        label: "Merah"
    },
    "biru": {
        nomorGambar: 41,
        namaFile: "ubin_biru.png",
        jalur: "assets/images/tiles/ubin_biru.png",
        label: "Biru"
    },
    "kuning": {
        nomorGambar: 42,
        namaFile: "ubin_kuning.png",
        jalur: "assets/images/tiles/ubin_kuning.png",
        label: "Kuning"
    },
    "hijau": {
        nomorGambar: 43,
        namaFile: "ubin_hijau.png",
        jalur: "assets/images/tiles/ubin_hijau.png",
        label: "Hijau"
    },
    "ungu": {
        nomorGambar: 44,
        namaFile: "ubin_ungu.png",
        jalur: "assets/images/tiles/ubin_ungu.png",
        label: "Ungu"
    },
    "angka": {
        nomorGambar: 45,
        namaFile: "ubin_angka.png",
        jalur: "assets/images/tiles/ubin_angka.png",
        label: "Angka"
    }
};

let soalSesiDesa = [];
let indeksTahapDesa = 0;
let skorDesa = 0;
let kesempatanSalahTahapIni = 0;
let tahapSudahSelesai = false;

/**
 * Mengacak urutan array menggunakan algoritma Fisher-Yates.
 */
function acakSoalDesa(daftar) {
    const salinan = daftar.slice();
    for (let i = salinan.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const sementara = salinan[i];
        salinan[i] = salinan[j];
        salinan[j] = sementara;
    }
    return salinan;
}

/**
 * Menghasilkan HTML gambar ubin beserta komentar aset sesuai aturan rancangan.
 */
function buatHTMLGambarUbinDesa(nilaiUbin, jenisSoal) {
    if (nilaiUbin === "?") {
        const infoKosong = PETA_GAMBAR_UBIN_DESA["?"];
        return (
            "<!-- Gambar " + infoKosong.nomorGambar + ": " + infoKosong.namaFile +
            " | Ukuran tampilan: 80x80 px | Aset: " + infoKosong.jalur + " -->" +
            '<div class="bungkus-gambar-ubin">' +
            '<img src="' + infoKosong.jalur + '" alt="' + infoKosong.label + '" width="80" height="80">' +
            "</div>" +
            '<span class="label-ubin-pola">?</span>'
        );
    }

    if (jenisSoal === "angka" || !PETA_GAMBAR_UBIN_DESA[nilaiUbin]) {
        const infoAngka = PETA_GAMBAR_UBIN_DESA["angka"];
        return (
            "<!-- Gambar " + infoAngka.nomorGambar + ": " + infoAngka.namaFile +
            " | Ukuran tampilan: 80x80 px | Aset: " + infoAngka.jalur + " -->" +
            '<div class="bungkus-gambar-ubin">' +
            '<img src="' + infoAngka.jalur + '" alt="Ubin angka ' + nilaiUbin + '" width="80" height="80">' +
            '<span class="angka-di-atas-ubin">' + nilaiUbin + "</span>" +
            "</div>" +
            '<span class="label-ubin-pola">Angka ' + nilaiUbin + "</span>"
        );
    }

    const info = PETA_GAMBAR_UBIN_DESA[nilaiUbin];
    return (
        "<!-- Gambar " + info.nomorGambar + ": " + info.namaFile +
        " | Ukuran tampilan: 80x80 px | Aset: " + info.jalur + " -->" +
        '<div class="bungkus-gambar-ubin">' +
        '<img src="' + info.jalur + '" alt="Ubin ' + info.label + '" width="80" height="80">' +
        "</div>" +
        '<span class="label-ubin-pola">' + info.label + "</span>"
    );
}

/**
 * Memperbarui indikator tahap dan skor pada halaman Desa.
 */
function perbaruiStatusDesa() {
    const elTahap = document.getElementById("indikator-tahap-desa");
    const elSkor = document.getElementById("indikator-skor-desa");

    if (elTahap) {
        elTahap.textContent = (indeksTahapDesa + 1) + "/5";
    }
    if (elSkor) {
        elSkor.textContent = String(skorDesa);
    }
}

/**
 * Menampilkan pesan status atau penjelasan jawaban di halaman Desa.
 */
function tampilkanPesanDesa(teks, jenis) {
    const kotakPesan = document.getElementById("pesan-umpan-balik-desa");
    if (!kotakPesan) {
        return;
    }
    kotakPesan.textContent = teks;
    kotakPesan.className = "kotak-pesan pesan-" + (jenis || "info");
}

/**
 * Menampilkan soal pada tahap aktif saat ini.
 */
function tampilkanSoalDesa() {
    const soal = soalSesiDesa[indeksTahapDesa];
    if (!soal) {
        return;
    }

    kesempatanSalahTahapIni = 0;
    tahapSudahSelesai = false;

    const badgeJenis = document.getElementById("jenis-pola-desa");
    const teksInstruksi = document.getElementById("instruksi-soal-desa");
    const wadahPola = document.getElementById("wadah-pola-jalan");
    const wadahOpsi = document.getElementById("wadah-opsi-desa");
    const tombolNext = document.getElementById("tombol-next-desa");

    if (badgeJenis) {
        badgeJenis.textContent = "Pola " + soal.jenis;
    }
    if (teksInstruksi) {
        teksInstruksi.textContent = soal.instruksi;
    }
    if (tombolNext) {
        tombolNext.classList.add("tersembunyi");
    }

    tampilkanPesanDesa("Pilih ubin yang benar untuk mengisi tanda tanya (?).", "info");

    // 1. Render deret ubin pola jalan
    wadahPola.innerHTML = "";
    soal.pola.forEach(function (itemPola) {
        const kartuUbin = document.createElement("div");
        kartuUbin.className = "kartu-ubin-pola" + (itemPola === "?" ? " ubin-kosong" : "");
        if (itemPola === "?") {
            kartuUbin.id = "ubin-target-rumpang";
        }
        kartuUbin.innerHTML = buatHTMLGambarUbinDesa(itemPola, soal.jenis);
        wadahPola.appendChild(kartuUbin);
    });

    // 2. Render opsi jawaban
    wadahOpsi.innerHTML = "";
    soal.opsi.forEach(function (nilaiOpsi) {
        const tombolOpsi = document.createElement("button");
        tombolOpsi.type = "button";
        tombolOpsi.className = "tombol-opsi-ubin";
        tombolOpsi.setAttribute("data-sfx-hover", "");
        tombolOpsi.setAttribute("data-sfx-click", "");
        tombolOpsi.innerHTML = buatHTMLGambarUbinDesa(nilaiOpsi, soal.jenis);

        tombolOpsi.addEventListener("click", function () {
            periksaJawabanDesa(nilaiOpsi, tombolOpsi, soal);
        });

        wadahOpsi.appendChild(tombolOpsi);
    });

    perbaruiStatusDesa();
}

/**
 * Memeriksa pilihan jawaban pemain pada tahap aktif.
 */
function periksaJawabanDesa(pilihanPemain, tombolDiklik, soal) {
    if (tahapSudahSelesai) {
        return;
    }

    if (pilihanPemain === soal.jawaban) {
        tahapSudahSelesai = true;
        tombolDiklik.classList.add("opsi-benar");

        // Hitung tambahan skor (maksimal 20 poin per soal untuk 5 soal = 100 poin)
        const poinTahap = Math.max(10, 20 - (kesempatanSalahTahapIni * 5));
        skorDesa += poinTahap;
        perbaruiStatusDesa();

        // Ganti tampilan ubin yang rumpang dengan ubin jawaban yang benar
        const ubinRumpang = document.getElementById("ubin-target-rumpang");
        if (ubinRumpang) {
            ubinRumpang.classList.remove("ubin-kosong");
            ubinRumpang.classList.add("ubin-terjawab");
            ubinRumpang.innerHTML = buatHTMLGambarUbinDesa(soal.jawaban, soal.jenis);
        }

        // Nonaktifkan semua tombol opsi setelah jawaban benar
        const semuaTombol = document.querySelectorAll(".tombol-opsi-ubin");
        semuaTombol.forEach(function (tombol) {
            tombol.disabled = true;
        });

        putarSFX("correct.mp3");
        tampilkanPesanDesa("Benar! " + soal.penjelasan, "sukses");

        const tombolNext = document.getElementById("tombol-next-desa");
        if (tombolNext) {
            tombolNext.classList.remove("tersembunyi");
            tombolNext.textContent =
                indeksTahapDesa < 4 ? "Lanjut" : "Selesai";
        }
    } else {
        kesempatanSalahTahapIni++;
        tombolDiklik.classList.add("opsi-salah");
        tombolDiklik.disabled = true;
        putarSFX("wrong.mp3");
        tampilkanPesanDesa(
            "Belum tepat, coba pilih ubin yang lain ya!",
            "kesalahan"
        );
    }
}

/**
 * Data cadangan 50 soal Desa (identik dengan data/desa.json) agar permainan
 * tetap berjalan normal meskipun dibuka langsung melalui protokol file://.
 */
const CADANGAN_SOAL_DESA = [
    {
        "id": "desa-001",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang melengkapi pola jalan!",
        "pola": [
            "lingkaran",
            "persegi",
            "lingkaran",
            "persegi",
            "?"
        ],
        "opsi": [
            "segitiga",
            "lingkaran",
            "persegi"
        ],
        "jawaban": "lingkaran",
        "penjelasan": "Pola bergantian antara lingkaran dan persegi."
    },
    {
        "id": "desa-002",
        "jenis": "warna",
        "instruksi": "Pilih warna berikutnya untuk memperbaiki ubin jalan!",
        "pola": [
            "merah",
            "biru",
            "merah",
            "biru",
            "?"
        ],
        "opsi": [
            "kuning",
            "merah",
            "hijau"
        ],
        "jawaban": "merah",
        "penjelasan": "Pola bergantian antara merah dan biru."
    },
    {
        "id": "desa-003",
        "jenis": "angka",
        "instruksi": "Pilih angka yang tepat untuk melengkapi ubin jalan!",
        "pola": [
            "2",
            "4",
            "6",
            "8",
            "?"
        ],
        "opsi": [
            "9",
            "10",
            "12"
        ],
        "jawaban": "10",
        "penjelasan": "Setiap ubin bertambah 2 dari angka sebelumnya."
    },
    {
        "id": "desa-004",
        "jenis": "bentuk",
        "instruksi": "Amati urutan bentuk ubin, lalu pilih bentuk yang hilang!",
        "pola": [
            "segitiga",
            "segitiga",
            "bintang",
            "segitiga",
            "segitiga",
            "?"
        ],
        "opsi": [
            "bintang",
            "lingkaran",
            "persegi"
        ],
        "jawaban": "bintang",
        "penjelasan": "Pola berulang setiap tiga ubin: dua segitiga lalu satu bintang."
    },
    {
        "id": "desa-005",
        "jenis": "warna",
        "instruksi": "Lengkapi ubin warna yang rumpang pada jalan desa!",
        "pola": [
            "kuning",
            "hijau",
            "ungu",
            "kuning",
            "hijau",
            "?"
        ],
        "opsi": [
            "merah",
            "ungu",
            "biru"
        ],
        "jawaban": "ungu",
        "penjelasan": "Pola tiga warna berulang: kuning, hijau, lalu ungu."
    },
    {
        "id": "desa-006",
        "jenis": "angka",
        "instruksi": "Tentukan angka berikutnya pada deret ubin jembatan!",
        "pola": [
            "5",
            "10",
            "15",
            "20",
            "?"
        ],
        "opsi": [
            "22",
            "25",
            "30"
        ],
        "jawaban": "25",
        "penjelasan": "Pola bilangan loncat 5 (bertambah 5 di setiap langkah)."
    },
    {
        "id": "desa-007",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang tepat untuk mengisi tanda tanya!",
        "pola": [
            "persegi",
            "segitiga",
            "lingkaran",
            "persegi",
            "segitiga",
            "?"
        ],
        "opsi": [
            "lingkaran",
            "bintang",
            "persegi"
        ],
        "jawaban": "lingkaran",
        "penjelasan": "Urutan bentuk berulang: persegi, segitiga, lingkaran."
    },
    {
        "id": "desa-008",
        "jenis": "warna",
        "instruksi": "Perhatikan pola warna ubin dan pilih warna yang sesuai!",
        "pola": [
            "biru",
            "biru",
            "kuning",
            "biru",
            "biru",
            "?"
        ],
        "opsi": [
            "merah",
            "kuning",
            "hijau"
        ],
        "jawaban": "kuning",
        "penjelasan": "Setelah dua ubin biru selalu diikuti satu ubin kuning."
    },
    {
        "id": "desa-009",
        "jenis": "angka",
        "instruksi": "Lengkapi angka yang hilang pada urutan ubin!",
        "pola": [
            "1",
            "3",
            "5",
            "7",
            "?"
        ],
        "opsi": [
            "8",
            "9",
            "11"
        ],
        "jawaban": "9",
        "penjelasan": "Pola bilangan ganjil yang bertambah 2 setiap langkah."
    },
    {
        "id": "desa-010",
        "jenis": "bentuk",
        "instruksi": "Manakah bentuk ubin yang tepat untuk melengkapi jalan?",
        "pola": [
            "bintang",
            "belah_ketupat",
            "bintang",
            "belah_ketupat",
            "?"
        ],
        "opsi": [
            "bintang",
            "persegi",
            "segitiga"
        ],
        "jawaban": "bintang",
        "penjelasan": "Pola bergantian antara bintang dan belah ketupat."
    },
    {
        "id": "desa-011",
        "jenis": "warna",
        "instruksi": "Ubin di tengah jalan hilang! Pilih warna yang benar!",
        "pola": [
            "hijau",
            "merah",
            "?",
            "merah",
            "hijau"
        ],
        "opsi": [
            "hijau",
            "biru",
            "ungu"
        ],
        "jawaban": "hijau",
        "penjelasan": "Pola berselang-seling hijau dan merah."
    },
    {
        "id": "desa-012",
        "jenis": "angka",
        "instruksi": "Temukan angka yang hilang di tengah pola!",
        "pola": [
            "10",
            "20",
            "?",
            "40",
            "50"
        ],
        "opsi": [
            "25",
            "30",
            "35"
        ],
        "jawaban": "30",
        "penjelasan": "Setiap ubin bertambah 10 dari ubin sebelumnya."
    },
    {
        "id": "desa-013",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk ubin untuk melengkapi bagian yang kosong!",
        "pola": [
            "lingkaran",
            "lingkaran",
            "persegi",
            "persegi",
            "lingkaran",
            "lingkaran",
            "?"
        ],
        "opsi": [
            "segitiga",
            "persegi",
            "bintang"
        ],
        "jawaban": "persegi",
        "penjelasan": "Pola berpasangan dua lingkaran lalu dua persegi."
    },
    {
        "id": "desa-014",
        "jenis": "warna",
        "instruksi": "Pilih warna ubin yang tepat untuk urutan terakhir!",
        "pola": [
            "ungu",
            "kuning",
            "ungu",
            "kuning",
            "?"
        ],
        "opsi": [
            "ungu",
            "hijau",
            "biru"
        ],
        "jawaban": "ungu",
        "penjelasan": "Pola warna bergantian ungu dan kuning."
    },
    {
        "id": "desa-015",
        "jenis": "angka",
        "instruksi": "Amati pola angka menurun berikut dan pilih angka selanjutnya!",
        "pola": [
            "20",
            "18",
            "16",
            "14",
            "?"
        ],
        "opsi": [
            "13",
            "12",
            "10"
        ],
        "jawaban": "12",
        "penjelasan": "Setiap ubin berkurang 2 dari angka sebelumnya."
    },
    {
        "id": "desa-016",
        "jenis": "bentuk",
        "instruksi": "Lengkapi ubin yang hilang pada pola jalan desa!",
        "pola": [
            "belah_ketupat",
            "segitiga",
            "belah_ketupat",
            "?",
            "belah_ketupat"
        ],
        "opsi": [
            "lingkaran",
            "segitiga",
            "persegi"
        ],
        "jawaban": "segitiga",
        "penjelasan": "Pola bergantian antara belah ketupat dan segitiga."
    },
    {
        "id": "desa-017",
        "jenis": "warna",
        "instruksi": "Pilih warna yang melengkapi pola tiga warna berikut!",
        "pola": [
            "merah",
            "kuning",
            "hijau",
            "merah",
            "?",
            "hijau"
        ],
        "opsi": [
            "biru",
            "kuning",
            "ungu"
        ],
        "jawaban": "kuning",
        "penjelasan": "Urutan berulang seperti lampu lalu lintas: merah, kuning, hijau."
    },
    {
        "id": "desa-018",
        "jenis": "angka",
        "instruksi": "Pilih angka yang sesuai untuk melanjutkan deret ubin!",
        "pola": [
            "3",
            "6",
            "9",
            "12",
            "?"
        ],
        "opsi": [
            "14",
            "15",
            "16"
        ],
        "jawaban": "15",
        "penjelasan": "Pola kelipatan 3 (bertambah 3 setiap ubin)."
    },
    {
        "id": "desa-019",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang tepat untuk ubin terakhir!",
        "pola": [
            "bintang",
            "lingkaran",
            "persegi",
            "bintang",
            "lingkaran",
            "?"
        ],
        "opsi": [
            "persegi",
            "segitiga",
            "belah_ketupat"
        ],
        "jawaban": "persegi",
        "penjelasan": "Pola tiga bentuk berulang: bintang, lingkaran, persegi."
    },
    {
        "id": "desa-020",
        "jenis": "warna",
        "instruksi": "Temukan warna ubin yang tepat untuk mengisi tanda tanya!",
        "pola": [
            "hijau",
            "hijau",
            "ungu",
            "hijau",
            "hijau",
            "?"
        ],
        "opsi": [
            "ungu",
            "merah",
            "kuning"
        ],
        "jawaban": "ungu",
        "penjelasan": "Setiap dua ubin hijau diikuti oleh satu ubin ungu."
    },
    {
        "id": "desa-021",
        "jenis": "angka",
        "instruksi": "Lengkapi pola angka berulang pada jalan batu!",
        "pola": [
            "1",
            "2",
            "3",
            "1",
            "2",
            "?"
        ],
        "opsi": [
            "1",
            "3",
            "4"
        ],
        "jawaban": "3",
        "penjelasan": "Pola angka berulang 1, 2, 3."
    },
    {
        "id": "desa-022",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk ubin yang hilang pada urutan kedua!",
        "pola": [
            "persegi",
            "?",
            "persegi",
            "segitiga",
            "persegi",
            "segitiga"
        ],
        "opsi": [
            "segitiga",
            "bintang",
            "lingkaran"
        ],
        "jawaban": "segitiga",
        "penjelasan": "Pola bergantian antara persegi dan segitiga."
    },
    {
        "id": "desa-023",
        "jenis": "warna",
        "instruksi": "Pilih warna ubin yang sesuai dengan pola!",
        "pola": [
            "biru",
            "merah",
            "hijau",
            "biru",
            "merah",
            "?"
        ],
        "opsi": [
            "kuning",
            "hijau",
            "ungu"
        ],
        "jawaban": "hijau",
        "penjelasan": "Urutan warna berulang: biru, merah, hijau."
    },
    {
        "id": "desa-024",
        "jenis": "angka",
        "instruksi": "Berapakah angka berikutnya pada pola kelipatan 4 ini?",
        "pola": [
            "4",
            "8",
            "12",
            "16",
            "?"
        ],
        "opsi": [
            "18",
            "20",
            "24"
        ],
        "jawaban": "20",
        "penjelasan": "Setiap langkah bertambah 4."
    },
    {
        "id": "desa-025",
        "jenis": "bentuk",
        "instruksi": "Perhatikan pola simetris berikut dan pilih bentuk yang tepat!",
        "pola": [
            "lingkaran",
            "segitiga",
            "bintang",
            "segitiga",
            "?"
        ],
        "opsi": [
            "lingkaran",
            "persegi",
            "bintang"
        ],
        "jawaban": "lingkaran",
        "penjelasan": "Pola cermin (simetris) dengan bintang di tengah dan lingkaran di kedua ujung."
    },
    {
        "id": "desa-026",
        "jenis": "warna",
        "instruksi": "Pilih warna yang melengkapi pola warna berpasangan!",
        "pola": [
            "merah",
            "merah",
            "biru",
            "biru",
            "merah",
            "?"
        ],
        "opsi": [
            "merah",
            "biru",
            "kuning"
        ],
        "jawaban": "merah",
        "penjelasan": "Setiap warna muncul dua kali berturut-turut: dua merah lalu dua biru."
    },
    {
        "id": "desa-027",
        "jenis": "angka",
        "instruksi": "Amati pola angka hitung mundur berikut!",
        "pola": [
            "50",
            "40",
            "30",
            "20",
            "?"
        ],
        "opsi": [
            "15",
            "10",
            "5"
        ],
        "jawaban": "10",
        "penjelasan": "Setiap ubin berkurang 10 dari angka sebelumnya."
    },
    {
        "id": "desa-028",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang hilang pada deretan ubin!",
        "pola": [
            "belah_ketupat",
            "lingkaran",
            "belah_ketupat",
            "lingkaran",
            "?"
        ],
        "opsi": [
            "persegi",
            "belah_ketupat",
            "segitiga"
        ],
        "jawaban": "belah_ketupat",
        "penjelasan": "Pola bergantian antara belah ketupat dan lingkaran."
    },
    {
        "id": "desa-029",
        "jenis": "warna",
        "instruksi": "Lengkapi ubin warna pada posisi keempat!",
        "pola": [
            "kuning",
            "ungu",
            "kuning",
            "?",
            "kuning"
        ],
        "opsi": [
            "hijau",
            "ungu",
            "merah"
        ],
        "jawaban": "ungu",
        "penjelasan": "Pola berselang-seling antara kuning dan ungu."
    },
    {
        "id": "desa-030",
        "jenis": "angka",
        "instruksi": "Pilih angka yang tepat untuk pola berlipat dua berikut!",
        "pola": [
            "1",
            "2",
            "4",
            "8",
            "?"
        ],
        "opsi": [
            "10",
            "12",
            "16"
        ],
        "jawaban": "16",
        "penjelasan": "Setiap angka dikalikan 2 dari angka sebelumnya (8 x 2 = 16)."
    },
    {
        "id": "desa-031",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk ubin yang melengkapi pola!",
        "pola": [
            "persegi",
            "persegi",
            "belah_ketupat",
            "persegi",
            "persegi",
            "?"
        ],
        "opsi": [
            "belah_ketupat",
            "lingkaran",
            "segitiga"
        ],
        "jawaban": "belah_ketupat",
        "penjelasan": "Setelah dua persegi selalu muncul satu belah ketupat."
    },
    {
        "id": "desa-032",
        "jenis": "warna",
        "instruksi": "Pilih warna yang tepat untuk menutup urutan jalan!",
        "pola": [
            "ungu",
            "biru",
            "hijau",
            "ungu",
            "biru",
            "?"
        ],
        "opsi": [
            "merah",
            "hijau",
            "kuning"
        ],
        "jawaban": "hijau",
        "penjelasan": "Pola tiga warna berulang: ungu, biru, hijau."
    },
    {
        "id": "desa-033",
        "jenis": "angka",
        "instruksi": "Temukan angka berikutnya pada pola selang-seling!",
        "pola": [
            "5",
            "1",
            "5",
            "1",
            "?"
        ],
        "opsi": [
            "1",
            "5",
            "10"
        ],
        "jawaban": "5",
        "penjelasan": "Pola angka bergantian antara 5 dan 1."
    },
    {
        "id": "desa-034",
        "jenis": "bentuk",
        "instruksi": "Bentuk apakah yang seharusnya berada pada tanda tanya?",
        "pola": [
            "segitiga",
            "bintang",
            "lingkaran",
            "segitiga",
            "?",
            "lingkaran"
        ],
        "opsi": [
            "persegi",
            "bintang",
            "belah_ketupat"
        ],
        "jawaban": "bintang",
        "penjelasan": "Pola berulang: segitiga, bintang, lingkaran."
    },
    {
        "id": "desa-035",
        "jenis": "warna",
        "instruksi": "Lengkapi warna pertama yang hilang pada pola jalan!",
        "pola": [
            "?",
            "hijau",
            "kuning",
            "hijau",
            "kuning",
            "hijau"
        ],
        "opsi": [
            "kuning",
            "merah",
            "biru"
        ],
        "jawaban": "kuning",
        "penjelasan": "Pola berselang-seling dimulai dari kuning lalu hijau."
    },
    {
        "id": "desa-036",
        "jenis": "angka",
        "instruksi": "Tentukan angka berikutnya pada deret loncat 6!",
        "pola": [
            "6",
            "12",
            "18",
            "24",
            "?"
        ],
        "opsi": [
            "28",
            "30",
            "32"
        ],
        "jawaban": "30",
        "penjelasan": "Setiap ubin bertambah 6 dari ubin sebelumnya."
    },
    {
        "id": "desa-037",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang tepat untuk melanjutkan pola!",
        "pola": [
            "bintang",
            "bintang",
            "persegi",
            "bintang",
            "bintang",
            "?"
        ],
        "opsi": [
            "persegi",
            "segitiga",
            "lingkaran"
        ],
        "jawaban": "persegi",
        "penjelasan": "Dua bintang selalu diikuti satu persegi."
    },
    {
        "id": "desa-038",
        "jenis": "warna",
        "instruksi": "Pilih warna yang hilang pada urutan jalan desa!",
        "pola": [
            "merah",
            "ungu",
            "biru",
            "merah",
            "ungu",
            "?"
        ],
        "opsi": [
            "hijau",
            "biru",
            "kuning"
        ],
        "jawaban": "biru",
        "penjelasan": "Pola berulang tiga warna: merah, ungu, biru."
    },
    {
        "id": "desa-039",
        "jenis": "angka",
        "instruksi": "Amati pertambahan bertingkat dan pilih angka berikutnya!",
        "pola": [
            "1",
            "2",
            "4",
            "7",
            "11",
            "?"
        ],
        "opsi": [
            "15",
            "16",
            "17"
        ],
        "jawaban": "16",
        "penjelasan": "Selisih bertambah secara berurutan: +1, +2, +3, +4, lalu +5 (11 + 5 = 16)."
    },
    {
        "id": "desa-040",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk ubin yang tepat untuk mengisi tanda tanya!",
        "pola": [
            "lingkaran",
            "belah_ketupat",
            "segitiga",
            "lingkaran",
            "belah_ketupat",
            "?"
        ],
        "opsi": [
            "segitiga",
            "bintang",
            "persegi"
        ],
        "jawaban": "segitiga",
        "penjelasan": "Urutan tiga bentuk berulang: lingkaran, belah ketupat, segitiga."
    },
    {
        "id": "desa-041",
        "jenis": "warna",
        "instruksi": "Pilih warna ubin yang sesuai untuk pola berikut!",
        "pola": [
            "kuning",
            "kuning",
            "merah",
            "kuning",
            "kuning",
            "?"
        ],
        "opsi": [
            "biru",
            "merah",
            "hijau"
        ],
        "jawaban": "merah",
        "penjelasan": "Setiap dua ubin kuning diikuti satu ubin merah."
    },
    {
        "id": "desa-042",
        "jenis": "angka",
        "instruksi": "Berapakah angka yang hilang pada pola hitung mundur 3 ini?",
        "pola": [
            "15",
            "12",
            "9",
            "6",
            "?"
        ],
        "opsi": [
            "4",
            "3",
            "2"
        ],
        "jawaban": "3",
        "penjelasan": "Setiap ubin berkurang 3 dari angka sebelumnya."
    },
    {
        "id": "desa-043",
        "jenis": "bentuk",
        "instruksi": "Lengkapi ubin bentuk yang rumpang di tengah jalan!",
        "pola": [
            "persegi",
            "bintang",
            "?",
            "bintang",
            "persegi"
        ],
        "opsi": [
            "persegi",
            "lingkaran",
            "segitiga"
        ],
        "jawaban": "persegi",
        "penjelasan": "Pola bergantian antara persegi dan bintang."
    },
    {
        "id": "desa-044",
        "jenis": "warna",
        "instruksi": "Pilih warna yang tepat untuk melengkapi jalan!",
        "pola": [
            "hijau",
            "biru",
            "hijau",
            "biru",
            "?"
        ],
        "opsi": [
            "hijau",
            "ungu",
            "merah"
        ],
        "jawaban": "hijau",
        "penjelasan": "Pola warna bergantian antara hijau dan biru."
    },
    {
        "id": "desa-045",
        "jenis": "angka",
        "instruksi": "Pilih angka yang melengkapi pola kelipatan 7!",
        "pola": [
            "7",
            "14",
            "21",
            "28",
            "?"
        ],
        "opsi": [
            "34",
            "35",
            "36"
        ],
        "jawaban": "35",
        "penjelasan": "Setiap ubin bertambah 7 dari angka sebelumnya."
    },
    {
        "id": "desa-046",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk ubin yang tepat untuk urutan terakhir!",
        "pola": [
            "segitiga",
            "persegi",
            "belah_ketupat",
            "segitiga",
            "persegi",
            "?"
        ],
        "opsi": [
            "belah_ketupat",
            "lingkaran",
            "bintang"
        ],
        "jawaban": "belah_ketupat",
        "penjelasan": "Pola berulang tiga bentuk: segitiga, persegi, belah ketupat."
    },
    {
        "id": "desa-047",
        "jenis": "warna",
        "instruksi": "Manakah warna yang tepat untuk mengisi ubin kosong?",
        "pola": [
            "ungu",
            "ungu",
            "biru",
            "ungu",
            "ungu",
            "?"
        ],
        "opsi": [
            "biru",
            "kuning",
            "merah"
        ],
        "jawaban": "biru",
        "penjelasan": "Dua ubin ungu selalu diikuti satu ubin biru."
    },
    {
        "id": "desa-048",
        "jenis": "angka",
        "instruksi": "Lengkapi pola tiga angka berulang berikut!",
        "pola": [
            "2",
            "5",
            "8",
            "2",
            "5",
            "?"
        ],
        "opsi": [
            "2",
            "7",
            "8"
        ],
        "jawaban": "8",
        "penjelasan": "Kelompok tiga angka (2, 5, 8) berulang kembali."
    },
    {
        "id": "desa-049",
        "jenis": "bentuk",
        "instruksi": "Pilih bentuk yang benar untuk melengkapi barisan ubin!",
        "pola": [
            "belah_ketupat",
            "belah_ketupat",
            "bintang",
            "belah_ketupat",
            "belah_ketupat",
            "?"
        ],
        "opsi": [
            "bintang",
            "persegi",
            "lingkaran"
        ],
        "jawaban": "bintang",
        "penjelasan": "Setelah dua belah ketupat selalu diikuti satu bintang."
    },
    {
        "id": "desa-050",
        "jenis": "warna",
        "instruksi": "Pilih warna terakhir untuk menyelesaikan pola jalan desa!",
        "pola": [
            "biru",
            "kuning",
            "merah",
            "biru",
            "kuning",
            "?"
        ],
        "opsi": [
            "hijau",
            "merah",
            "ungu"
        ],
        "jawaban": "merah",
        "penjelasan": "Pola tiga warna dasar berulang: biru, kuning, merah."
    }
];

/**
 * Menginisialisasi sesi 5 tahap soal Desa dari daftar soal yang tersedia.
 */
function mulaiSesiSoalDesa(daftarSoal) {
    const soalTeracak = acakSoalDesa(daftarSoal);
    soalSesiDesa = soalTeracak.slice(0, 5);
    indeksTahapDesa = 0;
    skorDesa = 0;
    tampilkanSoalDesa();
}

/**
 * Mengambil seluruh soal dari data/desa.json menggunakan Fetch API,
 * dengan fallback otomatis ke CADANGAN_SOAL_DESA jika dibuka melalui file://.
 */
function muatDataSoalDesa() {
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
        mulaiSesiSoalDesa(CADANGAN_SOAL_DESA);
        return;
    }

    fetch("data/desa.json")
        .then(function (respons) {
            if (!respons.ok) {
                throw new Error("Gagal mengambil file data/desa.json (Status: " + respons.status + ")");
            }
            return respons.json();
        })
        .then(function (data) {
            if (!data || !Array.isArray(data.soal) || data.soal.length < 5) {
                throw new Error("Format data soal Desa tidak lengkap.");
            }
            mulaiSesiSoalDesa(data.soal);
        })
        .catch(function () {
            if (Array.isArray(CADANGAN_SOAL_DESA) && CADANGAN_SOAL_DESA.length >= 5) {
                mulaiSesiSoalDesa(CADANGAN_SOAL_DESA);
                return;
            }
            tampilkanPesanDesa(
                "Gagal memuat data soal Desa.",
                "kesalahan"
            );
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const elNama = document.getElementById("nama-pemain-desa");
    if (elNama) {
        elNama.textContent = ambilNamaPemain();
    }

    const tombolNext = document.getElementById("tombol-next-desa");
    if (tombolNext) {
        tombolNext.addEventListener("click", function () {
            if (indeksTahapDesa < soalSesiDesa.length - 1) {
                indeksTahapDesa++;
                tampilkanSoalDesa();
            } else {
                simpanSkor("pengenalanPola", skorDesa);
                simpanProgres("desa", true);
                pindahHalaman("peta.html", true);
            }
        });
    }

    muatDataSoalDesa();
});

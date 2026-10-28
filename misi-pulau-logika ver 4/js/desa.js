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
 * Mengambil seluruh soal dari data/desa.json menggunakan Fetch API.
 */
function muatDataSoalDesa() {
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
            const soalTeracak = acakSoalDesa(data.soal);
            soalSesiDesa = soalTeracak.slice(0, 5);
            indeksTahapDesa = 0;
            skorDesa = 0;
            tampilkanSoalDesa();
        })
        .catch(function (kesalahan) {
            console.error(kesalahan);
            tampilkanPesanDesa(
                "Gagal memuat data soal dari data/desa.json. Pastikan Anda menjalankan game melalui server lokal (seperti Live Server), bukan membuka file langsung melalui file://.",
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

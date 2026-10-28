/**
 * File: js/kastil.js
 * Deskripsi: Mekanik permainan Wilayah Kastil (Pilar Algoritma).
 * Mengambil 50 soal dari data/kastil.json menggunakan Fetch API, mengacak dan memilih
 * 5 soal untuk 5 tahap, serta mengeksekusi urutan instruksi (Maju, Mundur, Kiri, Kanan)
 * pada papan grid 4 x 4.
 */

const INFO_PERINTAH_KASTIL = {
    "maju": {
        label: "Maju",
        nomorGambar: 54,
        namaFile: "ikon_maju.png",
        jalur: "assets/images/icons/ikon_maju.png",
        dBaris: -1,
        dKolom: 0
    },
    "mundur": {
        label: "Mundur",
        nomorGambar: 55,
        namaFile: "ikon_mundur.png",
        jalur: "assets/images/icons/ikon_mundur.png",
        dBaris: 1,
        dKolom: 0
    },
    "kiri": {
        label: "Kiri",
        nomorGambar: 56,
        namaFile: "ikon_kiri.png",
        jalur: "assets/images/icons/ikon_kiri.png",
        dBaris: 0,
        dKolom: -1
    },
    "kanan": {
        label: "Kanan",
        nomorGambar: 57,
        namaFile: "ikon_kanan.png",
        jalur: "assets/images/icons/ikon_kanan.png",
        dBaris: 0,
        dKolom: 1
    }
};

let soalSesiKastil = [];
let indeksTahapKastil = 0;
let skorKastil = 0;
let percobaanGagalTahapIni = 0;
let daftarInstruksi = [];
let posisiPemain = { baris: 0, kolom: 0 };
let sedangMenjalankan = false;
let tahapKastilSelesai = false;

/**
 * Mengacak urutan array menggunakan algoritma Fisher-Yates.
 */
function acakSoalKastil(daftar) {
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
 * Memeriksa apakah suatu koordinat (baris, kolom) merupakan rintangan pada soal aktif.
 */
function apakahRintangan(soal, baris, kolom) {
    return soal.rintangan.some(function (r) {
        return r.baris === baris && r.kolom === kolom;
    });
}

/**
 * Memperbarui indikator tahap, jumlah langkah, dan skor Algoritma.
 */
function perbaruiStatusKastil() {
    const elTahap = document.getElementById("indikator-tahap-kastil");
    const elLangkah = document.getElementById("indikator-langkah-kastil");
    const elSkor = document.getElementById("indikator-skor-kastil");

    if (elTahap) {
        elTahap.textContent = (indeksTahapKastil + 1) + "/5";
    }
    if (elLangkah) {
        elLangkah.textContent = String(daftarInstruksi.length);
    }
    if (elSkor) {
        elSkor.textContent = String(skorKastil);
    }
}

/**
 * Menampilkan pesan status atau umpan balik di halaman Kastil.
 */
function tampilkanPesanKastil(teks, jenis) {
    const kotakPesan = document.getElementById("pesan-umpan-balik-kastil");
    if (!kotakPesan) {
        return;
    }
    kotakPesan.textContent = teks;
    kotakPesan.className = "kotak-pesan pesan-" + (jenis || "info");
}

/**
 * Mengatur aktif/tidaknya tombol kontrol selama simulasi berjalan.
 */
function aturStatusTombolKontrol(nonaktif) {
    const semuaTombolArah = document.querySelectorAll(".tombol-blok-arah");
    semuaTombolArah.forEach(function (btn) {
        btn.disabled = nonaktif || tahapKastilSelesai;
    });

    const tombolHapus = document.getElementById("tombol-hapus-instruksi");
    const tombolJalankan = document.getElementById("tombol-jalankan-instruksi");

    if (tombolHapus) {
        tombolHapus.disabled = nonaktif || tahapKastilSelesai;
    }
    if (tombolJalankan) {
        tombolJalankan.disabled = nonaktif || tahapKastilSelesai;
    }
}

/**
 * Merender papan grid 4 x 4 beserta posisi awal, tujuan, rintangan, dan token pemain.
 */
function renderPapanGridKastil(jejakLangkah, selTabrakan) {
    const soal = soalSesiKastil[indeksTahapKastil];
    const papan = document.getElementById("papan-grid-kastil");
    if (!soal || !papan) {
        return;
    }

    const daftarJejak = jejakLangkah || [];
    papan.innerHTML = "";

    for (let b = 0; b < 4; b++) {
        for (let k = 0; k < 4; k++) {
            const sel = document.createElement("div");
            sel.className = "sel-grid-kastil";
            sel.setAttribute("data-baris", String(b));
            sel.setAttribute("data-kolom", String(k));

            const adalahAwal = soal.awal.baris === b && soal.awal.kolom === k;
            const adalahTujuan = soal.tujuan.baris === b && soal.tujuan.kolom === k;
            const adalahBatu = apakahRintangan(soal, b, k);
            const adalahPemain = posisiPemain.baris === b && posisiPemain.kolom === k;
            const adalahJejak = daftarJejak.some(function (j) {
                return j.baris === b && j.kolom === k;
            });
            const adalahTabrakan =
                selTabrakan && selTabrakan.baris === b && selTabrakan.kolom === k;

            if (adalahTabrakan) {
                sel.classList.add("sel-tabrakan");
            } else if (adalahBatu) {
                sel.classList.add("sel-rintangan");
            } else if (adalahTujuan) {
                sel.classList.add("sel-tujuan");
            } else if (adalahAwal) {
                sel.classList.add("sel-awal");
            } else if (adalahJejak) {
                sel.classList.add("sel-jejak");
            }

            // Isi gambar dasar sel
            if (adalahBatu) {
                sel.innerHTML =
                    "<!-- Gambar 51: grid_rintangan.png | Ukuran tampilan: 48x48 px | Aset: assets/images/tiles/grid_rintangan.png -->" +
                    '<img src="assets/images/tiles/grid_rintangan.png" alt="Rintangan batu" width="48" height="48">' +
                    '<span class="label-kecil-sel">Rintangan</span>';
            } else if (adalahTujuan) {
                sel.innerHTML =
                    "<!-- Gambar 52: grid_tujuan.png | Ukuran tampilan: 48x48 px | Aset: assets/images/tiles/grid_tujuan.png -->" +
                    '<img src="assets/images/tiles/grid_tujuan.png" alt="Gerbang tujuan" width="48" height="48">' +
                    '<span class="label-kecil-sel">Tujuan</span>';
            } else if (adalahAwal) {
                sel.innerHTML =
                    "<!-- Gambar 53: grid_mulai.png | Ukuran tampilan: 48x48 px | Aset: assets/images/tiles/grid_mulai.png -->" +
                    '<img src="assets/images/tiles/grid_mulai.png" alt="Titik awal" width="48" height="48">' +
                    '<span class="label-kecil-sel">Mulai</span>';
            } else {
                sel.innerHTML =
                    "<!-- Gambar 50: grid_lantai.png | Ukuran tampilan: 48x48 px | Aset: assets/images/tiles/grid_lantai.png -->" +
                    '<img src="assets/images/tiles/grid_lantai.png" alt="Lantai grid" width="48" height="48">';
            }

            // Tampilkan token pemain jika berada di sel ini
            if (adalahPemain) {
                const lapisanPemain = document.createElement("div");
                lapisanPemain.className = "lapisan-token-pemain";
                lapisanPemain.innerHTML =
                    "<!-- Gambar 10: token_pemain.png | Ukuran tampilan: 48x48 px | Aset: assets/images/characters/token_pemain.png -->" +
                    '<img src="assets/images/characters/token_pemain.png" alt="Posisi karakter pemain" width="48" height="48">';
                sel.appendChild(lapisanPemain);
            }

            papan.appendChild(sel);
        }
    }
}

/**
 * Merender daftar blok instruksi yang telah disusun pemain.
 */
function renderAntreanInstruksi(indeksAktif) {
    const wadah = document.getElementById("wadah-antrean-instruksi");
    if (!wadah) {
        return;
    }

    perbaruiStatusKastil();

    if (daftarInstruksi.length === 0) {
        wadah.innerHTML =
            '<p class="teks-antrean-kosong">Belum ada langkah. Klik Maju, Mundur, Kiri, atau Kanan.</p>';
        return;
    }

    wadah.innerHTML = "";
    daftarInstruksi.forEach(function (kodePerintah, indeks) {
        const info = INFO_PERINTAH_KASTIL[kodePerintah];
        if (!info) {
            return;
        }
        const chip = document.createElement("div");
        chip.className = "chip-instruksi" + (indeks === indeksAktif ? " sedang-dieksekusi" : "");
        chip.innerHTML =
            "<!-- Gambar " + info.nomorGambar + ": " + info.namaFile +
            " | Ukuran tampilan: 22x22 px | Aset: " + info.jalur + " -->" +
            '<img src="' + info.jalur + '" alt="' + info.label + '" width="22" height="22">' +
            "<span>" + (indeks + 1) + ". " + info.label + "</span>";
        wadah.appendChild(chip);
    });
}

/**
 * Menambahkan satu blok perintah ke dalam susunan instruksi.
 */
function tambahInstruksi(kodePerintah) {
    if (sedangMenjalankan || tahapKastilSelesai) {
        return;
    }
    if (daftarInstruksi.length >= 16) {
        tampilkanPesanKastil("Maksimal 16 langkah!", "peringatan");
        return;
    }
    daftarInstruksi.push(kodePerintah);
    renderAntreanInstruksi(-1);
}

/**
 * Menghapus seluruh susunan instruksi dan mengembalikan pemain ke posisi awal tahap.
 */
function hapusSemuaInstruksi() {
    if (sedangMenjalankan || tahapKastilSelesai) {
        return;
    }
    const soal = soalSesiKastil[indeksTahapKastil];
    daftarInstruksi = [];
    if (soal) {
        posisiPemain = { baris: soal.awal.baris, kolom: soal.awal.kolom };
    }
    renderAntreanInstruksi(-1);
    renderPapanGridKastil([], null);
    tampilkanPesanKastil("Langkah dihapus. Susun langkah baru!", "info");
}

/**
 * Mengeksekusi susunan instruksi langkah demi langkah pada grid 4 x 4.
 */
function jalankanInstruksiKastil() {
    if (sedangMenjalankan || tahapKastilSelesai) {
        return;
    }

    const soal = soalSesiKastil[indeksTahapKastil];
    if (!soal) {
        return;
    }

    if (daftarInstruksi.length === 0) {
        putarSFX("wrong.mp3");
        tampilkanPesanKastil("Pilih langkah dulu sebelum menekan Jalankan!", "peringatan");
        return;
    }

    sedangMenjalankan = true;
    aturStatusTombolKontrol(true);

    // Kembalikan ke titik awal sebelum mulai simulasi
    posisiPemain = { baris: soal.awal.baris, kolom: soal.awal.kolom };
    const jejak = [{ baris: posisiPemain.baris, kolom: posisiPemain.kolom }];
    renderPapanGridKastil(jejak, null);
    tampilkanPesanKastil("Menjalankan langkah...", "info");

    let langkahKe = 0;

    function eksekusiLangkahBerikutnya() {
        if (langkahKe >= daftarInstruksi.length) {
            // Seluruh instruksi selesai dieksekusi, periksa apakah sampai di tujuan
            if (
                posisiPemain.baris === soal.tujuan.baris &&
                posisiPemain.kolom === soal.tujuan.kolom
            ) {
                sedangMenjalankan = false;
                tahapKastilSelesai = true;
                aturStatusTombolKontrol(true);

                const poinTahap = Math.max(10, 20 - (percobaanGagalTahapIni * 5));
                skorKastil += poinTahap;
                perbaruiStatusKastil();
                renderAntreanInstruksi(-1);

                putarSFX("correct.mp3");
                tampilkanPesanKastil(
                    "Hebat! Kamu berhasil sampai di Tujuan!",
                    "sukses"
                );

                const tombolNext = document.getElementById("tombol-next-kastil");
                if (tombolNext) {
                    tombolNext.classList.remove("tersembunyi");
                    tombolNext.textContent =
                        indeksTahapKastil < 4 ? "Lanjut" : "Selesai";
                }
            } else {
                sedangMenjalankan = false;
                percobaanGagalTahapIni++;
                aturStatusTombolKontrol(false);
                renderAntreanInstruksi(-1);
                putarSFX("wrong.mp3");
                tampilkanPesanKastil(
                    "Belum sampai di Tujuan. Perbaiki langkahmu lalu tekan Jalankan!",
                    "peringatan"
                );
            }
            return;
        }

        const perintah = daftarInstruksi[langkahKe];
        const info = INFO_PERINTAH_KASTIL[perintah];
        renderAntreanInstruksi(langkahKe);

        const barisBaru = posisiPemain.baris + info.dBaris;
        const kolomBaru = posisiPemain.kolom + info.dKolom;

        // 1. Periksa apakah keluar dari batas grid 4 x 4
        if (barisBaru < 0 || barisBaru > 3 || kolomBaru < 0 || kolomBaru > 3) {
            sedangMenjalankan = false;
            percobaanGagalTahapIni++;
            aturStatusTombolKontrol(false);
            renderAntreanInstruksi(-1);
            putarSFX("wrong.mp3");
            tampilkanPesanKastil(
                "Langkah ke-" + (langkahKe + 1) + " keluar dari papan! Tekan Hapus untuk mencoba lagi.",
                "kesalahan"
            );
            return;
        }

        // 2. Periksa apakah menabrak rintangan batu
        if (apakahRintangan(soal, barisBaru, kolomBaru)) {
            posisiPemain = { baris: barisBaru, kolom: kolomBaru };
            renderPapanGridKastil(jejak, { baris: barisBaru, kolom: kolomBaru });
            sedangMenjalankan = false;
            percobaanGagalTahapIni++;
            aturStatusTombolKontrol(false);
            renderAntreanInstruksi(-1);
            putarSFX("wrong.mp3");
            tampilkanPesanKastil(
                "Menabrak batu rintangan! Tekan Hapus dan cari jalan lain.",
                "kesalahan"
            );
            return;
        }

        // Langkah aman
        posisiPemain = { baris: barisBaru, kolom: kolomBaru };
        jejak.push({ baris: barisBaru, kolom: kolomBaru });
        putarSFX("click.mp3");
        renderPapanGridKastil(jejak, null);

        langkahKe++;
        setTimeout(eksekusiLangkahBerikutnya, 420);
    }

    setTimeout(eksekusiLangkahBerikutnya, 400);
}

/**
 * Menampilkan soal pada tahap aktif di halaman Kastil.
 */
function tampilkanSoalKastil() {
    const soal = soalSesiKastil[indeksTahapKastil];
    if (!soal) {
        return;
    }

    percobaanGagalTahapIni = 0;
    daftarInstruksi = [];
    sedangMenjalankan = false;
    tahapKastilSelesai = false;
    posisiPemain = { baris: soal.awal.baris, kolom: soal.awal.kolom };

    const elBadge = document.getElementById("badge-soal-kastil");
    const elInstruksi = document.getElementById("instruksi-soal-kastil");
    const tombolNext = document.getElementById("tombol-next-kastil");

    if (elBadge) {
        elBadge.textContent = "Soal " + (indeksTahapKastil + 1);
    }
    if (elInstruksi) {
        elInstruksi.textContent = soal.instruksi;
    }
    if (tombolNext) {
        tombolNext.classList.add("tersembunyi");
    }

    aturStatusTombolKontrol(false);
    renderAntreanInstruksi(-1);
    renderPapanGridKastil([], null);
    tampilkanPesanKastil(
        "Susun langkah menuju Tujuan, lalu tekan Jalankan.",
        "info"
    );
}

/**
 * Mengambil seluruh soal dari data/kastil.json menggunakan Fetch API.
 */
function muatDataSoalKastil() {
    fetch("data/kastil.json")
        .then(function (respons) {
            if (!respons.ok) {
                throw new Error("Gagal mengambil file data/kastil.json (Status: " + respons.status + ")");
            }
            return respons.json();
        })
        .then(function (data) {
            if (!data || !Array.isArray(data.soal) || data.soal.length < 5) {
                throw new Error("Format data soal Kastil tidak lengkap.");
            }
            const soalTeracak = acakSoalKastil(data.soal);
            soalSesiKastil = soalTeracak.slice(0, 5);
            indeksTahapKastil = 0;
            skorKastil = 0;
            tampilkanSoalKastil();
        })
        .catch(function (kesalahan) {
            console.error(kesalahan);
            tampilkanPesanKastil(
                "Gagal memuat data soal dari data/kastil.json. Pastikan Anda menjalankan game melalui server lokal (seperti Live Server).",
                "kesalahan"
            );
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const elNama = document.getElementById("nama-pemain-kastil");
    if (elNama) {
        elNama.textContent = ambilNamaPemain();
    }

    const daftarTombolArah = document.querySelectorAll(".tombol-blok-arah");
    daftarTombolArah.forEach(function (tombol) {
        tombol.addEventListener("click", function () {
            const arah = tombol.getAttribute("data-arah");
            if (arah) {
                tambahInstruksi(arah);
            }
        });
    });

    const tombolHapus = document.getElementById("tombol-hapus-instruksi");
    if (tombolHapus) {
        tombolHapus.addEventListener("click", hapusSemuaInstruksi);
    }

    const tombolJalankan = document.getElementById("tombol-jalankan-instruksi");
    if (tombolJalankan) {
        tombolJalankan.addEventListener("click", jalankanInstruksiKastil);
    }

    const tombolNext = document.getElementById("tombol-next-kastil");
    if (tombolNext) {
        tombolNext.addEventListener("click", function () {
            if (indeksTahapKastil < soalSesiKastil.length - 1) {
                indeksTahapKastil++;
                tampilkanSoalKastil();
            } else {
                // Setelah lima tahap selesai, skor akhir disimpan lalu membuka hasil.html
                simpanSkor("algoritma", skorKastil);
                simpanProgres("kastil", true);
                pindahHalaman("hasil.html", true);
            }
        });
    }

    muatDataSoalKastil();
});

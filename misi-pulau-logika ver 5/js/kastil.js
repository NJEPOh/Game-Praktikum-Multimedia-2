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
 * Data cadangan 50 soal Kastil (identik dengan data/kastil.json) agar permainan
 * tetap berjalan normal meskipun dibuka langsung melalui protokol file://.
 */
const CADANGAN_SOAL_KASTIL = [
    {
        "id": "kastil-001",
        "instruksi": "Susun langkah dari sudut kiri bawah menuju gerbang di kanan bawah sambil menghindari batu rintangan!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 3,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "maju",
            "kanan",
            "kanan",
            "mundur",
            "kanan"
        ]
    },
    {
        "id": "kastil-002",
        "instruksi": "Arahkan penjelajah dari kiri bawah ke gerbang kanan atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "maju",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-003",
        "instruksi": "Temukan rute aman dari pojok kiri atas menuju gerbang di pojok kanan bawah!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "mundur",
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-004",
        "instruksi": "Bantu penjelajah melewati lorong tengah menuju gerbang tujuan!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 1
        },
        "tujuan": {
            "baris": 0,
            "kolom": 1
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "kiri",
            "maju"
        ]
    },
    {
        "id": "kastil-005",
        "instruksi": "Susun algoritma untuk mencapai gerbang di sudut kiri atas!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 3,
            "kolom": 3
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 3
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "maju",
            "kiri",
            "kiri",
            "maju"
        ]
    },
    {
        "id": "kastil-006",
        "instruksi": "Hindari dua batu penghalang di baris pertama untuk mencapai tujuan!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 1
            },
            {
                "baris": 0,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "mundur",
            "kanan",
            "kanan",
            "kanan",
            "maju"
        ]
    },
    {
        "id": "kastil-007",
        "instruksi": "Arahkan penjelajah dari baris kedua menuju gerbang kastil di kanan bawah!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 1,
            "kolom": 0
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-008",
        "instruksi": "Lewati celah di antara rintangan untuk menuju gerbang di kanan tengah!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 2,
            "kolom": 0
        },
        "tujuan": {
            "baris": 1,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-009",
        "instruksi": "Mulai dari kanan atas, susun instruksi menuju gerbang di kiri bawah!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 0,
            "kolom": 3
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "kiri",
            "kiri",
            "mundur"
        ]
    },
    {
        "id": "kastil-010",
        "instruksi": "Temukan jalan memutar untuk mencapai gerbang di sebelah kanan!",
        "arahAwal": "atas",
        "awal": {
            "baris": 2,
            "kolom": 1
        },
        "tujuan": {
            "baris": 2,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 3,
                "kolom": 2
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "maju",
            "kanan",
            "kanan",
            "mundur"
        ]
    },
    {
        "id": "kastil-011",
        "instruksi": "Bantu penjelajah bergerak dari tengah atas ke pojok kanan bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 1
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 3,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "mundur",
            "kanan"
        ]
    },
    {
        "id": "kastil-012",
        "instruksi": "Capai gerbang di baris paling atas tanpa menyentuh rintangan!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 2
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "kiri",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-013",
        "instruksi": "Susun langkah tepat menuju pintu menara di kanan atas!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 2,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-014",
        "instruksi": "Arahkan penjelajah dari kiri atas menuju tengah bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 3,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kanan",
            "mundur",
            "kanan",
            "mundur",
            "mundur"
        ]
    },
    {
        "id": "kastil-015",
        "instruksi": "Hindari tiga batu penghalang dan capai tujuan di kiri bawah!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 1,
            "kolom": 3
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "mundur",
            "mundur",
            "kiri",
            "kiri",
            "kiri"
        ]
    },
    {
        "id": "kastil-016",
        "instruksi": "Gunakan langkah Maju dan Kanan secara berurutan seperti tangga!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 1,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 3,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "kanan",
            "maju"
        ]
    },
    {
        "id": "kastil-017",
        "instruksi": "Putari dinding batu di tengah papan untuk mencapai gerbang!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 1
        },
        "tujuan": {
            "baris": 1,
            "kolom": 1
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 0,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "maju",
            "kanan"
        ]
    },
    {
        "id": "kastil-018",
        "instruksi": "Temukan jalur dari pojok kanan bawah ke tengah atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 3
        },
        "tujuan": {
            "baris": 0,
            "kolom": 1
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 3
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "kiri",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-019",
        "instruksi": "Bergeraklah dari kiri tengah menuju gerbang di kanan tengah!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 1,
            "kolom": 0
        },
        "tujuan": {
            "baris": 1,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "maju",
            "kanan",
            "kanan",
            "kanan",
            "mundur"
        ]
    },
    {
        "id": "kastil-020",
        "instruksi": "Susun algoritma untuk turun dari kanan atas ke kanan bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 3
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 3
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "kanan",
            "mundur"
        ]
    },
    {
        "id": "kastil-021",
        "instruksi": "Arahkan penjelajah melewati jalur bawah menuju sudut kiri atas!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 2,
            "kolom": 3
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 3
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "mundur",
            "kiri",
            "kiri",
            "kiri",
            "maju",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-022",
        "instruksi": "Capai gerbang di kolom ketiga tanpa menabrak rintangan!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 2,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "mundur",
            "kanan",
            "mundur",
            "kanan"
        ]
    },
    {
        "id": "kastil-023",
        "instruksi": "Susun instruksi dari baris paling bawah menuju pojok kanan atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 1
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            },
            {
                "baris": 0,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "kanan",
            "maju"
        ]
    },
    {
        "id": "kastil-024",
        "instruksi": "Bantu penjelajah mencapai gerbang di sebelah kiri bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 2
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "mundur",
            "kiri"
        ]
    },
    {
        "id": "kastil-025",
        "instruksi": "Susun langkah berliku untuk menembus pertahanan batu kastil!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 1,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-026",
        "instruksi": "Mulai dari tengah papan, capai gerbang di sudut kanan bawah!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 1,
            "kolom": 1
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-027",
        "instruksi": "Cari jalan terdekat dari kiri atas menuju kiri bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "mundur",
            "mundur",
            "mundur",
            "kiri"
        ]
    },
    {
        "id": "kastil-028",
        "instruksi": "Susun langkah menuju gerbang di baris pertama kolom ketiga!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "maju",
            "kanan",
            "maju",
            "maju",
            "kanan"
        ]
    },
    {
        "id": "kastil-029",
        "instruksi": "Arahkan penjelajah dari kanan bawah menuju kiri tengah!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 3,
            "kolom": 3
        },
        "tujuan": {
            "baris": 1,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 3,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "maju",
            "kiri",
            "maju",
            "kiri",
            "kiri"
        ]
    },
    {
        "id": "kastil-030",
        "instruksi": "Capai gerbang di tengah bawah dengan menghindari dua batu!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 1
        },
        "tujuan": {
            "baris": 3,
            "kolom": 1
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "kanan",
            "mundur",
            "mundur",
            "kiri",
            "mundur"
        ]
    },
    {
        "id": "kastil-031",
        "instruksi": "Bergeraklah dari kanan atas menuju tengah kiri tanpa menabrak batu!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 0,
            "kolom": 3
        },
        "tujuan": {
            "baris": 2,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 3,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "mundur",
            "kiri",
            "mundur",
            "kiri",
            "kiri"
        ]
    },
    {
        "id": "kastil-032",
        "instruksi": "Susun algoritma menuju gerbang kastil di pojok kanan atas!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 1,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-033",
        "instruksi": "Pandu penjelajah dari kiri bawah ke baris kedua kolom keempat!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 1,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "kanan",
            "maju",
            "kanan"
        ]
    },
    {
        "id": "kastil-034",
        "instruksi": "Hindari penghalang di tengah untuk mencapai gerbang di kiri atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 2,
            "kolom": 2
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 3,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "kiri",
            "kiri",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-035",
        "instruksi": "Susun langkah dari baris pertama menuju gerbang di baris keempat!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 2
        },
        "tujuan": {
            "baris": 3,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "kanan",
            "mundur",
            "mundur",
            "mundur",
            "kiri"
        ]
    },
    {
        "id": "kastil-036",
        "instruksi": "Temukan rute aman menuju gerbang di pojok kiri bawah!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 0,
            "kolom": 1
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "mundur",
            "kiri",
            "mundur",
            "mundur"
        ]
    },
    {
        "id": "kastil-037",
        "instruksi": "Arahkan penjelajah menuju gerbang di baris ketiga kolom keempat!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 2,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "mundur",
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "kanan",
            "maju"
        ]
    },
    {
        "id": "kastil-038",
        "instruksi": "Dari pojok kiri atas, capai tujuan di baris ketiga kolom keempat!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 2,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kanan",
            "mundur",
            "mundur",
            "kanan",
            "kanan"
        ]
    },
    {
        "id": "kastil-039",
        "instruksi": "Lewati celah di bagian atas untuk menuju gerbang di sebelah kiri!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 2,
            "kolom": 3
        },
        "tujuan": {
            "baris": 2,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "maju",
            "kiri",
            "kiri",
            "kiri",
            "mundur"
        ]
    },
    {
        "id": "kastil-040",
        "instruksi": "Susun langkah dari tengah bawah menuju pojok kiri atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 2
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 3,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "maju",
            "kiri",
            "maju",
            "maju",
            "kiri"
        ]
    },
    {
        "id": "kastil-041",
        "instruksi": "Bantu penjelajah mencapai gerbang di pojok kanan atas melalui jalur bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 1,
            "kolom": 1
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "mundur",
            "mundur",
            "kanan",
            "kanan",
            "maju",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-042",
        "instruksi": "Susun instruksi untuk bergerak dari kanan tengah ke kiri atas!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 1,
            "kolom": 3
        },
        "tujuan": {
            "baris": 0,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 3
            },
            {
                "baris": 1,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "kiri",
            "kiri"
        ]
    },
    {
        "id": "kastil-043",
        "instruksi": "Arahkan penjelajah dari kiri bawah ke tengah atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 0
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 0,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kanan",
            "maju",
            "maju",
            "kanan",
            "maju"
        ]
    },
    {
        "id": "kastil-044",
        "instruksi": "Temukan jalan menuju gerbang di baris keempat kolom kedua!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 3
        },
        "tujuan": {
            "baris": 3,
            "kolom": 1
        },
        "rintangan": [
            {
                "baris": 1,
                "kolom": 3
            },
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "kiri",
            "mundur",
            "mundur"
        ]
    },
    {
        "id": "kastil-045",
        "instruksi": "Capai gerbang di kanan bawah dari posisi awal di tengah atas!",
        "arahAwal": "kanan",
        "awal": {
            "baris": 0,
            "kolom": 1
        },
        "tujuan": {
            "baris": 3,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "mundur",
            "kanan",
            "mundur",
            "mundur",
            "kanan"
        ]
    },
    {
        "id": "kastil-046",
        "instruksi": "Susun algoritma untuk melewati lorong berliku menuju tujuan!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 3
        },
        "tujuan": {
            "baris": 0,
            "kolom": 2
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 3
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 1
            }
        ],
        "contohSolusi": [
            "kiri",
            "maju",
            "maju",
            "maju"
        ]
    },
    {
        "id": "kastil-047",
        "instruksi": "Bantu penjelajah mencapai gerbang di baris kedua kolom pertama!",
        "arahAwal": "kiri",
        "awal": {
            "baris": 3,
            "kolom": 2
        },
        "tujuan": {
            "baris": 1,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 3,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 2
            },
            {
                "baris": 2,
                "kolom": 0
            }
        ],
        "contohSolusi": [
            "maju",
            "kiri",
            "maju",
            "kiri"
        ]
    },
    {
        "id": "kastil-048",
        "instruksi": "Arahkan penjelajah dari kiri atas menuju gerbang di kanan tengah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 0,
            "kolom": 0
        },
        "tujuan": {
            "baris": 2,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 0,
                "kolom": 1
            },
            {
                "baris": 2,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 3
            }
        ],
        "contohSolusi": [
            "mundur",
            "kanan",
            "kanan",
            "mundur",
            "kanan"
        ]
    },
    {
        "id": "kastil-049",
        "instruksi": "Hindari rintangan batu untuk mencapai gerbang di pojok kiri bawah!",
        "arahAwal": "bawah",
        "awal": {
            "baris": 1,
            "kolom": 2
        },
        "tujuan": {
            "baris": 3,
            "kolom": 0
        },
        "rintangan": [
            {
                "baris": 2,
                "kolom": 2
            },
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 3,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "kiri",
            "mundur",
            "mundur",
            "kiri"
        ]
    },
    {
        "id": "kastil-050",
        "instruksi": "Misi terakhir Kastil! Susun langkah dari kiri bawah ke gerbang utama di kanan atas!",
        "arahAwal": "atas",
        "awal": {
            "baris": 3,
            "kolom": 0
        },
        "tujuan": {
            "baris": 0,
            "kolom": 3
        },
        "rintangan": [
            {
                "baris": 3,
                "kolom": 1
            },
            {
                "baris": 1,
                "kolom": 0
            },
            {
                "baris": 1,
                "kolom": 2
            }
        ],
        "contohSolusi": [
            "maju",
            "kanan",
            "kanan",
            "kanan",
            "maju",
            "maju"
        ]
    }
];

/**
 * Menginisialisasi sesi 5 tahap soal Kastil dari daftar soal yang tersedia.
 */
function mulaiSesiSoalKastil(daftarSoal) {
    const soalTeracak = acakSoalKastil(daftarSoal);
    soalSesiKastil = soalTeracak.slice(0, 5);
    indeksTahapKastil = 0;
    skorKastil = 0;
    tampilkanSoalKastil();
}

/**
 * Mengambil seluruh soal dari data/kastil.json menggunakan Fetch API,
 * dengan fallback otomatis ke CADANGAN_SOAL_KASTIL jika dibuka melalui file://.
 */
function muatDataSoalKastil() {
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
        mulaiSesiSoalKastil(CADANGAN_SOAL_KASTIL);
        return;
    }

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
            mulaiSesiSoalKastil(data.soal);
        })
        .catch(function () {
            if (Array.isArray(CADANGAN_SOAL_KASTIL) && CADANGAN_SOAL_KASTIL.length >= 5) {
                mulaiSesiSoalKastil(CADANGAN_SOAL_KASTIL);
                return;
            }
            tampilkanPesanKastil(
                "Gagal memuat data soal Kastil.",
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

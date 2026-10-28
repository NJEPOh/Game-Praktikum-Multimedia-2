/**
 * File: js/menu.js
 * Deskripsi: Mengelola logika interaksi pada Halaman Awal (index.html),
 * Halaman Narasi (narasi.html), Halaman Petunjuk (petunjuk.html),
 * Halaman Peta Pulau (peta.html), serta fitur Reset Progress Pemain.
 */

/**
 * Memperbarui tampilan informasi progres tersimpan pada Halaman Awal (index.html).
 */
function perbaruiTampilanProgresAwal() {
    const inputNama = document.getElementById("input-nama-pemain");
    const infoProgres = document.getElementById("info-progres-awal");

    if (!inputNama) {
        return;
    }

    const data = ambilDataPermainan();
    const adaProgres = typeof apakahAdaProgresTersimpan === "function"
        ? apakahAdaProgresTersimpan()
        : Boolean(data.namaPemain);

    if (adaProgres) {
        inputNama.value = data.namaPemain || "";
        if (infoProgres) {
            const daftarWilayah = ["hutan", "desa", "gunung", "kastil"];
            let selesai = 0;
            daftarWilayah.forEach(function (w) {
                if (data.progres && data.progres[w]) {
                    selesai++;
                }
            });
            const namaTampil = data.namaPemain || "Penjelajah";
            const totalPersen = typeof hitungTotalPersentaseSkor === "function"
                ? hitungTotalPersentaseSkor()
                : 0;
            infoProgres.innerHTML =
                "Progres Tersimpan: <span>" +
                namaTampil +
                " (" +
                selesai +
                "/4 Wilayah | Skor: " +
                totalPersen +
                "%)</span>";
        }
    } else {
        inputNama.value = "";
        if (infoProgres) {
            infoProgres.innerHTML = "Status Progres: <span>Belum ada progres tersimpan</span>";
        }
    }
}

/**
 * Menampilkan pesan notifikasi pada Halaman Awal (index.html).
 */
function tampilkanPesanHalamanAwal(teks, jenis) {
    const kotakPesan = document.getElementById("pesan-validasi-awal");
    if (!kotakPesan) {
        return;
    }
    kotakPesan.textContent = teks;
    kotakPesan.className = "kotak-pesan pesan-" + (jenis || "peringatan");
}

/**
 * Inisialisasi Halaman Awal (index.html).
 */
function inisialisasiHalamanAwal() {
    const inputNama = document.getElementById("input-nama-pemain");
    const tombolMulai = document.getElementById("tombol-mulai");
    const tombolPetunjuk = document.getElementById("tombol-petunjuk");

    if (!inputNama || !tombolMulai) {
        return;
    }

    perbaruiTampilanProgresAwal();

    // Tampilkan notifikasi jika pemain baru saja melakukan reset dari halaman lain
    if (typeof ambilDanHapusNotifikasiReset === "function" && ambilDanHapusNotifikasiReset()) {
        tampilkanPesanHalamanAwal(
            "Progres permainan berhasil direset! Seluruh skor dan wilayah telah kembali ke kondisi awal.",
            "sukses"
        );
    }

    function mulaiPermainan() {
        const nama = inputNama.value.trim();
        if (!nama) {
            putarSFX("wrong.mp3");
            tampilkanPesanHalamanAwal(
                "Silakan masukkan nama penjelajah terlebih dahulu sebelum memulai permainan!",
                "peringatan"
            );
            inputNama.focus();
            return;
        }

        simpanNamaPemain(nama);
        // BGM halaman awal dihentikan ketika pemain berpindah halaman
        pindahHalaman("narasi.html", true);
    }

    tombolMulai.addEventListener("click", mulaiPermainan);

    inputNama.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            putarSFX("click.mp3");
            mulaiPermainan();
        }
    });

    if (tombolPetunjuk) {
        tombolPetunjuk.addEventListener("click", function () {
            const nama = inputNama.value.trim();
            if (nama) {
                simpanNamaPemain(nama);
            }
            // BGM halaman awal dihentikan ketika pemain berpindah halaman
            pindahHalaman("petunjuk.html", true);
        });
    }
}

/**
 * Inisialisasi tombol "Reset Progress" dan dialog konfirmasi modal.
 */
function inisialisasiFiturResetProgres() {
    const tombolReset = document.getElementById("tombol-reset-progres");
    const modalReset = document.getElementById("modal-konfirmasi-reset");
    const tombolBatal = document.getElementById("tombol-batal-reset");
    const tombolKonfirmasi = document.getElementById("tombol-konfirmasi-reset");

    if (!tombolReset || !modalReset || !tombolBatal || !tombolKonfirmasi) {
        return;
    }

    function bukaDialogReset() {
        modalReset.classList.remove("tersembunyi");
        tombolBatal.focus();
    }

    function tutupDialogReset() {
        modalReset.classList.add("tersembunyi");
        tombolReset.focus();
    }

    tombolReset.addEventListener("click", function () {
        bukaDialogReset();
    });

    // Pilihan "Batal": tutup dialog tanpa mengubah data apa pun
    tombolBatal.addEventListener("click", function () {
        tutupDialogReset();
    });

    // Klik di luar kotak dialog juga membatalkan reset dengan aman
    modalReset.addEventListener("click", function (event) {
        if (event.target === modalReset) {
            putarSFX("click.mp3");
            tutupDialogReset();
        }
    });

    // Tombol Escape pada keyboard menutup dialog tanpa mereset data
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modalReset.classList.contains("tersembunyi")) {
            tutupDialogReset();
        }
    });

    // Pilihan "Ya, Reset Progress": hapus data progres permainan dan kembalikan ke kondisi awal
    tombolKonfirmasi.addEventListener("click", function () {
        resetPermainan();
        tutupDialogReset();
        putarSFX("correct.mp3");

        const sedangDiHalamanAwal = Boolean(document.getElementById("input-nama-pemain"));
        if (sedangDiHalamanAwal) {
            perbaruiTampilanProgresAwal();
            tampilkanPesanHalamanAwal(
                "Progres permainan berhasil direset! Seluruh skor dan wilayah telah kembali ke kondisi awal.",
                "sukses"
            );
        } else {
            if (typeof tandaiNotifikasiReset === "function") {
                tandaiNotifikasiReset();
            }
            pindahHalaman("index.html", true);
        }
    });
}

/**
 * Inisialisasi Halaman Narasi (narasi.html).
 * Menampilkan narasi karakter dalam tiga bagian menggunakan tombol Next dan Back.
 */
function inisialisasiHalamanNarasi() {
    const teksDialog = document.getElementById("teks-dialog");
    const namaPembicara = document.getElementById("nama-pembicara");
    const labelBagian = document.getElementById("label-bagian-narasi");
    const tombolBack = document.getElementById("tombol-narasi-back");
    const tombolNext = document.getElementById("tombol-narasi-next");
    const kartuPemain = document.getElementById("kartu-narasi-pemain");
    const kartuPemandu = document.getElementById("kartu-narasi-pemandu");
    const labelNamaPemainKartu = document.getElementById("label-nama-pemain-narasi");

    if (!teksDialog || !tombolBack || !tombolNext) {
        return;
    }

    const namaPemain = ambilNamaPemain();
    if (labelNamaPemainKartu) {
        labelNamaPemainKartu.textContent = namaPemain;
    }

    const daftarNarasi = [
        {
            bagian: "Bagian 1 dari 3",
            pembicara: "Tetua Arka (Pemandu Pulau)",
            fokusKarakter: "pemandu",
            isi: "Selamat datang di Pulau Logika, Penjelajah " + namaPemain + "! Pulau ini dahulu memiliki jalur yang terhubung rapi hingga menuju Kastil Pengetahuan, namun badai kabut telah mengacaukan keempat wilayah di pulau ini."
        },
        {
            bagian: "Bagian 2 dari 3",
            pembicara: namaPemain + " (Penjelajah)",
            fokusKarakter: "pemain",
            isi: "Aku siap membantu memulihkan Pulau Logika, Tetua Arka! Apa yang harus kulakukan di Hutan, Desa, Gunung, dan Kastil agar gerbang utama terbuka kembali?"
        },
        {
            bagian: "Bagian 3 dari 3",
            pembicara: "Tetua Arka (Pemandu Pulau)",
            fokusKarakter: "pemandu",
            isi: "Gunakan empat kekuatan Berpikir Komputasional! Di Hutan, pecah bangunan besar menjadi bagian kecil (Dekomposisi). Di Desa, lengkapi pola jalan yang hilang (Pengenalan Pola). Di Gunung, pilah barang penting dari gangguan (Abstraksi). Terakhir di Kastil, susun langkah instruksi yang tepat (Algoritma)!"
        }
    ];

    let indeksSekarang = 0;

    function perbaruiTampilanNarasi() {
        const dataBagian = daftarNarasi[indeksSekarang];
        labelBagian.textContent = dataBagian.bagian;
        namaPembicara.textContent = dataBagian.pembicara;
        teksDialog.textContent = dataBagian.isi;

        // Sorot kartu karakter yang sedang berbicara
        if (kartuPemain && kartuPemandu) {
            kartuPemain.classList.toggle("pembicara-aktif", dataBagian.fokusKarakter === "pemain");
            kartuPemandu.classList.toggle("pembicara-aktif", dataBagian.fokusKarakter === "pemandu");
        }

        // Perbarui indikator titik
        for (let i = 0; i < 3; i++) {
            const titik = document.getElementById("titik-narasi-" + i);
            if (titik) {
                titik.classList.toggle("aktif", i === indeksSekarang);
            }
        }

        tombolBack.disabled = indeksSekarang === 0;

        if (indeksSekarang === daftarNarasi.length - 1) {
            tombolNext.textContent = "Buka Peta Pulau";
            tombolNext.className = "tombol tombol-aksen";
        } else {
            tombolNext.textContent = "Next";
            tombolNext.className = "tombol tombol-utama";
        }
    }

    tombolBack.addEventListener("click", function () {
        if (indeksSekarang > 0) {
            indeksSekarang--;
            perbaruiTampilanNarasi();
        }
    });

    tombolNext.addEventListener("click", function () {
        if (indeksSekarang < daftarNarasi.length - 1) {
            indeksSekarang++;
            perbaruiTampilanNarasi();
        } else {
            // BGM Background 2 tetap berlanjut ke halaman peta.html
            pindahHalaman("peta.html", false);
        }
    });

    perbaruiTampilanNarasi();
}

/**
 * Inisialisasi Halaman Petunjuk (petunjuk.html).
 */
function inisialisasiHalamanPetunjuk() {
    const tombolKembali = document.getElementById("tombol-petunjuk-kembali");
    const tombolMengerti = document.getElementById("tombol-petunjuk-mengerti");

    if (tombolKembali) {
        tombolKembali.addEventListener("click", function () {
            // Kembali ke halaman awal, hentikan BGM Background 2 agar Background 1 mulai baru
            pindahHalaman("index.html", true);
        });
    }

    if (tombolMengerti) {
        tombolMengerti.addEventListener("click", function () {
            // BGM Background 2 tetap berlanjut ke halaman peta.html
            pindahHalaman("peta.html", false);
        });
    }
}

/**
 * Inisialisasi Halaman Peta Pulau (peta.html).
 */
function inisialisasiHalamanPeta() {
    const elemenNamaPemain = document.getElementById("nama-pemain-peta");
    const elemenProgresRingkas = document.getElementById("ringkasan-progres-peta");
    const kotakPesanPeta = document.getElementById("pesan-peta");
    const tombolHasilLangsung = document.getElementById("tombol-lihat-hasil-peta");

    const kartuHutan = document.getElementById("wilayah-hutan");
    if (!kartuHutan) {
        return;
    }

    const namaPemain = ambilNamaPemain();
    const progres = ambilProgres();

    if (elemenNamaPemain) {
        elemenNamaPemain.textContent = namaPemain;
    }

    const konfigurasiWilayah = [
        {
            idKartu: "wilayah-hutan",
            idStatusTeks: "status-teks-hutan",
            idIkonStatus: "ikon-status-hutan",
            nama: "Hutan",
            halaman: "hutan.html",
            terbuka: true,
            selesai: Boolean(progres.hutan),
            syaratTeks: ""
        },
        {
            idKartu: "wilayah-desa",
            idStatusTeks: "status-teks-desa",
            idIkonStatus: "ikon-status-desa",
            nama: "Desa",
            halaman: "desa.html",
            terbuka: Boolean(progres.hutan),
            selesai: Boolean(progres.desa),
            syaratTeks: "Selesaikan misi di wilayah Hutan terlebih dahulu untuk membuka wilayah Desa!"
        },
        {
            idKartu: "wilayah-gunung",
            idStatusTeks: "status-teks-gunung",
            idIkonStatus: "ikon-status-gunung",
            nama: "Gunung",
            halaman: "gunung.html",
            terbuka: Boolean(progres.desa),
            selesai: Boolean(progres.gunung),
            syaratTeks: "Selesaikan misi di wilayah Desa terlebih dahulu untuk membuka wilayah Gunung!"
        },
        {
            idKartu: "wilayah-kastil",
            idStatusTeks: "status-teks-kastil",
            idIkonStatus: "ikon-status-kastil",
            nama: "Kastil",
            halaman: "kastil.html",
            terbuka: Boolean(progres.gunung),
            selesai: Boolean(progres.kastil),
            syaratTeks: "Selesaikan misi di wilayah Gunung terlebih dahulu untuk membuka wilayah Kastil!"
        }
    ];

    let jumlahSelesai = 0;

    konfigurasiWilayah.forEach(function (wilayah) {
        if (wilayah.selesai) {
            jumlahSelesai++;
        }

        const kartu = document.getElementById(wilayah.idKartu);
        const teksStatus = document.getElementById(wilayah.idStatusTeks);
        const ikonStatus = document.getElementById(wilayah.idIkonStatus);

        if (!kartu || !teksStatus || !ikonStatus) {
            return;
        }

        kartu.classList.remove("wilayah-terkunci", "wilayah-selesai");

        if (wilayah.selesai) {
            kartu.classList.add("wilayah-selesai");
            teksStatus.textContent = "Selesai (Mainkan Ulang)";
            ikonStatus.setAttribute("src", "assets/images/icons/ikon_selesai.png");
            ikonStatus.setAttribute("alt", "Status wilayah selesai");
            ikonStatus.classList.remove("tersembunyi");
        } else if (wilayah.terbuka) {
            teksStatus.textContent = "Terbuka - Klik untuk Masuk";
            ikonStatus.classList.add("tersembunyi");
        } else {
            kartu.classList.add("wilayah-terkunci");
            teksStatus.textContent = "Terkunci";
            ikonStatus.setAttribute("src", "assets/images/icons/ikon_gembok.png");
            ikonStatus.setAttribute("alt", "Status wilayah terkunci");
            ikonStatus.classList.remove("tersembunyi");
        }

        kartu.addEventListener("click", function () {
            if (!wilayah.terbuka) {
                putarSFX("wrong.mp3");
                if (kotakPesanPeta) {
                    kotakPesanPeta.textContent = wilayah.syaratTeks;
                    kotakPesanPeta.className = "kotak-pesan pesan-peringatan";
                }
                return;
            }

            // BGM peta dihentikan ketika pemain memasuki wilayah permainan
            pindahHalaman(wilayah.halaman, true);
        });
    });

    if (elemenProgresRingkas) {
        elemenProgresRingkas.textContent = jumlahSelesai + " dari 4 Wilayah Selesai";
    }

    if (tombolHasilLangsung) {
        if (jumlahSelesai === 4) {
            tombolHasilLangsung.classList.remove("tersembunyi");
            tombolHasilLangsung.addEventListener("click", function () {
                pindahHalaman("hasil.html", true);
            }
            );
        } else {
            tombolHasilLangsung.classList.add("tersembunyi");
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    inisialisasiHalamanAwal();
    inisialisasiFiturResetProgres();
    inisialisasiHalamanNarasi();
    inisialisasiHalamanPetunjuk();
    inisialisasiHalamanPeta();
});

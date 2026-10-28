/**
 * File: js/gunung.js
 * Deskripsi: Mekanik permainan Wilayah Gunung (Pilar Abstraksi).
 * Mengambil 50 soal dari data/gunung.json menggunakan Fetch API, mengacak dan memilih
 * 5 soal untuk 5 tahap, serta mengelola pemilahan objek ke kategori Penting dan Tidak Penting.
 */

let soalSesiGunung = [];
let indeksTahapGunung = 0;
let skorGunung = 0;
let kesalahanTahapGunung = 0;
let jumlahObjekTersusun = 0;
let objekTahapAktif = [];

/**
 * Mengacak urutan array menggunakan algoritma Fisher-Yates.
 */
function acakArrayGunung(daftar) {
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
 * Memperbarui indikator tahap, progres objek, dan skor di halaman Gunung.
 */
function perbaruiStatusGunung() {
    const elTahap = document.getElementById("indikator-tahap-gunung");
    const elObjek = document.getElementById("indikator-objek-gunung");
    const elSkor = document.getElementById("indikator-skor-gunung");

    if (elTahap) {
        elTahap.textContent = (indeksTahapGunung + 1) + "/5";
    }
    if (elObjek) {
        elObjek.textContent = jumlahObjekTersusun + "/" + objekTahapAktif.length;
    }
    if (elSkor) {
        elSkor.textContent = String(skorGunung);
    }
}

/**
 * Menampilkan pesan umpan balik di halaman Gunung.
 */
function tampilkanPesanGunung(teks, jenis) {
    const kotakPesan = document.getElementById("pesan-umpan-balik-gunung");
    if (!kotakPesan) {
        return;
    }
    kotakPesan.textContent = teks;
    kotakPesan.className = "kotak-pesan pesan-" + (jenis || "info");
}

/**
 * Memproses klasifikasi satu objek ke kategori tujuan ('penting' atau 'tidak_penting').
 */
function klasifikasikanObjekGunung(indeksObjek, kategoriPilihan) {
    const dataObjek = objekTahapAktif[indeksObjek];
    const kartu = document.querySelector('.kartu-objek-gunung[data-indeks-objek="' + indeksObjek + '"]');

    if (!dataObjek || !kartu || kartu.classList.contains("sudah-diklasifikasi")) {
        return;
    }

    putarSFX("drop.mp3");

    if (dataObjek.kategori === kategoriPilihan) {
        kartu.classList.add("sudah-diklasifikasi");
        kartu.setAttribute("draggable", "false");

        const wadahTarget = document.getElementById(
            kategoriPilihan === "penting" ? "daftar-isi-penting" : "daftar-isi-tidak-penting"
        );

        if (wadahTarget) {
            const barisItem = document.createElement("div");
            barisItem.className = "item-terklasifikasi";

            if (kategoriPilihan === "penting") {
                barisItem.innerHTML =
                    "<!-- Gambar 46: objek_penting.png | Ukuran tampilan: 40x40 px | Aset: assets/images/objects/objek_penting.png -->" +
                    '<img src="assets/images/objects/objek_penting.png" alt="Objek penting" width="40" height="40">' +
                    "<span>" + dataObjek.nama + "</span>";
            } else {
                barisItem.innerHTML =
                    "<!-- Gambar 47: objek_tidak_penting.png | Ukuran tampilan: 40x40 px | Aset: assets/images/objects/objek_tidak_penting.png -->" +
                    '<img src="assets/images/objects/objek_tidak_penting.png" alt="Objek tidak penting" width="40" height="40">' +
                    "<span>" + dataObjek.nama + "</span>";
            }

            wadahTarget.appendChild(barisItem);
        }

        jumlahObjekTersusun++;
        putarSFX("correct.mp3");

        const soal = soalSesiGunung[indeksTahapGunung];

        if (jumlahObjekTersusun === objekTahapAktif.length) {
            const poinTahap = Math.max(10, 20 - (kesalahanTahapGunung * 5));
            skorGunung += poinTahap;
            perbaruiStatusGunung();

            tampilkanPesanGunung("Hebat! " + soal.penjelasan, "sukses");

            const tombolNext = document.getElementById("tombol-next-gunung");
            if (tombolNext) {
                tombolNext.classList.remove("tersembunyi");
                tombolNext.textContent =
                    indeksTahapGunung < 4 ? "Lanjut" : "Selesai";
            }
        } else {
            perbaruiStatusGunung();
            tampilkanPesanGunung(
                'Benar! "' + dataObjek.nama + '" sudah masuk ke kotak yang tepat.',
                "sukses"
            );
        }
    } else {
        kesalahanTahapGunung++;
        putarSFX("wrong.mp3");
        tampilkanPesanGunung(
            'Belum tepat untuk "' + dataObjek.nama + '". Coba pilih kotak yang satunya ya!',
            "kesalahan"
        );
    }
}

/**
 * Menampilkan soal pada tahap aktif di halaman Gunung.
 */
function tampilkanSoalGunung() {
    const soal = soalSesiGunung[indeksTahapGunung];
    if (!soal) {
        return;
    }

    kesalahanTahapGunung = 0;
    jumlahObjekTersusun = 0;
    objekTahapAktif = acakArrayGunung(soal.objek);

    const elIdSoal = document.getElementById("id-soal-gunung");
    const elKonteks = document.getElementById("judul-konteks-gunung");
    const elInstruksi = document.getElementById("instruksi-soal-gunung");
    const wadahObjek = document.getElementById("wadah-objek-gunung");
    const daftarPenting = document.getElementById("daftar-isi-penting");
    const daftarTidakPenting = document.getElementById("daftar-isi-tidak-penting");
    const tombolNext = document.getElementById("tombol-next-gunung");

    if (elIdSoal) {
        elIdSoal.textContent = "Tujuan Misi";
    }
    if (elKonteks) {
        elKonteks.textContent = soal.konteks;
    }
    if (elInstruksi) {
        elInstruksi.textContent = "Pilih benda yang Penting dan Tidak Penting.";
    }
    if (daftarPenting) {
        daftarPenting.innerHTML = "";
    }
    if (daftarTidakPenting) {
        daftarTidakPenting.innerHTML = "";
    }
    if (tombolNext) {
        tombolNext.classList.add("tersembunyi");
    }

    tampilkanPesanGunung(
        "Tekan tombol Penting atau Tidak Penting pada setiap benda.",
        "info"
    );

    wadahObjek.innerHTML = "";
    objekTahapAktif.forEach(function (item, indeks) {
        const kartu = document.createElement("div");
        kartu.className = "kartu-objek-gunung";
        kartu.setAttribute("draggable", "true");
        kartu.setAttribute("data-indeks-objek", String(indeks));
        kartu.setAttribute("data-sfx-hover", "");

        kartu.innerHTML =
            "<!-- Gambar 46: objek_penting.png | Ukuran tampilan: 72x72 px | Aset: assets/images/objects/objek_penting.png -->" +
            '<img src="assets/images/objects/objek_penting.png" alt="Objek ' + item.nama + '" width="72" height="72" draggable="false">' +
            '<div class="nama-objek-gunung">' + item.nama + "</div>" +
            '<div class="aksi-cepat-objek">' +
            '<button type="button" class="tombol-pilih-kategori tombol-pilih-penting" data-sfx-hover data-sfx-click>Penting</button>' +
            '<button type="button" class="tombol-pilih-kategori tombol-pilih-tidak-penting" data-sfx-hover data-sfx-click>Tidak Penting</button>' +
            "</div>";

        kartu.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", String(indeks));
        });

        const btnPenting = kartu.querySelector(".tombol-pilih-penting");
        const btnTidakPenting = kartu.querySelector(".tombol-pilih-tidak-penting");

        btnPenting.addEventListener("click", function () {
            klasifikasikanObjekGunung(indeks, "penting");
        });

        btnTidakPenting.addEventListener("click", function () {
            klasifikasikanObjekGunung(indeks, "tidak_penting");
        });

        wadahObjek.appendChild(kartu);
    });

    perbaruiStatusGunung();
}

/**
 * Memasang event drag and drop pada kotak kategori Penting dan Tidak Penting.
 */
function siapkanDropZoneGunung() {
    const konfigurasiKotak = [
        { id: "kotak-drop-penting", kategori: "penting" },
        { id: "kotak-drop-tidak-penting", kategori: "tidak_penting" }
    ];

    konfigurasiKotak.forEach(function (info) {
        const kotak = document.getElementById(info.id);
        if (!kotak) {
            return;
        }

        kotak.addEventListener("dragover", function (event) {
            event.preventDefault();
            kotak.classList.add("sorot-drop");
        });

        kotak.addEventListener("dragleave", function () {
            kotak.classList.remove("sorot-drop");
        });

        kotak.addEventListener("drop", function (event) {
            event.preventDefault();
            kotak.classList.remove("sorot-drop");
            const teksIndeks = event.dataTransfer.getData("text/plain");
            const indeks = parseInt(teksIndeks, 10);
            if (!isNaN(indeks)) {
                klasifikasikanObjekGunung(indeks, info.kategori);
            }
        });
    });
}

/**
 * Mengambil seluruh soal dari data/gunung.json menggunakan Fetch API.
 */
function muatDataSoalGunung() {
    fetch("data/gunung.json")
        .then(function (respons) {
            if (!respons.ok) {
                throw new Error("Gagal mengambil file data/gunung.json (Status: " + respons.status + ")");
            }
            return respons.json();
        })
        .then(function (data) {
            if (!data || !Array.isArray(data.soal) || data.soal.length < 5) {
                throw new Error("Format data soal Gunung tidak lengkap.");
            }
            const soalTeracak = acakArrayGunung(data.soal);
            soalSesiGunung = soalTeracak.slice(0, 5);
            indeksTahapGunung = 0;
            skorGunung = 0;
            tampilkanSoalGunung();
        })
        .catch(function (kesalahan) {
            console.error(kesalahan);
            tampilkanPesanGunung(
                "Gagal memuat data soal dari data/gunung.json. Pastikan Anda menjalankan game melalui server lokal (seperti Live Server).",
                "kesalahan"
            );
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const elNama = document.getElementById("nama-pemain-gunung");
    if (elNama) {
        elNama.textContent = ambilNamaPemain();
    }

    siapkanDropZoneGunung();

    const tombolNext = document.getElementById("tombol-next-gunung");
    if (tombolNext) {
        tombolNext.addEventListener("click", function () {
            if (indeksTahapGunung < soalSesiGunung.length - 1) {
                indeksTahapGunung++;
                tampilkanSoalGunung();
            } else {
                simpanSkor("abstraksi", skorGunung);
                simpanProgres("gunung", true);
                pindahHalaman("peta.html", true);
            }
        });
    }

    muatDataSoalGunung();
});

/**
 * File: js/hutan.js
 * Deskripsi: Mekanik permainan Wilayah Hutan (Pilar Dekomposisi).
 * Pemain memecah pembangunan rumah menjadi komponen-komponen kecil dalam 3 tahap,
 * menyeret (drag and drop) atau memilih material yang sesuai, serta menghindari pengecoh.
 */

const TAHAP_HUTAN = [
    {
        nomorTahap: 1,
        judulTahap: "Tahap 1: Rangka Bawah & Pondasi Rumah",
        deskripsi: "Pecah kebutuhan bagian bawah rumah menjadi 3 komponen utama. Seret material yang tepat ke bagian rumah yang sesuai dan hindari material pengecoh!",
        komponenTarget: [
            {
                id: "pondasi",
                namaBagian: "Bagian Pondasi Dasar",
                namaMaterial: "Pondasi Batu",
                nomorGambar: 19,
                fileGambar: "rumah_pondasi.png",
                jalurGambar: "assets/images/objects/rumah_pondasi.png"
            },
            {
                id: "lantai",
                namaBagian: "Bagian Lantai Rumah",
                namaMaterial: "Lantai Kayu",
                nomorGambar: 20,
                fileGambar: "rumah_lantai.png",
                jalurGambar: "assets/images/objects/rumah_lantai.png"
            },
            {
                id: "tiang",
                namaBagian: "Bagian Tiang Penyangga",
                namaMaterial: "Tiang Kayu",
                nomorGambar: 21,
                fileGambar: "rumah_tiang.png",
                jalurGambar: "assets/images/objects/rumah_tiang.png"
            }
        ],
        pengecoh: {
            id: "pengecoh_ban",
            namaMaterial: "Ban Bekas",
            nomorGambar: 22,
            fileGambar: "pengecoh_ban.png",
            jalurGambar: "assets/images/objects/pengecoh_ban.png"
        }
    },
    {
        nomorTahap: 2,
        judulTahap: "Tahap 2: Dinding & Bukaan Rumah",
        deskripsi: "Sekarang susun 4 komponen pembentuk badan rumah. Perhatikan fungsi setiap komponen dan jangan gunakan barang pengecoh!",
        komponenTarget: [
            {
                id: "dinding_kiri",
                namaBagian: "Bagian Dinding Kiri",
                namaMaterial: "Dinding Papan Kiri",
                nomorGambar: 23,
                fileGambar: "rumah_dinding_kiri.png",
                jalurGambar: "assets/images/objects/rumah_dinding_kiri.png"
            },
            {
                id: "dinding_kanan",
                namaBagian: "Bagian Dinding Kanan",
                namaMaterial: "Dinding Papan Kanan",
                nomorGambar: 24,
                fileGambar: "rumah_dinding_kanan.png",
                jalurGambar: "assets/images/objects/rumah_dinding_kanan.png"
            },
            {
                id: "pintu",
                namaBagian: "Bagian Pintu Masuk",
                namaMaterial: "Pintu Utama",
                nomorGambar: 25,
                fileGambar: "rumah_pintu.png",
                jalurGambar: "assets/images/objects/rumah_pintu.png"
            },
            {
                id: "jendela",
                namaBagian: "Bagian Jendela Udara",
                namaMaterial: "Jendela Kayu",
                nomorGambar: 26,
                fileGambar: "rumah_jendela.png",
                jalurGambar: "assets/images/objects/rumah_jendela.png"
            }
        ],
        pengecoh: {
            id: "pengecoh_payung",
            namaMaterial: "Payung Rusak",
            nomorGambar: 27,
            fileGambar: "pengecoh_payung.png",
            jalurGambar: "assets/images/objects/pengecoh_payung.png"
        }
    },
    {
        nomorTahap: 3,
        judulTahap: "Tahap 3: Atap & Penyelesaian Rumah Lengkap",
        deskripsi: "Tahap terakhir! Tempatkan 5 komponen bagian atas dan pelengkap rumah agar rumah pos penjelajah berdiri utuh.",
        komponenTarget: [
            {
                id: "rangka_atap",
                namaBagian: "Bagian Rangka Atap",
                namaMaterial: "Rangka Atap Kayu",
                nomorGambar: 28,
                fileGambar: "rumah_rangka_atap.png",
                jalurGambar: "assets/images/objects/rumah_rangka_atap.png"
            },
            {
                id: "genteng",
                namaBagian: "Bagian Penutup Atap",
                namaMaterial: "Atap Genteng",
                nomorGambar: 29,
                fileGambar: "rumah_genteng.png",
                jalurGambar: "assets/images/objects/rumah_genteng.png"
            },
            {
                id: "cerobong",
                namaBagian: "Bagian Cerobong Asap",
                namaMaterial: "Cerobong Bata",
                nomorGambar: 30,
                fileGambar: "rumah_cerobong.png",
                jalurGambar: "assets/images/objects/rumah_cerobong.png"
            },
            {
                id: "tangga",
                namaBagian: "Bagian Tangga Teras",
                namaMaterial: "Tangga Kayu",
                nomorGambar: 31,
                fileGambar: "rumah_tangga.png",
                jalurGambar: "assets/images/objects/rumah_tangga.png"
            },
            {
                id: "pagar",
                namaBagian: "Bagian Pagar Halaman",
                namaMaterial: "Pagar Kayu",
                nomorGambar: 32,
                fileGambar: "rumah_pagar.png",
                jalurGambar: "assets/images/objects/rumah_pagar.png"
            }
        ],
        pengecoh: {
            id: "pengecoh_ember",
            namaMaterial: "Ember Bocor",
            nomorGambar: 33,
            fileGambar: "pengecoh_ember.png",
            jalurGambar: "assets/images/objects/pengecoh_ember.png"
        }
    }
];

let indeksTahapHutan = 0;
let jumlahKomponenTerpasang = 0;
let jumlahKesalahanHutan = 0;
let idMaterialSedangDipilih = null;

/**
 * Mengacak urutan elemen di dalam array (Fisher-Yates Shuffle).
 */
function acakArray(daftar) {
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
 * Menghitung skor Dekomposisi saat ini berdasarkan ketepatan penempatan komponen.
 * Setiap kesalahan mengurangi 5 poin dari nilai maksimum 100 (minimal 20).
 */
function hitungSkorDekomposisi() {
    const pengurangan = jumlahKesalahanHutan * 5;
    return Math.max(20, 100 - pengurangan);
}

/**
 * Memperbarui tampilan indikator tahap, jumlah komponen (mis. 1/5), dan skor.
 */
function perbaruiIndikatorHutan() {
    const dataTahap = TAHAP_HUTAN[indeksTahapHutan];
    const totalKomponen = dataTahap.komponenTarget.length;

    const elTahap = document.getElementById("indikator-tahap-hutan");
    const elKomponen = document.getElementById("indikator-komponen-hutan");
    const elSkor = document.getElementById("indikator-skor-hutan");

    if (elTahap) {
        elTahap.textContent = (indeksTahapHutan + 1) + "/" + TAHAP_HUTAN.length;
    }
    if (elKomponen) {
        elKomponen.textContent = jumlahKomponenTerpasang + "/" + totalKomponen;
    }
    if (elSkor) {
        elSkor.textContent = String(hitungSkorDekomposisi());
    }
}

/**
 * Menampilkan pesan umpan balik di halaman Hutan.
 */
function tampilkanPesanHutan(teks, jenis) {
    const kotakPesan = document.getElementById("pesan-umpan-balik-hutan");
    if (!kotakPesan) {
        return;
    }
    kotakPesan.textContent = teks;
    kotakPesan.className = "kotak-pesan pesan-" + (jenis || "info");
}

/**
 * Memproses penempatan material ke dalam slot bagian rumah.
 */
function prosesPenempatanMaterial(idMaterial, elemenSlot) {
    if (!idMaterial || !elemenSlot || elemenSlot.classList.contains("terisi")) {
        return;
    }

    const dataTahap = TAHAP_HUTAN[indeksTahapHutan];
    const idTargetSlot = elemenSlot.getAttribute("data-id-target");
    const kartuMaterial = document.querySelector('.kartu-material[data-id-material="' + idMaterial + '"]');

    if (!kartuMaterial || kartuMaterial.classList.contains("sudah-dipakai")) {
        return;
    }

    putarSFX("drop.mp3");

    // Periksa apakah material adalah pengecoh
    if (idMaterial === dataTahap.pengecoh.id) {
        jumlahKesalahanHutan++;
        perbaruiIndikatorHutan();
        putarSFX("wrong.mp3");
        elemenSlot.classList.add("salah-drop");
        setTimeout(function () {
            elemenSlot.classList.remove("salah-drop");
        }, 500);
        tampilkanPesanHutan(
            dataTahap.pengecoh.namaMaterial + " adalah material pengecoh dan tidak digunakan untuk membangun bagian rumah!",
            "kesalahan"
        );
        return;
    }

    // Periksa apakah material cocok dengan bagian rumah yang dituju
    if (idMaterial === idTargetSlot) {
        const infoKomponen = dataTahap.komponenTarget.find(function (item) {
            return item.id === idTargetSlot;
        });

        elemenSlot.classList.add("terisi");
        elemenSlot.innerHTML =
            "<!-- Gambar " + infoKomponen.nomorGambar + ": " + infoKomponen.fileGambar +
            " | Ukuran tampilan: 100x80 px | Aset: " + infoKomponen.jalurGambar + " -->" +
            '<img src="' + infoKomponen.jalurGambar + '" alt="' + infoKomponen.namaMaterial + '" width="100" height="80">' +
            '<span class="label-target-slot">' + infoKomponen.namaBagian + "</span>" +
            '<span class="petunjuk-slot">Terpasang: ' + infoKomponen.namaMaterial + "</span>";

        kartuMaterial.classList.add("sudah-dipakai");
        kartuMaterial.classList.remove("terpilih");
        kartuMaterial.setAttribute("draggable", "false");
        idMaterialSedangDipilih = null;

        jumlahKomponenTerpasang++;
        perbaruiIndikatorHutan();
        putarSFX("correct.mp3");

        if (jumlahKomponenTerpasang === dataTahap.komponenTarget.length) {
            const tombolNext = document.getElementById("tombol-next-hutan");
            if (tombolNext) {
                tombolNext.classList.remove("tersembunyi");
                tombolNext.textContent =
                    indeksTahapHutan < TAHAP_HUTAN.length - 1
                        ? "Next Stage"
                        : "Selesaikan Wilayah Hutan";
            }
            tampilkanPesanHutan(
                "Hebat! Seluruh komponen pada tahap ini telah terpasang dengan tepat. Klik tombol di bawah untuk melanjutkan!",
                "sukses"
            );
        } else {
            tampilkanPesanHutan(
                "Tepat! " + infoKomponen.namaMaterial + " berhasil dipasang pada " + infoKomponen.namaBagian + ".",
                "sukses"
            );
        }
    } else {
        jumlahKesalahanHutan++;
        perbaruiIndikatorHutan();
        putarSFX("wrong.mp3");
        elemenSlot.classList.add("salah-drop");
        setTimeout(function () {
            elemenSlot.classList.remove("salah-drop");
        }, 500);
        tampilkanPesanHutan(
            "Komponen tersebut belum sesuai untuk " + elemenSlot.getAttribute("data-nama-bagian") + ". Coba periksa bagian rumah yang lain!",
            "peringatan"
        );
    }
}

/**
 * Merender tahap aktif di Wilayah Hutan.
 */
function tampilkanTahapHutan() {
    const dataTahap = TAHAP_HUTAN[indeksTahapHutan];
    jumlahKomponenTerpasang = 0;
    idMaterialSedangDipilih = null;

    const judulTahap = document.getElementById("judul-tahap-hutan");
    const deskripsiTahap = document.getElementById("deskripsi-tahap-hutan");
    const wadahSlot = document.getElementById("wadah-slot-rumah");
    const wadahMaterial = document.getElementById("wadah-material-hutan");
    const tombolNext = document.getElementById("tombol-next-hutan");

    if (judulTahap) {
        judulTahap.textContent = dataTahap.judulTahap;
    }
    if (deskripsiTahap) {
        deskripsiTahap.textContent = dataTahap.deskripsi;
    }
    if (tombolNext) {
        tombolNext.classList.add("tersembunyi");
    }

    tampilkanPesanHutan(
        "Seret material dari sebelah kanan ke kotak bagian rumah di sebelah kiri (atau klik material lalu klik bagian rumah).",
        "info"
    );

    // 1. Buat slot target bagian rumah
    wadahSlot.innerHTML = "";
    dataTahap.komponenTarget.forEach(function (komponen) {
        const slot = document.createElement("div");
        slot.className = "slot-komponen-rumah";
        slot.setAttribute("data-id-target", komponen.id);
        slot.setAttribute("data-nama-bagian", komponen.namaBagian);
        slot.setAttribute("data-sfx-hover", "");

        slot.innerHTML =
            '<span class="label-target-slot">' + komponen.namaBagian + "</span>" +
            '<span class="petunjuk-slot">Seret komponen yang sesuai ke sini</span>';

        slot.addEventListener("dragover", function (event) {
            event.preventDefault();
            if (!slot.classList.contains("terisi")) {
                slot.classList.add("sorot-drop");
            }
        });

        slot.addEventListener("dragleave", function () {
            slot.classList.remove("sorot-drop");
        });

        slot.addEventListener("drop", function (event) {
            event.preventDefault();
            slot.classList.remove("sorot-drop");
            const idMaterial = event.dataTransfer.getData("text/plain");
            prosesPenempatanMaterial(idMaterial, slot);
        });

        // Dukungan klik untuk memilih & menempatkan material
        slot.addEventListener("click", function () {
            if (idMaterialSedangDipilih) {
                prosesPenempatanMaterial(idMaterialSedangDipilih, slot);
            }
        });

        wadahSlot.appendChild(slot);
    });

    // 2. Gabungkan komponen target dengan pengecoh lalu acak urutannya
    const semuaMaterial = dataTahap.komponenTarget.concat([dataTahap.pengecoh]);
    const materialTeracak = acakArray(semuaMaterial);

    wadahMaterial.innerHTML = "";
    materialTeracak.forEach(function (item) {
        const kartu = document.createElement("div");
        kartu.className = "kartu-material";
        kartu.setAttribute("draggable", "true");
        kartu.setAttribute("data-id-material", item.id);
        kartu.setAttribute("data-sfx-hover", "");
        kartu.setAttribute("data-sfx-click", "");

        kartu.innerHTML =
            "<!-- Gambar " + item.nomorGambar + ": " + item.fileGambar +
            " | Ukuran tampilan: 100x80 px | Aset: " + item.jalurGambar + " -->" +
            '<img src="' + item.jalurGambar + '" alt="' + item.namaMaterial + '" width="100" height="80" draggable="false">' +
            '<span class="nama-material">' + item.namaMaterial + "</span>";

        kartu.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", item.id);
            idMaterialSedangDipilih = item.id;
        });

        kartu.addEventListener("click", function () {
            if (kartu.classList.contains("sudah-dipakai")) {
                return;
            }
            const semuaKartu = wadahMaterial.querySelectorAll(".kartu-material");
            semuaKartu.forEach(function (k) {
                k.classList.remove("terpilih");
            });
            kartu.classList.add("terpilih");
            idMaterialSedangDipilih = item.id;
            tampilkanPesanHutan(
                'Material "' + item.namaMaterial + '" dipilih. Sekarang klik bagian rumah yang sesuai di sebelah kiri!',
                "info"
            );
        });

        wadahMaterial.appendChild(kartu);
    });

    perbaruiIndikatorHutan();
}

/**
 * Inisialisasi halaman Hutan saat DOM selesai dimuat.
 */
document.addEventListener("DOMContentLoaded", function () {
    const elNama = document.getElementById("nama-pemain-hutan");
    if (elNama) {
        elNama.textContent = ambilNamaPemain();
    }

    const tombolNext = document.getElementById("tombol-next-hutan");
    if (tombolNext) {
        tombolNext.addEventListener("click", function () {
            if (indeksTahapHutan < TAHAP_HUTAN.length - 1) {
                indeksTahapHutan++;
                tampilkanTahapHutan();
            } else {
                const skorAkhir = hitungSkorDekomposisi();
                simpanSkor("dekomposisi", skorAkhir);
                simpanProgres("hutan", true);
                pindahHalaman("peta.html", true);
            }
        });
    }

    tampilkanTahapHutan();
});

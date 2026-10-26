/**
 * File: js/hasil.js
 * Deskripsi: Mengelola tampilan ringkasan hasil petualangan pada hasil.html,
 * membaca skor dari localStorage, menghitung persentase skor akhir,
 * serta menangani tombol Lihat Detail dan Main Lagi.
 */

/**
 * Menentukan predikat dan pesan ringkasan pencapaian berdasarkan persentase total skor.
 */
function dapatkanRingkasanPencapaian(persentase) {
    if (persentase >= 85) {
        return {
            predikat: "Penjelajah Master Logika",
            pesan: "Luar biasa! Kamu menguasai keempat pilar Computational Thinking dengan sangat baik dan berhasil memulihkan seluruh jalur di Pulau Logika."
        };
    }
    if (persentase >= 70) {
        return {
            predikat: "Penjelajah Cakap Logika",
            pesan: "Kerja bagus! Kamu sudah memahami cara memecah masalah, mengenali pola, memilah informasi penting, dan menyusun algoritma."
        };
    }
    return {
        predikat: "Penjelajah Muda Pulau Logika",
        pesan: "Selamat telah menyelesaikan petualangan! Terus berlatih di setiap wilayah agar kemampuan berpikir komputasionalmu semakin tajam."
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const namaPemain = ambilNamaPemain();
    const skor = ambilSkor();

    const skorDekomposisi = Number(skor.dekomposisi || 0);
    const skorPola = Number(skor.pengenalanPola || 0);
    const skorAbstraksi = Number(skor.abstraksi || 0);
    const skorAlgoritma = Number(skor.algoritma || 0);

    const totalPoin = skorDekomposisi + skorPola + skorAbstraksi + skorAlgoritma;
    const skorMaksimum = 400;
    const persentaseAkhir = Math.round((totalPoin / skorMaksimum) * 100);

    const elNama = document.getElementById("nama-pemain-hasil");
    const elTotalPersen = document.getElementById("nilai-persentase-total");
    const elTotalPoin = document.getElementById("nilai-poin-total");
    const elPredikat = document.getElementById("predikat-pencapaian");
    const elRingkasan = document.getElementById("ringkasan-pencapaian");

    if (elNama) {
        elNama.textContent = namaPemain;
    }
    if (elTotalPersen) {
        elTotalPersen.textContent = persentaseAkhir + "%";
    }
    if (elTotalPoin) {
        elTotalPoin.textContent = totalPoin + " / " + skorMaksimum + " Poin";
    }

    const infoCapaian = dapatkanRingkasanPencapaian(persentaseAkhir);
    if (elPredikat) {
        elPredikat.textContent = infoCapaian.predikat;
    }
    if (elRingkasan) {
        elRingkasan.textContent = infoCapaian.pesan;
    }

    // Perbarui kartu masing-masing pilar
    const daftarPilar = [
        { kunci: "dekomposisi", nilai: skorDekomposisi },
        { kunci: "pola", nilai: skorPola },
        { kunci: "abstraksi", nilai: skorAbstraksi },
        { kunci: "algoritma", nilai: skorAlgoritma }
    ];

    daftarPilar.forEach(function (item) {
        const elAngka = document.getElementById("skor-" + item.kunci);
        const elBatang = document.getElementById("batang-" + item.kunci);
        if (elAngka) {
            elAngka.textContent = item.nilai + " / 100 (" + item.nilai + "%)";
        }
        if (elBatang) {
            elBatang.style.width = item.nilai + "%";
        }
    });

    const tombolDetail = document.getElementById("tombol-lihat-detail");
    if (tombolDetail) {
        tombolDetail.addEventListener("click", function () {
            // BGM Background 9 tetap berlanjut ke halaman detail.html
            pindahHalaman("detail.html", false);
        });
    }

    const tombolMainLagi = document.getElementById("tombol-main-lagi");
    if (tombolMainLagi) {
        tombolMainLagi.addEventListener("click", function () {
            resetPermainan();
            pindahHalaman("index.html", true);
        });
    }
});

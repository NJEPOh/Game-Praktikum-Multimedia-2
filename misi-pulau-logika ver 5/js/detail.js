/**
 * File: js/detail.js
 * Deskripsi: Menampilkan rincian skor dan evaluasi kemampuan keempat pilar
 * Computational Thinking pada halaman detail.html.
 */

/**
 * Menentukan kategori tingkat penguasaan dan keterangan kemampuan berdasarkan skor pilar.
 */
function evaluasiKemampuanPilar(jenisPilar, nilaiSkor) {
    let tingkat = "Berkembang";
    let kelasCSS = "level-berkembang";

    if (nilaiSkor >= 85) {
        tingkat = "Sangat Mahir";
        kelasCSS = "level-mahir";
    } else if (nilaiSkor >= 70) {
        tingkat = "Cakap";
        kelasCSS = "level-cakap";
    }

    const kamusDeskripsi = {
        dekomposisi: {
            mahir: "Hebat! Kamu pintar menyusun bagian rumah dengan tepat.",
            cakap: "Bagus! Kamu sudah bisa memilih bahan rumah dengan baik.",
            berkembang: "Terus berlatih memilih bahan yang cocok untuk rumah ya!"
        },
        pengenalanPola: {
            mahir: "Hebat! Kamu cepat menemukan pola yang hilang di jalan desa.",
            cakap: "Bagus! Kamu bisa menebak sebagian besar pola jalan desa.",
            berkembang: "Amati urutan gambarnya baik-baik sebelum memilih jawaban ya!"
        },
        abstraksi: {
            mahir: "Hebat! Kamu pintar memilih barang penting dan membuang yang tidak perlu.",
            cakap: "Bagus! Kamu sudah bisa membedakan barang penting untuk misi.",
            berkembang: "Perhatikan tujuan misi sebelum memilih barang penting ya!"
        },
        algoritma: {
            mahir: "Hebat! Kamu pintar menyusun langkah menuju tujuan tanpa menabrak.",
            cakap: "Bagus! Kamu berhasil mengarahkan karakter sampai ke tujuan.",
            berkembang: "Coba perhatikan kotak rintangan sebelum menyusun langkah ya!"
        }
    };

    const kelompok = kamusDeskripsi[jenisPilar] || kamusDeskripsi.dekomposisi;
    let keterangan = kelompok.berkembang;

    if (nilaiSkor >= 85) {
        keterangan = kelompok.mahir;
    } else if (nilaiSkor >= 70) {
        keterangan = kelompok.cakap;
    }

    return {
        tingkat: tingkat,
        kelasCSS: kelasCSS,
        keterangan: keterangan
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const namaPemain = ambilNamaPemain();
    const skor = ambilSkor();

    const elNama = document.getElementById("nama-pemain-detail");
    const elTotal = document.getElementById("total-persen-detail");

    if (elNama) {
        elNama.textContent = namaPemain;
    }
    if (elTotal) {
        elTotal.textContent = hitungTotalPersentaseSkor() + "%";
    }

    const daftarPilarDetail = [
        {
            idDOM: "dekomposisi",
            kunciData: "dekomposisi",
            nilai: Number(skor.dekomposisi || 0)
        },
        {
            idDOM: "pola",
            kunciData: "pengenalanPola",
            nilai: Number(skor.pengenalanPola || 0)
        },
        {
            idDOM: "abstraksi",
            kunciData: "abstraksi",
            nilai: Number(skor.abstraksi || 0)
        },
        {
            idDOM: "algoritma",
            kunciData: "algoritma",
            nilai: Number(skor.algoritma || 0)
        }
    ];

    daftarPilarDetail.forEach(function (pilar) {
        const hasilEvaluasi = evaluasiKemampuanPilar(pilar.kunciData, pilar.nilai);

        const elSkor = document.getElementById("detail-skor-" + pilar.idDOM);
        const elPersen = document.getElementById("detail-persen-" + pilar.idDOM);
        const elLevel = document.getElementById("detail-level-" + pilar.idDOM);
        const elDeskripsi = document.getElementById("detail-deskripsi-" + pilar.idDOM);
        const elBatang = document.getElementById("detail-batang-" + pilar.idDOM);

        if (elSkor) {
            elSkor.textContent = pilar.nilai + "%";
        }
        if (elPersen) {
            elPersen.textContent = pilar.nilai + " / 100 Poin";
        }
        if (elLevel) {
            elLevel.textContent = hasilEvaluasi.tingkat;
            elLevel.className = "lencana-level-kemampuan " + hasilEvaluasi.kelasCSS;
        }
        if (elDeskripsi) {
            elDeskripsi.textContent = hasilEvaluasi.keterangan;
        }
        if (elBatang) {
            elBatang.style.width = pilar.nilai + "%";
        }
    });

    const tombolKembali = document.getElementById("tombol-kembali-ringkasan");
    if (tombolKembali) {
        tombolKembali.addEventListener("click", function () {
            // BGM Background 9 tetap berlanjut saat kembali ke hasil.html
            pindahHalaman("hasil.html", false);
        });
    }
});

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
            mahir: "Mampu memecah masalah kompleks (pembangunan rumah utuh) menjadi komponen-komponen kecil secara akurat tanpa terkecoh material yang tidak relevan.",
            cakap: "Sudah mampu menguraikan bagian utama masalah menjadi sub-bagian yang lebih sederhana, meskipun sempat mencoba beberapa komponen yang kurang tepat.",
            berkembang: "Mulai mengenal cara membagi masalah besar menjadi bagian kecil. Perlu ketelitian lebih dalam mengamati fungsi setiap komponen."
        },
        pengenalanPola: {
            mahir: "Sangat tajam dalam mengenali keteraturan bentuk, warna, maupun deret angka sehingga mampu memprediksi ubin yang hilang dengan cepat dan tepat.",
            cakap: "Dapat menemukan pola berulang pada sebagian besar soal jalan desa dengan baik dan memahami hubungan antar-ubin.",
            berkembang: "Mulai dapat mengidentifikasi pola sederhana. Disarankan mengamati pengulangan dua atau tiga elemen secara berurutan sebelum memilih jawaban."
        },
        abstraksi: {
            mahir: "Sangat terampil menyaring informasi penting yang relevan dengan tujuan misi serta mengabaikan objek gangguan yang tidak diperlukan.",
            cakap: "Mampu membedakan kebutuhan utama misi dari informasi pengganggu pada sebagian besar skenario di wilayah Gunung.",
            berkembang: "Mulai memahami perbedaan informasi penting dan tidak penting. Fokuslah pada tujuan utama skenario sebelum mengelompokkan objek."
        },
        algoritma: {
            mahir: "Mampu merancang urutan langkah instruksi yang logis, sistematis, dan efisien untuk mencapai tujuan di grid 4x4 tanpa menabrak rintangan.",
            cakap: "Dapat menyusun urutan instruksi hingga mencapai tujuan dengan baik setelah melakukan sedikit penyesuaian rute.",
            berkembang: "Mulai memahami cara kerja instruksi berurutan. Latih kemampuan membayangkan posisi setiap langkah sebelum mengeksekusi algoritma."
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

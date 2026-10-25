/**
 * File: js/penyimpanan.js
 * Deskripsi: Mengelola penyimpanan nama pemain, progres wilayah, dan skor
 * menggunakan localStorage browser.
 */

const KUNCI_PENYIMPANAN = "misi_pulau_logika_data";

/**
 * Membuat struktur data awal permainan.
 */
function buatDataAwal() {
    return {
        namaPemain: "",
        progres: {
            hutan: false,
            desa: false,
            gunung: false,
            kastil: false
        },
        skor: {
            dekomposisi: 0,
            pengenalanPola: 0,
            abstraksi: 0,
            algoritma: 0
        }
    };
}

/**
 * Mengambil seluruh data permainan dari localStorage.
 */
function ambilDataPermainan() {
    const dataTersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (!dataTersimpan) {
        return buatDataAwal();
    }

    try {
        const dataObjek = JSON.parse(dataTersimpan);
        const dataDefault = buatDataAwal();

        return {
            namaPemain: dataObjek.namaPemain || dataDefault.namaPemain,
            progres: Object.assign({}, dataDefault.progres, dataObjek.progres || {}),
            skor: Object.assign({}, dataDefault.skor, dataObjek.skor || {})
        };
    } catch (kesalahan) {
        console.warn("Gagal membaca data penyimpanan, menggunakan data awal.", kesalahan);
        return buatDataAwal();
    }
}

/**
 * Menyimpan seluruh objek data permainan ke localStorage.
 */
function simpanDataPermainan(data) {
    try {
        const teksJson = JSON.stringify(data);
        localStorage.setItem(KUNCI_PENYIMPANAN, teksJson);
    } catch (kesalahan) {
        console.error("Gagal menyimpan data ke localStorage:", kesalahan);
    }
}

/**
 * Menyimpan nama pemain ke localStorage.
 */
function simpanNamaPemain(nama) {
    const data = ambilDataPermainan();
    data.namaPemain = nama.trim();
    simpanDataPermainan(data);
}

/**
 * Mengambil nama pemain dari localStorage.
 */
function ambilNamaPemain() {
    const data = ambilDataPermainan();
    return data.namaPemain || "Penjelajah";
}

/**
 * Menyimpan status selesai untuk suatu wilayah ('hutan', 'desa', 'gunung', 'kastil').
 */
function simpanProgres(namaWilayah, statusSelesai) {
    const data = ambilDataPermainan();
    if (Object.prototype.hasOwnProperty.call(data.progres, namaWilayah)) {
        data.progres[namaWilayah] = Boolean(statusSelesai);
        simpanDataPermainan(data);
    }
}

/**
 * Mengambil objek progres seluruh wilayah.
 */
function ambilProgres() {
    const data = ambilDataPermainan();
    return data.progres;
}

/**
 * Menyimpan skor untuk pilar tertentu
 * ('dekomposisi', 'pengenalanPola', 'abstraksi', 'algoritma').
 * Nilai skor disimpan dalam rentang 0 - 100.
 */
function simpanSkor(namaPilar, nilaiSkor) {
    const data = ambilDataPermainan();
    if (Object.prototype.hasOwnProperty.call(data.skor, namaPilar)) {
        const skorValid = Math.max(0, Math.min(100, Math.round(Number(nilaiSkor) || 0)));
        data.skor[namaPilar] = skorValid;
        simpanDataPermainan(data);
    }
}

/**
 * Mengambil objek skor seluruh pilar Computational Thinking.
 */
function ambilSkor() {
    const data = ambilDataPermainan();
    return data.skor;
}

/**
 * Menghitung rata-rata atau persentase total skor dari keempat pilar (0 - 100).
 */
function hitungTotalPersentaseSkor() {
    const skor = ambilSkor();
    const totalPerolehan =
        Number(skor.dekomposisi || 0) +
        Number(skor.pengenalanPola || 0) +
        Number(skor.abstraksi || 0) +
        Number(skor.algoritma || 0);
    const skorMaksimum = 400;
    return Math.round((totalPerolehan / skorMaksimum) * 100);
}

/**
 * Menghapus hanya data milik game dari localStorage tanpa menghapus data aplikasi lain.
 */
function resetPermainan() {
    localStorage.removeItem(KUNCI_PENYIMPANAN);
}

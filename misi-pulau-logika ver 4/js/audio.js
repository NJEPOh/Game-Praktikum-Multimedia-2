/**
 * File: js/audio.js
 * Deskripsi: Mengelola pemutaran musik latar (BGM) lintas halaman menggunakan
 * sessionStorage serta efek suara (SFX) global untuk hover, klik, drop, benar, dan salah.
 */

const KUNCI_BGM_AKTIF = "mpl_bgm_nama";
const KUNCI_BGM_WAKTU = "mpl_bgm_waktu";
const KUNCI_STATUS_SUARA = "mpl_suara_aktif";

let elemenBGM = null;
let namaBGMSekarang = "";
let intervalSimpanWaktu = null;

/**
 * Memeriksa apakah suara diaktifkan oleh pemain (default: true).
 */
function apakahSuaraAktif() {
    const status = sessionStorage.getItem(KUNCI_STATUS_SUARA);
    if (status === null) {
        return true;
    }
    return status === "true";
}

/**
 * Mengubah status aktif/nonaktif suara (mute/unmute).
 */
function ubahStatusSuara() {
    const statusBaru = !apakahSuaraAktif();
    sessionStorage.setItem(KUNCI_STATUS_SUARA, String(statusBaru));

    if (elemenBGM) {
        elemenBGM.muted = !statusBaru;
        if (statusBaru && elemenBGM.paused) {
            cobaPutarAudio(elemenBGM);
        }
    }

    perbaruiTombolSuaraUI();
    return statusBaru;
}

/**
 * Memperbarui teks pada tombol pengatur suara jika ada di halaman.
 */
function perbaruiTombolSuaraUI() {
    const tombolSuara = document.getElementById("tombol-suara");
    if (!tombolSuara) {
        return;
    }
    const aktif = apakahSuaraAktif();
    tombolSuara.textContent = aktif ? "Suara: Aktif" : "Suara: Nonaktif";
    tombolSuara.setAttribute("aria-pressed", String(aktif));
}

/**
 * Mencoba memutar objek HTMLAudioElement dengan penanganan pembatasan autoplay browser.
 */
function cobaPutarAudio(objekAudio) {
    if (!objekAudio) {
        return;
    }
    const janjiPutar = objekAudio.play();
    if (janjiPutar !== undefined) {
        janjiPutar.catch(function () {
            // Jika browser menahan autoplay, putar setelah interaksi pertama pengguna di halaman
            const putarSaatInteraksi = function () {
                if (elemenBGM && apakahSuaraAktif()) {
                    elemenBGM.play().catch(function () {});
                }
                document.removeEventListener("click", putarSaatInteraksi);
                document.removeEventListener("keydown", putarSaatInteraksi);
            };
            document.addEventListener("click", putarSaatInteraksi, { once: true });
            document.addEventListener("keydown", putarSaatInteraksi, { once: true });
        });
    }
}

/**
 * Menyiapkan dan memutar BGM untuk halaman aktif.
 * Jika namaFileBGM sama dengan halaman sebelumnya di sessionStorage,
 * maka pemutaran dilanjutkan dari posisi waktu terakhir.
 */
function mulaiBGMHalaman(namaFileBGM) {
    if (!namaFileBGM) {
        hentikanBGM(true);
        return;
    }

    const bgmSebelumnya = sessionStorage.getItem(KUNCI_BGM_AKTIF);
    const waktuTersimpan = parseFloat(sessionStorage.getItem(KUNCI_BGM_WAKTU) || "0");

    if (elemenBGM) {
        elemenBGM.pause();
    }

    namaBGMSekarang = namaFileBGM;
    const jalurBGM = "assets/audio/bgm/" + namaFileBGM;

    elemenBGM = new Audio(jalurBGM);
    elemenBGM.loop = true;
    elemenBGM.volume = 0.5;
    elemenBGM.muted = !apakahSuaraAktif();

    // Jika musik yang diminta sama dengan BGM sebelumnya, lanjutkan dari posisi terakhir
    if (bgmSebelumnya === namaFileBGM && !isNaN(waktuTersimpan) && waktuTersimpan > 0) {
        elemenBGM.addEventListener("loadedmetadata", function () {
            if (waktuTersimpan < elemenBGM.duration) {
                elemenBGM.currentTime = waktuTersimpan;
            }
        }, { once: true });
    } else {
        sessionStorage.setItem(KUNCI_BGM_WAKTU, "0");
    }

    sessionStorage.setItem(KUNCI_BGM_AKTIF, namaFileBGM);
    cobaPutarAudio(elemenBGM);

    // Simpan posisi waktu secara berkala dan saat berpindah halaman
    if (intervalSimpanWaktu) {
        clearInterval(intervalSimpanWaktu);
    }
    intervalSimpanWaktu = setInterval(simpanPosisiBGM, 500);
}

/**
 * Menyimpan posisi waktu pemutaran BGM saat ini ke sessionStorage.
 */
function simpanPosisiBGM() {
    if (elemenBGM && namaBGMSekarang && !elemenBGM.paused) {
        sessionStorage.setItem(KUNCI_BGM_AKTIF, namaBGMSekarang);
        sessionStorage.setItem(KUNCI_BGM_WAKTU, String(elemenBGM.currentTime || 0));
    }
}

/**
 * Menghentikan BGM yang sedang berjalan.
 * Parameter hapusSesi menentukan apakah riwayat BGM di sessionStorage ikut direset.
 */
function hentikanBGM(hapusSesi) {
    if (intervalSimpanWaktu) {
        clearInterval(intervalSimpanWaktu);
        intervalSimpanWaktu = null;
    }
    if (elemenBGM) {
        elemenBGM.pause();
        elemenBGM.currentTime = 0;
    }
    if (hapusSesi) {
        sessionStorage.removeItem(KUNCI_BGM_AKTIF);
        sessionStorage.removeItem(KUNCI_BGM_WAKTU);
        namaBGMSekarang = "";
    }
}

/**
 * Memutar efek suara (SFX) satu kali berdasarkan nama file di folder assets/audio/sfx/.
 * Contoh namaFileSFX: "hover.mp3", "click.mp3", "drop.mp3", "correct.mp3", "wrong.mp3".
 */
function putarSFX(namaFileSFX) {
    if (!apakahSuaraAktif() || !namaFileSFX) {
        return;
    }
    try {
        const sfx = new Audio("assets/audio/sfx/" + namaFileSFX);
        sfx.volume = 0.75;
        const janji = sfx.play();
        if (janji !== undefined) {
            janji.catch(function () {
                // Abaikan jika browser membatasi suara sebelum klik pertama atau file belum tersedia
            });
        }
    } catch (kesalahan) {
        // Abaikan error jika aset audio belum ditaruh
    }
}

/**
 * Memasang event listener global untuk elemen yang memiliki atribut
 * data-sfx-hover dan data-sfx-click, baik yang sudah ada maupun yang dibuat dinamis.
 */
function pasangEventSFXGlobal() {
    let elemenHoverTerakhir = null;

    document.addEventListener("mouseover", function (event) {
        const target = event.target.closest("[data-sfx-hover]");
        if (target && target !== elemenHoverTerakhir && !target.disabled) {
            elemenHoverTerakhir = target;
            putarSFX("hover.mp3");
        } else if (!target) {
            elemenHoverTerakhir = null;
        }
    });

    document.addEventListener("click", function (event) {
        const target = event.target.closest("[data-sfx-click]");
        if (target && !target.disabled) {
            putarSFX("click.mp3");
        }
    });
}

/**
 * Inisialisasi otomatis sistem audio saat halaman selesai dimuat.
 */
document.addEventListener("DOMContentLoaded", function () {
    pasangEventSFXGlobal();
    perbaruiTombolSuaraUI();

    const tombolSuara = document.getElementById("tombol-suara");
    if (tombolSuara) {
        tombolSuara.addEventListener("click", function () {
            ubahStatusSuara();
        });
    }

    const bgmHalaman = document.body.getAttribute("data-bgm");
    if (bgmHalaman) {
        mulaiBGMHalaman(bgmHalaman);
    }

    window.addEventListener("beforeunload", function () {
        if (namaBGMSekarang) {
            simpanPosisiBGM();
        }
    });
});

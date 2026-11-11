/**
 * File: js/navigasi.js
 * Deskripsi: Mengelola perpindahan antarhalaman HTML, sinkronisasi BGM saat navigasi,
 * serta mekanisme placeholder HTML/CSS (tanpa emoji) apabila file aset gambar belum tersedia.
 */

/**
 * Berpindah ke halaman HTML tujuan.
 * Jika hentikanMusik bernilai true, BGM halaman saat ini dihentikan dan tidak dilanjutkan.
 */
function pindahHalaman(halamanTujuan, hentikanMusik) {
    if (!halamanTujuan) {
        return;
    }

    if (hentikanMusik && typeof hentikanBGM === "function") {
        hentikanBGM(true);
    } else if (typeof simpanPosisiBGM === "function") {
        simpanPosisiBGM();
    }

    // Beri jeda singkat agar SFX klik sempat terdengar sebelum berpindah halaman
    setTimeout(function () {
        window.location.href = halamanTujuan;
    }, 120);
}

/**
 * Mengaktifkan tampilan placeholder HTML/CSS sederhana (tanpa emoji)
 * apabila file gambar eksternal pada elemen <img> belum tersedia di folder assets/images/.
 */
function terapkanFallbackGambar(elemenImg) {
    if (!elemenImg || elemenImg.dataset.fallbackTerpasang === "true") {
        return;
    }
    elemenImg.dataset.fallbackTerpasang = "true";

    const tanganiGagalMuat = function () {
        elemenImg.classList.add("gambar-belum-tersedia");
        const jalur = elemenImg.getAttribute("src") || "";
        const namaFile = jalur.split("/").pop() || "aset.png";
        const teksAlt = elemenImg.getAttribute("alt") || namaFile;
        elemenImg.setAttribute("data-nama-file", namaFile);
        elemenImg.setAttribute("title", teksAlt + " (" + jalur + " - Aset perlu disediakan)");
    };

    const tanganiBerhasilMuat = function () {
        elemenImg.classList.remove("gambar-belum-tersedia");
    };

    elemenImg.addEventListener("error", tanganiGagalMuat);
    elemenImg.addEventListener("load", tanganiBerhasilMuat);

    // Periksa jika gambar sudah selesai dicoba dimuat sebelum listener terpasang
    if (elemenImg.complete && elemenImg.naturalWidth === 0) {
        tanganiGagalMuat();
    }
}

/**
 * Memantau seluruh elemen <img> di halaman (termasuk yang ditambahkan secara dinamis)
 * agar tetap memiliki placeholder HTML/CSS rapi apabila file PNG belum ditaruh.
 */
function inisialisasiFallbackSeluruhGambar() {
    const daftarGambar = document.querySelectorAll("img");
    daftarGambar.forEach(function (img) {
        terapkanFallbackGambar(img);
    });

    if (typeof MutationObserver !== "undefined") {
        const pengamat = new MutationObserver(function (daftarMutasi) {
            daftarMutasi.forEach(function (mutasi) {
                mutasi.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        if (node.tagName === "IMG") {
                            terapkanFallbackGambar(node);
                        }
                        const gambarAnak = node.querySelectorAll ? node.querySelectorAll("img") : [];
                        gambarAnak.forEach(function (img) {
                            terapkanFallbackGambar(img);
                        });
                    }
                });
            });
        });

        pengamat.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    inisialisasiFallbackSeluruhGambar();
});

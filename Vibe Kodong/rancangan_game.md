# Rancangan Pengembangan Web Game Edukasi "Misi Pulau Logika"

## 1. Konteks dan Peran

Bertindak sebagai **Web Game Developer dan Game Designer** yang berfokus pada pengembangan game edukasi menggunakan HTML, CSS, dan Vanilla JavaScript.

Game dikembangkan dengan struktur kode sederhana, modular, dan mudah dipahami oleh pemula. Setiap halaman memiliki file HTML tersendiri sehingga pengembangan, pengujian, dan perbaikan dapat dilakukan pada satu halaman tanpa harus mengubah keseluruhan aplikasi.

Gunakan teknologi berikut:

- **HTML5** untuk struktur setiap halaman.
- **CSS3** untuk tampilan, animasi sederhana, dan tata letak.
- **Vanilla JavaScript** untuk mekanik permainan, pengelolaan skor, navigasi, dan audio.
- **JSON** untuk menyimpan variasi soal pada setiap wilayah.
- **Fetch API** untuk mengambil data soal dari file JSON eksternal.

Tidak menggunakan framework JavaScript, SPA, React, Vue, atau sistem routing kompleks.

## 2. Konsep Utama Game

"Misi Pulau Logika" adalah game edukasi untuk anak-anak. Pemain berperan sebagai penjelajah yang menyelesaikan empat misi di sebuah pulau untuk mencapai kastil.

Setiap misi dirancang untuk melatih dan mengukur empat pilar Computational Thinking.

| Wilayah | Pilar | Misi |
|---|---|---|
| Hutan | Dekomposisi | Membangun rumah dari komponen-komponen kecil |
| Desa | Pengenalan Pola | Melengkapi pola jalan yang rumpang |
| Gunung | Abstraksi | Memisahkan informasi penting dari gangguan |
| Kastil | Algoritma | Menyusun instruksi untuk menemukan rute yang benar |

Sistem permainan menggunakan empat wilayah yang terbuka secara berurutan. Pemain harus menyelesaikan misi di wilayah sebelumnya sebelum dapat memasuki wilayah berikutnya.

## 3. Arsitektur Website

### 3.1. Menggunakan Multi-Page Website

Game menggunakan pendekatan **multi-page website**, bukan SPA. Setiap layar memiliki file HTML sendiri dan perpindahan halaman dilakukan menggunakan navigasi HTML biasa, seperti `window.location.href` atau tautan `<a>`.

Contoh:

- `index.html` untuk halaman awal.
- `narasi.html` untuk halaman narasi.
- `petunjuk.html` untuk petunjuk permainan.
- `peta.html` untuk peta pulau.
- `hutan.html` untuk misi dekomposisi.
- `desa.html` untuk misi pengenalan pola.
- `gunung.html` untuk misi abstraksi.
- `kastil.html` untuk misi algoritma.
- `hasil.html` untuk ringkasan hasil.
- `detail.html` untuk rincian kemampuan pemain.

Setiap halaman hanya memuat JavaScript yang diperlukan untuk menjalankan fungsinya. Kode yang digunakan bersama, seperti pengaturan audio dan penyimpanan progres, diletakkan di file JavaScript terpisah.

### 3.2. Prinsip Pengembangan

1. Setiap halaman memiliki tanggung jawab yang jelas.
2. Hindari fungsi JavaScript yang terlalu panjang atau kompleks.
3. Gunakan nama variabel dan fungsi yang mudah dipahami.
4. Pisahkan data soal dari kode mekanik permainan.
5. Gunakan fungsi sederhana untuk tugas yang berulang.
6. Hindari pola pemrograman yang belum diperlukan, seperti class yang kompleks, state management library, dan sistem routing buatan sendiri.
7. Kerjakan game secara bertahap, mulai dari navigasi dan audio, kemudian mekanik setiap wilayah.

## 4. Struktur Direktori

Gunakan struktur direktori berikut:

```text
misi-pulau-logika/
├── index.html
├── narasi.html
├── petunjuk.html
├── peta.html
├── hutan.html
├── desa.html
├── gunung.html
├── kastil.html
├── hasil.html
├── detail.html
│
├── css/
│   ├── style.css
│   ├── menu.css
│   ├── hutan.css
│   ├── desa.css
│   ├── gunung.css
│   ├── kastil.css
│   └── hasil.css
│
├── js/
│   ├── audio.js
│   ├── penyimpanan.js
│   ├── navigasi.js
│   ├── menu.js
│   ├── hutan.js
│   ├── desa.js
│   ├── gunung.js
│   ├── kastil.js
│   ├── hasil.js
│   └── detail.js
│
├── data/
│   ├── desa.json
│   ├── gunung.json
│   └── kastil.json
│
└── assets/
    ├── images/
    │   ├── backgrounds/
    │   │   ├── background-1.png
    │   │   ├── background-2.png
    │   │   ├── background-3.png
    │   │   ├── background-4.png
    │   │   ├── background-5.png
    │   │   ├── background-7.png
    │   │   └── background-9.png
    │   ├── characters/
    │   ├── objects/
    │   ├── tiles/
    │   └── icons/
    │
    └── audio/
        ├── bgm/
        │   ├── music-background-1.mp3
        │   ├── music-background-2.mp3
        │   ├── music-background-3.mp3
        │   ├── music-background-4.mp3
        │   ├── music-background-5.mp3
        │   ├── music-background-7.mp3
        │   └── music-background-9.mp3
        └── sfx/
            ├── hover.mp3
            ├── click.mp3
            ├── drop.mp3
            ├── correct.mp3
            └── wrong.mp3
```

Nama file aset dapat disesuaikan dengan aset yang tersedia. Pastikan nama file dan jalur yang digunakan di HTML, CSS, JavaScript, dan JSON sama persis.

## 5. Rancangan Sepuluh Halaman

### Screen 1 — Halaman Awal (`index.html`)

**Isi:**
- Judul game.
- Input nama pemain.
- Tombol "Mulai Permainan".
- Tombol "Petunjuk".

**Visual dan audio:**
- Background: `background-1.png`.
- BGM: `music-background-1.mp3`.
- SFX: `hover.mp3` dan `click.mp3`.

**Logika:**
- Nama pemain harus diisi sebelum memulai.
- Tombol "Mulai Permainan" menyimpan nama pemain dan membuka `narasi.html`.
- Tombol "Petunjuk" membuka `petunjuk.html`.
- BGM halaman awal dihentikan ketika pemain berpindah halaman.

### Screen 2 — Halaman Narasi (`narasi.html`)

**Isi:**
- Narasi karakter dalam tiga bagian.
- Tombol "Next" dan "Back".

**Visual dan audio:**
- Background: `background-2.png`.
- BGM: `music-background-2.mp3`.

**Logika:**
- Dialog ditampilkan satu per satu.
- Tombol "Next" menampilkan dialog selanjutnya.
- Tombol "Back" menampilkan dialog sebelumnya.
- Setelah dialog terakhir, pemain dapat menuju `peta.html`.

### Screen 3 — Petunjuk (`petunjuk.html`)

**Isi:**
- Petunjuk permainan untuk empat wilayah.
- Tombol "Kembali" dan "Mengerti".

**Visual dan audio:**
- Background: `background-2.png`.
- BGM: `music-background-2.mp3`.

**Logika:**
- Tombol "Kembali" membuka `index.html`.
- Tombol "Mengerti" membuka `peta.html`.
- BGM narasi dan petunjuk menggunakan file musik yang sama.

### Screen 4 — Peta Pulau (`peta.html`)

**Isi:**
- Peta pulau dengan ikon Hutan, Desa, Gunung, dan Kastil.

**Visual dan audio:**
- Background: `background-2.png`.
- BGM: `music-background-2.mp3`.

**Logika:**
- Hutan terbuka sejak awal.
- Desa terbuka setelah Hutan selesai.
- Gunung terbuka setelah Desa selesai.
- Kastil terbuka setelah Gunung selesai.
- Wilayah yang terkunci tidak dapat dimasuki.
- Klik ikon wilayah akan membuka file HTML wilayah terkait.
- BGM peta dihentikan ketika pemain memasuki wilayah permainan.

### Screen 5 — Hutan (`hutan.html`)

**Pilar:** Dekomposisi.

**Tujuan:** Memecah rumah menjadi komponen-komponen kecil.

**Mekanik:**
- Terdapat tiga tahap.
- Pemain menyeret material ke bagian rumah yang sesuai.
- Material diacak pada setiap tahap.
- Setiap tahap memiliki satu material pengecoh.
- Indikator jumlah menampilkan progres, misalnya `1/5`.
- Tombol "Next Stage" muncul setelah semua komponen yang dibutuhkan berhasil ditempatkan.

**Visual dan audio:**
- Background: `background-3.png`.
- BGM: `music-background-3.mp3`.
- SFX: `hover.mp3`, `drop.mp3`, dan `click.mp3`.

Setelah seluruh tahap selesai, progres Hutan disimpan dan Desa dibuka.

### Screen 6 — Desa (`desa.html`)

**Pilar:** Pengenalan Pola.

**Tujuan:** Mengenali pola dan melengkapi ubin jalan yang rumpang.

**Mekanik:**
- Terdapat lima tahap.
- Pemain memilih jawaban berdasarkan pola warna, bentuk, atau angka.
- Data soal diambil dari `data/desa.json`.
- Lima soal dipilih secara acak tanpa pengulangan dalam satu sesi.
- Tombol "Next Stage" muncul setelah jawaban benar atau setelah mekanisme penyelesaian soal terpenuhi.

**Visual dan audio:**
- Background: `background-4.png`.
- BGM: `music-background-4.mp3`.
- SFX: `hover.mp3` dan `click.mp3`.

Setelah lima tahap selesai, progres Desa disimpan dan Gunung dibuka.

### Screen 7 — Gunung (`gunung.html`)

**Pilar:** Abstraksi.

**Tujuan:** Memisahkan informasi penting dari informasi yang tidak relevan.

**Mekanik:**
- Terdapat lima tahap.
- Pemain memilih atau menyeret objek ke kategori "Penting" dan "Tidak Penting".
- Data soal diambil dari `data/gunung.json`.
- Lima soal dipilih secara acak tanpa pengulangan dalam satu sesi.
- Tombol "Next Stage" muncul setelah tahap selesai.

**Visual dan audio:**
- Background: `background-5.png`.
- BGM: `music-background-5.mp3`.
- SFX: `hover.mp3`, `drop.mp3`, dan `click.mp3`.

Setelah lima tahap selesai, progres Gunung disimpan dan Kastil dibuka.

### Screen 8 — Kastil (`kastil.html`)

**Pilar:** Algoritma.

**Tujuan:** Menyusun instruksi untuk mencapai tujuan di grid 4 × 4 sambil menghindari rintangan.

**Mekanik:**
- Terdapat lima tahap.
- Pemain menyusun blok instruksi maju, mundur, kanan, dan kiri.
- Tombol "Hapus" menghapus susunan instruksi.
- Tombol "Jalankan" mengeksekusi instruksi.
- Sistem memeriksa apakah rute mencapai tujuan tanpa menabrak rintangan.
- Data soal diambil dari `data/kastil.json`.
- Lima soal dipilih secara acak tanpa pengulangan dalam satu sesi.

**Visual dan audio:**
- Background: `background-7.png`.
- BGM: `music-background-7.mp3`.
- SFX: `hover.mp3` dan `click.mp3`.

Setelah lima tahap selesai, skor akhir dihitung dan disimpan sebelum membuka `hasil.html`.

### Screen 9 — Hasil Petualangan (`hasil.html`)

**Isi:**
- Nama pemain.
- Skor setiap pilar Computational Thinking.
- Total skor.
- Ringkasan pencapaian.

**Visual dan audio:**
- Background: `background-9.png`.
- BGM: `music-background-9.mp3`.

**Logika:**
- Membaca skor dari penyimpanan browser.
- Tombol "Lihat Detail" membuka `detail.html`.
- Tombol "Main Lagi" menghapus progres permainan sebelumnya dan membuka `index.html`.

### Screen 10 — Detail Kemampuan (`detail.html`)

**Isi:**
- Rincian skor Dekomposisi.
- Rincian skor Pengenalan Pola.
- Rincian skor Abstraksi.
- Rincian skor Algoritma.
- Keterangan kemampuan yang telah dicapai.

**Visual dan audio:**
- Background: `background-9.png`.
- BGM: `music-background-9.mp3`.

**Logika:**
- Membaca data skor yang sama dengan halaman hasil.
- Tombol "Kembali ke Ringkasan" membuka `hasil.html`.
- Musik tetap menggunakan BGM hasil tanpa memulai ulang apabila memungkinkan.

## 6. Pengelolaan Data dan Progres

Gunakan `localStorage` untuk menyimpan data yang perlu dipertahankan saat berpindah halaman.

Data minimal yang disimpan:

```javascript
{
    namaPemain: "Pemain",
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
}
```

Contoh di atas merupakan gambaran struktur data, bukan file JSON yang harus langsung dimuat.

Gunakan `JSON.stringify()` untuk menyimpan objek dan `JSON.parse()` untuk membacanya.

Buat fungsi sederhana di `js/penyimpanan.js`, misalnya:
- `simpanNamaPemain()`
- `ambilNamaPemain()`
- `simpanProgres()`
- `ambilProgres()`
- `simpanSkor()`
- `ambilSkor()`
- `resetPermainan()`

Jangan menggunakan `localStorage.clear()` apabila aplikasi memiliki data lain yang tidak berkaitan dengan game. Hapus hanya key milik game.

## 7. Arsitektur Audio

### 7.1. Prinsip Pengelolaan Audio

Audio dikelola menggunakan satu file `js/audio.js`.

Karena setiap halaman memiliki dokumen HTML sendiri, elemen audio tidak dapat mempertahankan pemutaran secara langsung ketika halaman baru dimuat. Oleh karena itu, gunakan pendekatan berikut:

1. Setiap halaman menentukan BGM yang digunakan.
2. Simpan identitas BGM aktif dalam `sessionStorage`.
3. Saat halaman baru dibuka, periksa apakah BGM yang diminta sama dengan BGM sebelumnya.
4. Jika sama, lanjutkan pemutaran dari posisi yang tersimpan apabila memungkinkan.
5. Jika berbeda, mulai musik yang baru.
6. Jika halaman tidak menggunakan BGM, hentikan musik.
7. SFX dipicu melalui event hover dan klik.

Catatan: browser dapat membatasi pemutaran audio otomatis. Musik sebaiknya mulai setelah interaksi pengguna, misalnya ketika tombol "Mulai Permainan" diklik.

### 7.2. Pembagian BGM

| Halaman | BGM | Perilaku |
|---|---|---|
| `index.html` | Background 1 | Berhenti saat navigasi |
| `narasi.html` | Background 2 | Berlanjut ke petunjuk dan peta |
| `petunjuk.html` | Background 2 | Berlanjut jika musik yang sama masih aktif |
| `peta.html` | Background 2 | Berhenti saat masuk wilayah |
| `hutan.html` | Background 3 | Khusus Hutan |
| `desa.html` | Background 4 | Khusus Desa |
| `gunung.html` | Background 5 | Khusus Gunung |
| `kastil.html` | Background 7 | Khusus Kastil |
| `hasil.html` | Background 9 | Berlanjut ke Detail |
| `detail.html` | Background 9 | Berlanjut dari Hasil |

Perpindahan halaman biasa akan memuat ulang elemen audio. Penyimpanan posisi musik membantu mempertahankan kesinambungan, tetapi bukan jaminan pemutaran benar-benar tanpa jeda.

### 7.3. SFX Global

Gunakan event listener untuk tombol dan elemen interaktif yang memiliki atribut tertentu, misalnya:

- `data-sfx-hover`
- `data-sfx-click`

Dengan demikian, tombol tidak perlu memiliki kode audio berulang kali.

Contoh:

```html
<button data-sfx-hover data-sfx-click>
    Mulai Permainan
</button>
```

SFX hover diputar ketika kursor memasuki tombol. SFX klik diputar ketika tombol ditekan.

## 8. Struktur Data JSON untuk Soal

Setiap wilayah memiliki file JSON tersendiri. Desa, Gunung, dan Kastil masing-masing wajib memiliki minimal 50 variasi soal.

Contoh `data/desa.json`:

```json
{
  "soal": [
    {
      "id": "desa-001",
      "jenis": "bentuk",
      "instruksi": "Pilih bentuk yang melengkapi pola jalan!",
      "pola": [
        "lingkaran",
        "persegi",
        "lingkaran",
        "persegi",
        "?"
      ],
      "opsi": [
        "segitiga",
        "lingkaran",
        "persegi"
      ],
      "jawaban": "lingkaran",
      "penjelasan": "Pola bergantian antara lingkaran dan persegi."
    },
    {
      "id": "desa-002",
      "jenis": "warna",
      "instruksi": "Pilih warna berikutnya!",
      "pola": [
        "merah",
        "biru",
        "merah",
        "biru",
        "?"
      ],
      "opsi": [
        "kuning",
        "merah",
        "hijau"
      ],
      "jawaban": "merah",
      "penjelasan": "Pola bergantian antara merah dan biru."
    }
  ]
}
```

Contoh tersebut hanya memuat dua soal sebagai ilustrasi. File final harus memiliki setidaknya 50 objek soal dengan ID unik.

Struktur JSON Gunung dan Kastil menyesuaikan kebutuhan mekaniknya. Gunung dapat menggunakan objek dengan kategori penting atau tidak penting. Kastil dapat menggunakan posisi awal, posisi tujuan, daftar rintangan, dan arah awal pemain.

### 8.1. Aturan Pengambilan Soal

1. Ambil seluruh soal menggunakan `fetch()`.
2. Periksa apakah permintaan berhasil.
3. Acak urutan soal.
4. Pilih lima soal berbeda untuk lima tahap.
5. Tampilkan soal sesuai urutan hasil pengacakan.
6. Tampilkan pesan kesalahan yang mudah dipahami apabila data gagal dimuat.

Jalankan website melalui server lokal, misalnya Live Server di Visual Studio Code. Jangan mengandalkan pembukaan file HTML langsung melalui `file://` karena `fetch()` dapat dibatasi browser.

## 9. Sistem Skor

Setiap wilayah memiliki skor tersendiri yang dihitung berdasarkan jawaban pemain.

Aturan skor harus konsisten dan ditetapkan sebelum pengujian. Contohnya:
- Jawaban benar mendapat poin.
- Jawaban salah tidak mendapat poin atau mengurangi kesempatan sesuai aturan game.
- Skor disimpan setelah tahap selesai.
- Skor akhir ditampilkan pada halaman hasil.
- Detail skor ditampilkan pada halaman detail.

Gunakan rumus persentase jika setiap wilayah memiliki jumlah poin maksimum yang sama atau lakukan normalisasi jika berbeda.

\[
\text{Persentase} =
\frac{\text{Skor diperoleh}}{\text{Skor maksimum}}\times 100\%
\]

## 10. Starter Code: Tahap Pertama

Tahap pertama pengembangan hanya berfokus pada:
1. Membuat `index.html`, `narasi.html`, `petunjuk.html`, dan `peta.html`.
2. Memastikan perpindahan halaman berjalan.
3. Memastikan BGM Background 1 berhenti saat berpindah halaman.
4. Memastikan BGM Background 2 berlanjut dari Narasi ke Petunjuk dan Peta.
5. Memastikan SFX hover dan klik dapat digunakan.
6. Menguji pemutaran audio setelah interaksi pengguna.

Setelah seluruh fungsi dasar berhasil, lanjutkan pengembangan mekanik Hutan, Desa, Gunung, dan Kastil secara bertahap.

Jangan langsung membuat seluruh game sekaligus. Selesaikan satu bagian, uji, kemudian lanjutkan ke bagian berikutnya.

## 11. Urutan Pengerjaan

1. **Tahap 1 — Kerangka website:** buat seluruh file HTML dan tautan navigasi.
2. **Tahap 2 — Tampilan:** terapkan background, tombol, dialog, dan layout.
3. **Tahap 3 — Audio:** implementasikan BGM dan SFX.
4. **Tahap 4 — Penyimpanan:** implementasikan nama pemain, progres, dan skor.
5. **Tahap 5 — Hutan:** buat mekanik drag and drop dan indikator komponen.
6. **Tahap 6 — Desa:** buat pemuatan JSON, pengacakan soal, dan pilihan jawaban.
7. **Tahap 7 — Gunung:** buat mekanik klasifikasi informasi.
8. **Tahap 8 — Kastil:** buat penyusunan instruksi dan simulasi grid.
9. **Tahap 9 — Hasil:** tampilkan ringkasan dan detail skor.
10. **Tahap 10 — Pengujian:** uji navigasi, audio, progres, pengacakan soal, dan seluruh kondisi penyelesaian.

## 12. Aturan Penggunaan Aset Gambar (WAJIB)

Seluruh visual gambar dalam game harus menggunakan file gambar eksternal. **Jangan menggunakan emoji sebagai karakter, objek, ikon wilayah, ikon tombol, dekorasi, ubin permainan, ilustrasi, maupun pengganti gambar lainnya.** Gunakan elemen HTML `<img>` untuk gambar yang menjadi bagian dari konten halaman dan gunakan CSS `background-image` untuk gambar latar belakang.

### 12.1. Aturan Penempatan Gambar

1. Gunakan `<img>` untuk karakter pemain, karakter pendukung, objek yang dapat diseret, material rumah, ikon wilayah, benda dalam soal, ilustrasi, dan gambar lain yang tampil sebagai elemen halaman.
2. Gunakan CSS `background-image` untuk background halaman atau area permainan yang memang berfungsi sebagai latar belakang.
3. Jangan menampilkan emoji sebagai pengganti aset gambar, termasuk ketika aset final belum tersedia. Jika aset belum tersedia, gunakan placeholder berbasis HTML/CSS sederhana dan beri komentar bahwa aset perlu dibuat; jangan menggantinya dengan emoji.
4. Simpan aset gambar di dalam folder `assets/images/` sesuai kategori yang sudah ditetapkan, seperti `backgrounds/`, `characters/`, `objects/`, `tiles/`, dan `icons/`.
5. Gunakan nama file yang deskriptif, huruf kecil, dan konsisten. Contoh: `karakter_pemain.png`, `rumah_dinding.png`, `ikon_hutan.png`, dan `background-1.png`.
6. Pastikan jalur file pada atribut `src` atau CSS `url(...)` sesuai dengan struktur direktori proyek.
7. Untuk setiap gambar, tambahkan komentar tepat sebelum elemen `<img>` atau aturan CSS terkait. Komentar harus mencantumkan nomor gambar, nama file, dan ukuran aset dalam piksel.
8. Gunakan nomor gambar yang konsisten dan unik di seluruh rancangan. Jika gambar yang sama digunakan di beberapa halaman, pertahankan nomor dan nama file yang sama.
9. Tentukan atribut `width` dan `height` pada elemen `<img>` berdasarkan ukuran tampilan yang direncanakan. Ukuran aset asli boleh dicantumkan di komentar apabila berbeda dari ukuran tampilannya.
10. Untuk gambar latar belakang, tulis komentar CSS yang mencantumkan nama file dan ukuran aset yang disarankan. Gunakan `background-size: cover` atau `contain` sesuai kebutuhan tampilan, dan jangan meregangkan gambar hingga merusak proporsinya.
11. Gunakan atribut `alt` yang menjelaskan gambar. Untuk gambar dekoratif yang tidak menyampaikan informasi, gunakan `alt=""`.
12. Untuk objek permainan yang ukurannya berubah sesuai layar, gunakan ukuran CSS responsif sambil mempertahankan rasio gambar. Ukuran pada komentar merupakan ukuran acuan aset atau ukuran tampilan awal, bukan larangan untuk menyesuaikannya.

### 12.2. Format Komentar dan Contoh

Gunakan format komentar HTML berikut untuk setiap elemen gambar:

```html
<!-- Gambar 1: karakter_pemain.png | Ukuran tampilan: 120x160 px | Aset: assets/images/characters/karakter_pemain.png -->
<img
    src="assets/images/characters/karakter_pemain.png"
    alt="Karakter pemain"
    width="120"
    height="160"
>
```

Untuk gambar yang digunakan sebagai background, gunakan komentar CSS:

```css
/* Gambar 2: background-1.png | Ukuran aset yang disarankan: 1920x1080 px */
body {
    background-image: url("../assets/images/backgrounds/background-1.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
```

Untuk gambar yang dipakai sebagai objek dalam permainan, tetap beri komentar pada elemen gambarnya:

```html
<!-- Gambar 3: material_kayu.png | Ukuran tampilan: 80x80 px | Aset: assets/images/objects/material_kayu.png -->
<img
    src="assets/images/objects/material_kayu.png"
    alt="Material kayu"
    width="80"
    height="80"
    draggable="true"
>
```

Angka pada contoh hanya ukuran acuan. Tentukan ukuran yang sesuai dengan kebutuhan visual dan mekanik setiap elemen. Jangan menganggap semua gambar harus berukuran sama.

### 12.3. Daftar Aset Gambar

Saat membuat atau mengubah halaman, sertakan daftar aset gambar yang digunakan. Daftar dapat ditulis dalam komentar HTML/CSS di dekat penggunaannya dan, bila jumlah aset banyak, dirangkum dalam tabel dokumentasi dengan kolom:

- Nomor gambar.
- Nama file.
- Lokasi file.
- Ukuran aset atau ukuran tampilan (px).
- Halaman atau wilayah yang menggunakan gambar.
- Keterangan fungsi gambar.

Jangan menggunakan satu nama file untuk gambar yang berbeda. Jika aset belum tersedia, tetap cantumkan nama file yang direncanakan dan tandai sebagai aset yang perlu dibuat.

### 12.4. Ketentuan Background

1. Semua background halaman yang menggunakan ilustrasi harus menggunakan file gambar, bukan emoji atau rangkaian simbol.
2. Gunakan file background yang sudah ditentukan pada rancangan masing-masing halaman, misalnya `background-1.png` untuk halaman awal dan `background-3.png` untuk wilayah Hutan.
3. Jika background dipasang melalui CSS eksternal, pastikan jalur relatif dihitung dari lokasi file CSS. Contohnya, dari folder `css/` menuju folder gambar adalah `../assets/images/backgrounds/background-1.png`.
4. Jika ada gambar dekoratif tambahan di atas background, gunakan elemen `<img>` dan beri komentar tersendiri.
5. Pastikan teks dan tombol tetap terbaca di atas background. Gunakan overlay CSS bila diperlukan tanpa mengganti gambar dengan emoji.

## 12. Instruksi untuk AI

Ketika membantu mengembangkan game ini:

- Gunakan Vanilla JavaScript dengan sintaks yang sederhana.
- Jelaskan fungsi kode secara bertahap menggunakan bahasa Indonesia.
- Jangan membuat SPA.
- Jangan menggabungkan semua mekanik ke dalam satu file JavaScript besar.
- Jangan menggunakan class atau abstraksi kompleks apabila fungsi biasa sudah mencukupi.
- Berikan kode lengkap untuk file yang sedang dikerjakan.
- Sebutkan lokasi file dan cara menjalankannya.
- Jangan mengubah struktur file yang sudah disepakati tanpa alasan yang jelas.
- Jika ada perubahan kode, jelaskan bagian yang berubah dan alasan perubahan tersebut.
- Prioritaskan kode yang mudah dibaca dan diperbaiki dibandingkan optimasi yang belum dibutuhkan.
- Pastikan contoh kode sesuai dengan struktur direktori dan nama file yang digunakan.
- Untuk data soal, pisahkan konten JSON dari logika JavaScript.
- Jangan mengklaim fitur sudah berfungsi sebelum kode dan alurnya benar-benar dapat diuji.
- Jangan gunakan emoji untuk menggantikan gambar apa pun di dalam game. Gunakan elemen HTML `<img>` untuk gambar konten dan CSS `background-image` untuk background.
- Setiap penggunaan gambar wajib diberi komentar HTML atau CSS yang mencantumkan nomor gambar, nama file, dan ukuran dalam piksel.
- Untuk elemen `<img>`, tentukan atribut `width` dan `height` sesuai ukuran tampilan yang direncanakan serta atribut `alt` yang sesuai.
- Untuk background CSS, tulis komentar CSS di dekat aturan `background-image` yang menyebutkan nama file dan ukuran aset yang disarankan.
- Jika aset gambar belum tersedia, gunakan placeholder HTML/CSS tanpa emoji dan beri nama file aset yang direncanakan pada komentar.
- Pastikan semua jalur gambar sesuai dengan struktur folder `assets/images/` dan konsisten saat gambar digunakan ulang di beberapa halaman.

**Tujuan akhir:** menghasilkan game edukasi web yang memiliki sepuluh halaman terpisah, empat wilayah permainan, audio yang dikelola dengan baik, minimal 50 variasi soal untuk setiap wilayah Desa, Gunung, dan Kastil, serta sistem skor dan progres yang sederhana dan mudah dipelihara oleh pemula.

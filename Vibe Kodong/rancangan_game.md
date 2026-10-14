# PROMPT: Pengembangan Web Game Edukasi "Misi Pulau Logika"

**Konteks & Peran:**
Bertindaklah sebagai Senior Front-End Web Game Developer (HTML5, CSS, Vanilla JavaScript) dan Game Designer. Saya ingin membuat game edukasi interaktif berbasis web. Tolong baca Game Design Document (GDD) di bawah ini yang mencakup konsep, alur UI/UX, manajemen aset (gambar & audio), dan persyaratan teknis. Setelah itu, bantu saya merancang arsitektur web dan langkah pembuatannya.

---

## 1. Ide Utama: "Misi Pulau Logika"

Konsep utama game ini adalah pemain (anak-anak) menjadi seorang penjelajah yang harus menyelesaikan berbagai misi di sebuah pulau untuk mencapai sebuah kastil. Setiap misi dirancang secara khusus untuk mengukur dan melatih 4 pilar *Computational Thinking*:
1. **Dekomposisi** (Hutan) - Membangun rumah
2. **Pengenalan Pola** (Desa) - Membangun jalan
3. **Abstraksi** (Gunung) - Memisahkan informasi penting
4. **Algoritma** (Kastil) - Menyusun rute jalan

**Teknologi Utama:** HTML, CSS, Vanilla JavaScript (Client-side rendering, SPA concept).

---

## 2. Struktur UI/UX, Flow Layar (10 Screen) & Manajemen Aset

Setiap layar memiliki spesifikasi logika visual (Background) dan Audio (BGM & SFX). *Note: BGM = Background Music, SFX = Sound Effect.*

### Screen 1: Landing Page
* **Isi:** Judul Game, Field input "Nama Pemain". Tombol "Mulai Permainan" (ke Screen 4) dan "Petunjuk" (ke Screen 3).
* **Visual & Audio:**
  * Background: `background 1`
  * BGM: `music background 1` (Terus dimainkan sampai pemain klik tombol pindah layar).
  * SFX: Bunyi *hover* dan bunyi *klik* saat kursor berinteraksi dengan tombol dan field input.

### Screen 2: Halaman Narasi
* **Isi:** Karakter memberikan narasi panduan (dibagi 3 dialog). Tombol "Next" dan "Back" di dialog box (buat dengan HTML/CSS).
* **Visual & Audio:**
  * Background: `background 2`
  * BGM: `music background 2` (Mulai diputar di sini, dan **tetap berlanjut/tidak putus** saat pindah ke Screen 3 dan Screen 4).
  * SFX: Bunyi *hover* dan bunyi *klik* pada tombol Next/Back.

### Screen 3: Petunjuk Permainan
* **Isi:** Panduan cara bermain di 4 lokasi. Tombol "Kembali" (ke Screen 1) dan "Mengerti" (ke Screen 4).
* **Visual & Audio:**
  * Background: `background 2`
  * BGM: `music background 2` (Masih berlanjut dari screen sebelumnya).
  * SFX: Bunyi *hover* dan bunyi *klik* pada tombol.

### Screen 4: Peta Pulau (Level Selection)
* **Isi:** Peta pulau dengan ikon Hutan, Desa, Gunung, dan Kastil.
* **Sistem Unlock:** Hutan terbuka di awal. Selesaikan Hutan -> Buka Desa -> Buka Gunung -> Buka Kastil.
* **Visual & Audio:**
  * Background: `background 2`
  * BGM: `music background 2` (Masih berlanjut. BGM ini baru akan **dimatikan** jika pemain masuk ke salah satu stage permainan).
  * SFX: Bunyi *hover* dan bunyi *klik* pada masing-masing ikon tempat (Hutan, Desa, Gunung, Kastil).

### Screen 5: Hutan (Membangun Rumah - Dekomposisi)
* **Tujuan:** Memecah masalah besar menjadi komponen kecil (dinding, pintu, jendela, atap, lampu).
* **Mekanik:** *Drag and Drop* objek. Terdapat 3 tahapan/level. Material diacak tiap level + 1 material pengecoh.
* **Tambahan UI:** Tampilkan **Indikator jumlah** pada setiap komponen rumah (Misal: `1/5`, artinya butuh 5 item dan 1 sudah terkumpul). Muncul tombol "Next Stage" setelah 1 rumah selesai.
* **Visual & Audio:**
  * Background: `background 3`
  * BGM: `music background 3` (Dimainkan khusus di halaman ini, mati saat ganti layar).
  * SFX: Bunyi *hover* di pilihan item, bunyi semacam *klik/drop* saat item berhasil di-drop ke komponen rumah, serta bunyi *hover/klik* pada tombol Next.

### Screen 6: Desa (Membangun Jalan - Pengenalan Pola)
* **Tujuan:** Melengkapi pola jalan yang rumpang (pola warna, bentuk, angka).
* **Mekanik:** Memilih ubin/blok jawaban. Terdapat 5 tahapan/level. Muncul tombol "Next Stage" setiap 1 level selesai.
* **Visual & Audio:**
  * Background: `background 4`
  * BGM: `music background 4` (Dimainkan khusus di halaman ini, mati saat ganti layar).
  * SFX: Bunyi *hover* dan *klik* pada opsi jawaban ubin dan tombol Next.

### Screen 7: Gunung (Mencari Jalan Utama - Abstraksi)
* **Tujuan:** Memisahkan informasi penting dari objek pengganggu/noise.
* **Mekanik:** *Drag and drop* atau klik untuk memisahkan informasi penting vs tidak penting. Terdapat 5 tahapan/level. Muncul tombol "Next Stage".
* **Visual & Audio:**
  * Background: `background 5`
  * BGM: `music background 5` (Dimainkan khusus di halaman ini, mati saat ganti layar).
  * SFX: Bunyi *hover* pada item, bunyi *klik/drop* saat memisahkan informasi, serta bunyi *hover/klik* pada tombol Next.

### Screen 8: Kastil (Mencari Jalan Masuk - Algoritma)
* **Tujuan:** Membuat rute instruksi di grid 4x4 untuk menghindari rintangan.
* **Mekanik:** Menyusun blok instruksi (maju, mundur, kanan, kiri). Terdapat 5 tahapan/level. Tombol "Hapus", "Jalankan", dan "Next Stage".
* **Visual & Audio:**
  * Background: `background 7`
  * BGM: `music background 7` (Dimainkan khusus di halaman ini, mati saat ganti layar).
  * SFX: Bunyi *hover* dan *klik* pada blok perintah, tombol Hapus, Jalankan, dan Next.

### Screen 9: Hasil Petualangan (Ringkasan)
* **Isi:** Rekap skor pemain berdasarkan 4 pilar. Tombol "Lihat Detail" (ke Screen 10) dan "Main Lagi" (Reset ke screen 1).
* **Visual & Audio:**
  * Background: `background 9`
  * BGM: `music background 9` (Mulai diputar di sini, dan **tetap berlanjut** ke Screen 10. Hanya mati jika mengulang permainan).
  * SFX: Bunyi *hover* dan *klik* pada tombol.

### Screen 10: Detail Kemampuan
* **Isi:** Breakdown skor lebih terperinci. Tombol "Kembali ke Ringkasan" (ke Screen 9).
* **Visual & Audio:**
  * Background: `background 9`
  * BGM: `music background 9` (Terus berlanjut dari Screen 9).
  * SFX: Bunyi *hover* dan *klik* pada tombol kembali.

---

## 3. Persyaratan Teknis Tambahan (Data Soal JSON)
* Tahap **Desa**, **Gunung**, dan **Kastil** wajib mengambil data variasi soal dari file eksternal (misal: `data.json`).
* Harus ada **minimal 50 variasi/kombinasi soal** di dalam file JSON tersebut per wilayah.
* Sistem JavaScript harus men-*fetch* soal secara acak untuk mengisi ke-5 stage di setiap wilayah.

---

## Instruksi untuk AI (Task):
Berdasarkan GDD di atas, tolong berikan:
1. **Saran Struktur Direktori:** Susunan file HTML, CSS, JS, aset gambar (backgrounds), audio (BGM & SFX), dan JSON.
2. **Arsitektur State & Audio:** Berikan pola JavaScript (Vanilla) yang rapi untuk membuat *Single Page Application* (SPA) dengan pergantian `class`. Khususnya buatkan **Audio Manager Class/Objek** untuk menangani logika BGM yang terus berlanjut (cross-screen) atau berhenti, serta pemicu SFX hover/klik secara global.
3. **Struktur Data JSON:** Buatkan contoh format JSON untuk menyimpan varian soal (contohkan pola bentuk untuk Desa).
4. **Starter Code (Langkah 1):** Berikan saya *boilerplate* HTML dasar dan skrip `AudioManager.js` beserta fungsi transisi layar agar saya bisa mengetes integrasi BGM antar layar (Screen 1 ke 4) terlebih dahulu.
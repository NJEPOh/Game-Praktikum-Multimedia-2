let quizDatabase = {};

// Fetch data.json saat web pertama kali dimuat
fetch('js/data.json')
    .then(response => {
        if (!response.ok) throw new Error("File JSON tidak ditemukan atau diblokir CORS");
        return response.json();
    })
    .then(data => {
        quizDatabase = data;
    })
    .catch(err => {
        console.warn("Gagal load file JSON (CORS Local), menggunakan data Fallback:", err);
        // Data cadangan agar game tetap jalan saat ditest secara lokal (file://)
        quizDatabase = {
            "desa": [
                {
                    "id": 1,
                    "pattern": [
                        "Assets/Pola/pola_a.png",
                        "Assets/Pola/pola_b.png",
                        "Assets/Pola/pola_a.png",
                        "Assets/Pola/pola_b.png",
                        "Assets/Pola/pola_a.png"
                    ],
                    "options": [
                        "Assets/Pola/pola_b.png",
                        "Assets/Pola/pola_c.png",
                        "Assets/Pola/pola_a.png"
                    ],
                    "correctAnswer": "Assets/Pola/pola_b.png",
                    "rule": "BERGANTIAN"
                },
                {
                    "id": 2,
                    "pattern": [
                        "Assets/Pola/pola_1.png",
                        "Assets/Pola/pola_2.png",
                        "Assets/Pola/pola_3.png",
                        "Assets/Pola/pola_4.png",
                        "Assets/Pola/pola_5.png"
                    ],
                    "options": [
                        "Assets/Pola/pola_2.png",
                        "Assets/Pola/pola_4.png",
                        "Assets/Pola/pola_6.png"
                    ],
                    "correctAnswer": "Assets/Pola/pola_6.png",
                    "rule": "BERTAMBAH"
                },
                {
                    "id": 3,
                    "pattern": [
                        "Assets/Pola/pola_merah.png",
                        "Assets/Pola/pola_merah.png",
                        "Assets/Pola/pola_biru.png",
                        "Assets/Pola/pola_merah.png",
                        "Assets/Pola/pola_merah.png"
                    ],
                    "options": [
                        "Assets/Pola/pola_kuning.png",
                        "Assets/Pola/pola_biru.png",
                        "Assets/Pola/pola_merah.png"
                    ],
                    "correctAnswer": "Assets/Pola/pola_biru.png",
                    "rule": "BERULANG"
                }
            ]
        };
    });

// --- 1. STATE & KONFIGURASI ---
const gameState = {
    playerName: "",
    unlocked: {
        hutan: true,   // Terbuka di awal
        desa: false,
        gunung: false,
        kastil: false
    }
};

const screenConfigs = {
    'screen-1': { bgm: 'bgm_1' },
    'screen-2': { bgm: 'bgm_2' },
    'screen-3': { bgm: 'bgm_2' },
    'screen-4': { bgm: 'bgm_2' }
};

// Data Dialog Narator
const dialogs = [
    "Kamu sekarang berada di sebuah pulau.<br><br>Kamu harus menyelesaikan misi untuk mencapai tujuan utama.",
    "Tujuan utama adalah mencapai kastil di tengah pulau.<br><br>Selesaikan misi yang diberikan dan kamu akan mencapai kastil tersebut.",
    "!! SELAMAT BERMAIN !!"
];
let currentDialogIndex = 0;


// --- 2. FUNGSI TRANSISI ---
function navigateTo(targetScreenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(targetScreenId).classList.remove('hidden');

    const config = screenConfigs[targetScreenId];
    if (config && config.bgm) audioContext.playBGM(config.bgm);
    else audioContext.stopBGM();

    // Reset Narator jika masuk ke Screen 2
    if (targetScreenId === 'screen-2') {
        currentDialogIndex = 0;
        updateNaratorUI();
    }

    // Update UI Peta jika masuk ke Screen 4
    if (targetScreenId === 'screen-4') {
        updatePetaUI();
    }
}


// --- 3. LOGIKA SPESIFIK LAYAR ---
function updateNaratorUI() {
    document.getElementById('narator-text').innerHTML = dialogs[currentDialogIndex];
    // Sembunyikan tombol "sebelumnya" jika di dialog pertama
    document.getElementById('btn-narator-prev').style.visibility = (currentDialogIndex === 0) ? 'hidden' : 'visible';
}

function updatePetaUI() {
    // Cek state game dan hilangkan class 'locked' jika true
    if (gameState.unlocked.desa) document.getElementById('btn-desa').classList.remove('locked');
    if (gameState.unlocked.gunung) document.getElementById('btn-gunung').classList.remove('locked');
    if (gameState.unlocked.kastil) document.getElementById('btn-kastil').classList.remove('locked');
}


// --- 4. EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {

    // Efek Suara Global
    document.addEventListener('mouseover', (e) => { if (e.target.closest('.btn')) audioContext.playHover(); });
    document.addEventListener('mousedown', (e) => { if (e.target.closest('.btn')) audioContext.playClick(); });

    // Tombol Screen 1 (Home)
    document.getElementById('btn-mulai').addEventListener('click', () => {
        const inputName = document.getElementById('player-name').value.trim();
        if (inputName === "") {
            alert("Harap masukkan namamu terlebih dahulu!");
            return;
        }
        gameState.playerName = inputName; // Simpan nama
        navigateTo('screen-2');
    });

    document.getElementById('btn-petunjuk').addEventListener('click', () => navigateTo('screen-3'));

    // Tombol Screen 2 (Narator)
    document.getElementById('btn-narator-prev').addEventListener('click', () => {
        if (currentDialogIndex > 0) {
            currentDialogIndex--;
            updateNaratorUI();
        }
    });

    document.getElementById('btn-narator-next').addEventListener('click', () => {
        if (currentDialogIndex < dialogs.length - 1) {
            currentDialogIndex++;
            updateNaratorUI();
        } else {
            // Jika dialog habis, lanjut ke Peta
            navigateTo('screen-4');
        }
    });

    // Tombol Screen 3 (Petunjuk)
    document.getElementById('btn-kembali-home').addEventListener('click', () => navigateTo('screen-1'));
    document.getElementById('btn-mengerti').addEventListener('click', () => navigateTo('screen-2'));

    // Tombol Screen 4 (Peta) - Sementara hanya Hutan yang aktif
    document.getElementById('btn-hutan').addEventListener('click', () => {
        alert("Masuk ke Stage Hutan! (Segera dibuat)");
        // navigateTo('screen-5'); 
    });

    // Inisialisasi awal
    navigateTo('screen-1');

    // ==========================================
    // LOGIKA STAGE HUTAN (DEKOMPOSISI)
    // ==========================================
    const hutanState = {
        level: 1,
        maxLevel: 1,
        requirements: { dinding: 1, atap: 2, pintu: 1, jendela: 2, lampu: 1 },
        collected: { dinding: 0, atap: 0, pintu: 0, jendela: 0, lampu: 0 },
        decoys: ['Bunga', 'Air', 'Batu', 'Kayu'] // Material pengecoh
    };

    function initHutanLevel() {
        // Reset state
        hutanState.collected = { dinding: 0, atap: 0, pintu: 0, jendela: 0, lampu: 0 };
        document.getElementById('hutan-level-text').innerText = hutanState.level;
        document.getElementById('btn-next-hutan').classList.add('hidden');

        // Reset UI Dropzone (Hitam putih kembali)
        const dropzones = document.querySelectorAll('.dropzone');
        dropzones.forEach(dz => dz.classList.add('grayscale'));
        updateHutanCounterUI();

        // Generate Material Array (Benar + 1 Pengecoh)
        let materials = [];
        materials.push({ type: 'dinding', src: 'Assets/Dinding.png' });
        for (let i = 0; i < 2; i++) materials.push({ type: 'atap', src: 'Assets/Genteng.png' });
        materials.push({ type: 'pintu', src: 'Assets/Pintu.png' });
        for (let i = 0; i < 2; i++) materials.push({ type: 'jendela', src: 'Assets/Jendela.png' });
        materials.push({ type: 'lampu', src: 'Assets/Lampu.png' });

        // Tambah 1 pengecoh acak berdasarkan level
        const decoyName = hutanState.decoys[hutanState.level - 1];
        materials.push({ type: 'decoy', src: `Assets/${decoyName}.png` });

        // Acak posisi material (Fisher-Yates Shuffle)
        for (let i = materials.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [materials[i], materials[j]] = [materials[j], materials[i]];
        }

        // Render ke HTML
        const container = document.getElementById('material-container');
        container.innerHTML = '';
        materials.forEach((mat, index) => {
            const img = document.createElement('img');
            img.src = mat.src;
            img.className = 'draggable';
            img.draggable = true;
            img.dataset.type = mat.type;
            img.id = `mat-${hutanState.level}-${index}`;
            img.style.height = '80px';

            // Event Drag Start
            img.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                e.dataTransfer.setData('type', e.target.dataset.type);
                audioContext.playHover(); // Bunyi saat ditarik
            });
            container.appendChild(img);
        });
    }

    function updateHutanCounterUI() {
        ['dinding', 'atap', 'pintu', 'jendela', 'lampu'].forEach(key => {
            document.getElementById(`req-${key}`).innerText = `${hutanState.collected[key]}/${hutanState.requirements[key]}`;
            // Jika sudah memenuhi syarat, warnai komponen (hapus grayscale)
            if (hutanState.collected[key] >= hutanState.requirements[key]) {
                document.getElementById(`dz-${key}`).classList.remove('grayscale');
            }
        });
    }

    function checkHutanWinCondition() {
        const { collected, requirements } = hutanState;
        if (collected.dinding >= requirements.dinding &&
            collected.atap >= requirements.atap &&
            collected.pintu >= requirements.pintu &&
            collected.jendela >= requirements.jendela &&
            collected.lampu >= requirements.lampu) {

            document.getElementById('btn-next-hutan').classList.remove('hidden');
        }
    }

    // Setup Dropzones
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Wajib agar bisa drop
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const draggedType = e.dataTransfer.getData('type');
            const targetType = zone.dataset.target;

            // Cek apakah material sesuai dengan bagian rumahnya
            if (draggedType === targetType) {
                // Jangan tambah jika sudah penuh
                if (hutanState.collected[targetType] < hutanState.requirements[targetType]) {
                    hutanState.collected[targetType]++;

                    // Hilangkan gambar yang didrag
                    const draggedId = e.dataTransfer.getData('text/plain');
                    document.getElementById(draggedId).remove();

                    audioContext.playClick(); // Bunyi berhasil
                    updateHutanCounterUI();
                    checkHutanWinCondition();
                }
            } else {
                // Efek salah (opsional: bisa tambah SFX salah di sini)
                console.log("Material salah tempat!");
            }
        });
    });

    // Tombol Next Stage
    document.getElementById('btn-next-hutan').addEventListener('click', () => {
        if (hutanState.level < hutanState.maxLevel) {
            hutanState.level++;
            initHutanLevel();
        } else {
            alert("Hutan Selesai! Desa Terbuka.");
            gameState.unlocked.desa = true; // Unlock Desa
            updatePetaUI();
            navigateTo('screen-4'); // Kembali ke peta
        }
    });

    // Update Event Listener Tombol Peta (Hubungkan Hutan ke Screen 5)
    document.getElementById('btn-hutan').addEventListener('click', () => {
        initHutanLevel();
        navigateTo('screen-5');
    });

    // ==========================================
    // LOGIKA STAGE DESA (PENGENALAN POLA)
    // ==========================================
    const desaState = {
        level: 1,
        maxLevel: 1,
        questions: [],
        currentQ: null,
        selectedJawabanImg: null,
        selectedRule: null
    };

    function initDesaLevel() {
        // Jika baru level 1, acak dan ambil soal
        if (desaState.level === 1) {
            let allDesaQ = [...quizDatabase.desa];
            allDesaQ.sort(() => 0.5 - Math.random()); // Acak array

            // Batasi maxLevel sesuai jumlah soal yang tersedia di database saat ini
            desaState.maxLevel = allDesaQ.length < 5 ? allDesaQ.length : 5;
            desaState.questions = allDesaQ.slice(0, desaState.maxLevel);
        }

        desaState.currentQ = desaState.questions[desaState.level - 1];
        desaState.selectedJawabanImg = null;
        desaState.selectedRule = null;

        // Update teks UI
        document.getElementById('desa-level-text').innerText = desaState.level;
        document.getElementById('btn-next-desa-text').innerText = "CEK JAWABAN";

        // Sembunyikan gambar di kotak jawaban kosong dan hilangkan highlight
        document.getElementById('pola-jawaban').style.display = 'none';
        document.querySelectorAll('.opsi-jawaban').forEach(el => el.classList.remove('opsi-selected'));
        document.querySelectorAll('.opsi-aturan').forEach(el => el.classList.remove('aturan-selected'));

        // Sembunyikan tombol konfirmasi hingga keduanya dipilih
        document.getElementById('btn-next-desa').classList.add('hidden');

        // Render Gambar Soal
        for (let i = 0; i < 5; i++) {
            document.getElementById(`pola-${i}`).src = `Assets/${desaState.currentQ.pattern[i]}`;
        }

        // Render Opsi Jawaban
        for (let i = 0; i < 3; i++) {
            document.getElementById(`opsi-${i}`).src = `Assets/${desaState.currentQ.options[i]}`;
        }
    }

    function checkDesaSelection() {
        if (desaState.selectedJawabanImg && desaState.selectedRule) {
            document.getElementById('btn-next-desa').classList.remove('hidden');
        }
    }

    // Event Listener Klik Opsi Gambar
    document.querySelectorAll('.opsi-jawaban').forEach(opsi => {
        opsi.addEventListener('click', (e) => {
            // Hapus highlight sebelumnya
            document.querySelectorAll('.opsi-jawaban').forEach(el => el.classList.remove('opsi-selected'));

            // Tambahkan highlight pada yang diklik
            const box = e.target.closest('.opsi-jawaban');
            box.classList.add('opsi-selected');

            // Masukkan gambar ke kotak jawaban
            const imgSrc = box.querySelector('img').src;
            const filename = imgSrc.split('/').pop();

            const polaJawaban = document.getElementById('pola-jawaban');
            polaJawaban.src = imgSrc;
            polaJawaban.style.display = 'block';

            desaState.selectedJawabanImg = filename;
            audioContext.playClick();
            checkDesaSelection();
        });
    });

    // Event Listener Klik Aturan
    document.querySelectorAll('.opsi-aturan').forEach(aturan => {
        aturan.addEventListener('click', (e) => {
            document.querySelectorAll('.opsi-aturan').forEach(el => el.classList.remove('aturan-selected'));

            const btn = e.target.closest('.opsi-aturan');
            btn.classList.add('aturan-selected');

            desaState.selectedRule = btn.dataset.rule;
            audioContext.playClick();
            checkDesaSelection();
        });
    });

    // Event Listener Tombol Konfirmasi / Next Stage
    document.getElementById('btn-next-desa').addEventListener('click', () => {
        const btnText = document.getElementById('btn-next-desa-text').innerText;

        if (btnText === "CEK JAWABAN") {
            // Validasi Jawaban
            const isJawabanBenar = desaState.selectedJawabanImg === desaState.currentQ.correctAnswer;
            const isAturanBenar = desaState.selectedRule === desaState.currentQ.rule;

            if (isJawabanBenar && isAturanBenar) {
                audioContext.playClick(); // Bisa diganti SFX benar
                document.getElementById('btn-next-desa-text').innerText = "LANJUT TAHAP BERIKUTNYA";
                document.getElementById('btn-next-desa').style.background = "#00FFFB";
            } else {
                alert("Jawaban atau aturan polanya masih kurang tepat, ayo coba lagi!");
                // Opsional: play sfx_wrong.mp3 di sini
            }
        } else {
            // Lanjut ke level berikutnya atau selesaikan stage
            if (desaState.level < desaState.maxLevel) {
                desaState.level++;
                initDesaLevel();
            } else {
                alert("Desa Selesai! Gunung Terbuka.");
                gameState.unlocked.gunung = true;
                updatePetaUI();
                navigateTo('screen-4');
            }
        }
    });

    // Update Event Listener Tombol Peta untuk membuka Desa
    document.getElementById('btn-desa').addEventListener('click', () => {
        // Cek jika data.json gagal dimuat
        if (!quizDatabase.desa) {
            alert("Memuat data soal...");
            return;
        }
        initDesaLevel();
        navigateTo('screen-6');
    });
});
class AudioManager {
    constructor() {
        this.currentBGM = null;
        this.bgmAudio = new Audio();
        this.bgmAudio.loop = true;

        // Path audio SFX
        this.sfxHover = new Audio('Assets/audio/sfx_hover.mp3');
        this.sfxClick = new Audio('Assets/audio/sfx_click.mp3');
    }

    playBGM(trackName) {
        if (this.currentBGM === trackName) return;

        this.currentBGM = trackName;
        this.bgmAudio.src = `Assets/audio/${trackName}.mp3`;

        // Coba putar audio dan tangkap "Promise" yang dikembalikan
        const playPromise = this.bgmAudio.play();

        // Menangani pemblokiran Autoplay dari browser
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay diblokir browser. Menunggu interaksi pertama pemain...");

                // Fungsi untuk memaksa audio menyala saat ada klik pertama
                const startAudio = () => {
                    this.bgmAudio.play();
                    // Hapus event listener setelah musik berhasil menyala agar tidak menumpuk
                    document.removeEventListener('click', startAudio);
                    document.removeEventListener('keydown', startAudio);
                };

                // Dengarkan interaksi pertama di manapun pada layar
                document.addEventListener('click', startAudio);
                document.addEventListener('keydown', startAudio);
            });
        }
    }

    stopBGM() {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
        this.currentBGM = null;
    }

    playHover() {
        this.sfxHover.currentTime = 0;
        this.sfxHover.play().catch(e => { });
    }

    playClick() {
        this.sfxClick.currentTime = 0;
        this.sfxClick.play().catch(e => { });
    }
}

// Inisialisasi global agar bisa dipakai di mana saja
const audioContext = new AudioManager();
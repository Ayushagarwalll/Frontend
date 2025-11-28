const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const playlistEl = document.getElementById("playlist");

let currentIndex = 0;

const songs = [
    { title: "Superman", artist: "Eminem", src: "C:\UNI\Frontend\musicplayer\music\eminem-s-song_eminem-superman.mp3" },
    { title: "Without me", artist: "Eminem", src: "C:\UNI\Frontend\musicplayer\music\eminem-s-song_eminem-without-me.mp3" },
    { title: "Without me", artist: "Eminem", src: "C:\UNI\Frontend\musicplayer\music\eminem-s-song_eminem-without-me.mp3" }
];

function loadSong(index) {
    const song = songs[index];
    if (!song) return;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    audio.src = song.src;
    highlightActiveSong();
}

function playSong() {
    audio.play();
    playBtn.textContent = "Pause";
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "Play";
}

playBtn.addEventListener("click", function () {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener("click", function () {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }
    loadSong(currentIndex);
    playSong();
});

nextBtn.addEventListener("click", function () {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }
    loadSong(currentIndex);
    playSong();
});

audio.addEventListener("timeupdate", function () {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
        updateTimeDisplay();
    }
});

progress.addEventListener("input", function () {
    if (audio.duration) {
        const seekTime = (progress.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
});

audio.addEventListener("loadedmetadata", function () {
    updateTimeDisplay();
});

audio.addEventListener("ended", function () {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }
    loadSong(currentIndex);
    playSong();
});

volumeSlider.addEventListener("input", function () {
    audio.volume = volumeSlider.value;
});

function updateTimeDisplay() {
    const current = formatTime(audio.currentTime);
    const total = audio.duration ? formatTime(audio.duration) : "0:00";
    currentTimeEl.textContent = current;
    durationEl.textContent = total;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    const padded = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + padded;
}

function buildPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;
        li.innerHTML = `
            <div>${song.title}</div>
            <span>${song.artist}</span>
        `;
        li.addEventListener("click", function () {
            const i = Number(li.dataset.index);
            currentIndex = i;
            loadSong(currentIndex);
            playSong();
        });
        playlistEl.appendChild(li);
    });
}

function highlightActiveSong() {
    const items = playlistEl.querySelectorAll("li");
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

buildPlaylist();
loadSong(currentIndex);
audio.volume = volumeSlider.value;

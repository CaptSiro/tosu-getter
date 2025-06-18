import WebSocketManager from './socket.js';
import Cache from './Cache.js';

const ID = "id";
const ARTIST = "artist";
const TITLE = "title";
const VERSION = "version";
const BACKGROUND = "background";
const BACKGROUND_SOURCE = "background-source";
const AUDIO_SOURCE = "audio-source";

const socket = new WebSocketManager('127.0.0.1:24050');

const background = document.querySelector(".beatmap-background");
const title = document.querySelector(".beatmap-title");
const artist = document.querySelector(".beatmap-artist");

const cache = new Cache();

socket.api_v2(data => {
    const { directPath, beatmap } = data;

    cache.set(VERSION, beatmap.version);
    cache.set(ID, beatmap.id);

    if (cache.set(TITLE, beatmap.title)) {
        title.textContent = beatmap.title;
    }

    if (cache.set(ARTIST, beatmap.artist)) {
        artist.textContent = beatmap.artist;
    }

    if (cache.set(BACKGROUND, directPath.beatmapBackground)) {
        const source = createBeatmapBackground(data);
        background.src = source;
        cache.set(BACKGROUND_SOURCE, source);
    }

    cache.set(AUDIO_SOURCE, createBeatmapAudio(data));
}, []);



const getBackground = document.querySelector(".get-background");
const getAudio = document.querySelector(".get-audio");

getBackground.addEventListener("click", async () => {
    const url = new URL("http://localhost/osu-getter-v2/background.php");
    url.searchParams.set("source", cache.get(BACKGROUND_SOURCE));
    url.searchParams.set("name", cache.get(ARTIST) + " - " + cache.get(TITLE) + " (" + cache.get(ID) + ")");

    await get(url);
});

getAudio.addEventListener("click", async () => {
    const url = new URL("http://localhost/osu-getter-v2/audio.php");
    url.searchParams.set("source", cache.get(AUDIO_SOURCE));
    url.searchParams.set("name", cache.get(ARTIST) + " - " + cache.get(TITLE) + " (" + cache.get(ID) + ")");

    await get(url);
});

async function get(url) {
    const response = await fetch(url);
    const json = await response.json();

    if ("error" in json) {
        alert(json.error);
    }

    if ("message" in json) {
        alert(json.message);
    }
}



function createBeatmapBackground(data) {
    const { directPath, folders } = data;
    const path = directPath.beatmapBackground.replace(folders.songs, '');
    return `http://127.0.0.1:24050/files/beatmap/${path}`;
}

function createBeatmapAudio(data) {
    const { directPath, folders } = data;
    const path = directPath.beatmapAudio.replace(folders.songs, '');
    return `http://127.0.0.1:24050/files/beatmap/${path}`;
}
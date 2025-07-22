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
    const url = new URL("http://localhost/tosu-getter/background.php");
    url.searchParams.set("source", cache.get(BACKGROUND_SOURCE));
    url.searchParams.set("name", cache.get(ARTIST) + " - " + cache.get(TITLE) + " (" + cache.get(ID) + ")");

    if (await ping()) {
        await get(url);
        return;
    }

    await download(url);
});

getAudio.addEventListener("click", async () => {
    const url = new URL("http://localhost/tosu-getter/audio.php");
    url.searchParams.set("source", cache.get(AUDIO_SOURCE));
    url.searchParams.set("name", cache.get(ARTIST) + " - " + cache.get(TITLE) + " (" + cache.get(ID) + ")");

    if (await ping()) {
        await get(url);
        return;
    }

    await download(url);
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

async function download(url) {
    const response = await fetch(url.searchParams.get("source"));
    if (!response.ok) {
        alert("Could not download requested file");
        return;
    }

    const blob = await response.blob();
    const anchor = document.createElement("a");

    anchor.download = url.searchParams.get("name") + '.' + await getFileExtension(blob);
    anchor.href = URL.createObjectURL(blob);

    anchor.click();
}

async function ping() {
    const response = await fetch("http://localhost/tosu-getter/ping.php");
    return response.ok;
}



async function getFileExtension(blob) {
    const buffer = await blob.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Image formats
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return "png";
    }
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        return "jpg";
    }
    if (String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" ||
        String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a") {
        return "gif";
    }
    if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
        return "bmp";
    }
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
        return "ico";
    }
    if (
        bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00 ||
        bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A
    ) {
        return "tif";
    }

    // Audio formats
    if (String.fromCharCode(...bytes.slice(0, 3)) === "ID3" ||
        (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0)) {
        return "mp3";
    }
    if (String.fromCharCode(...bytes.slice(0, 4)) === "OggS") {
        return "ogg";
    }
    if (String.fromCharCode(...bytes.slice(8, 12)) === "WAVE") {
        return "wav";
    }
    if (String.fromCharCode(...bytes.slice(4, 8)) === "ftyp") {
        // MP4 container, check major brand
        const brand = String.fromCharCode(...bytes.slice(8, 12));
        if (brand.startsWith("M4A") || brand === "mp42" || brand === "isom") {
            return "mp4";
        }
    }
    if (String.fromCharCode(...bytes.slice(0, 4)) === "fLaC") {
        return "flac";
    }

    return "bin";
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
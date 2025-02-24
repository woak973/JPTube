<template>
    <div class="videojs-container">
        <video id="videojs-player" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264">
        </video>
    </div>
</template>

<script setup lang="ts">
import { Innertube, UniversalCache } from 'youtubei.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from 'video.js/dist/types/player';

const props = defineProps({
    videoId: String,
});

let player:Player;


onMounted(async () => {
    console.log("s");
    if (props.videoId) {
        player = videojs('videojs-player');
        console.log(player);
        console.log("a");
        const langStore = useLangStore();
        const locationStore = useLocationStore();

        const DLlang = langStore.lang || 'ja';
        const DLlocation = locationStore.location || 'JP';
        const DLyt = await Innertube.create({
            fetch: PlayerfetchFn,
            cache: new UniversalCache(false),
            lang: DLlang,
            location: DLlocation,
        });

        const DLResults = await DLyt.getInfo(props.videoId);
        const stream = await DLResults.download();
        const reader = stream.getReader();
        const chunks = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
        }

        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        console.log(url);

        // Initialize Video.js player and set the source
        player.src({
            src: url,
            type: "video/webm"
        });
    }
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});
</script>

<style scoped>
.videojs-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;

}

.video-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
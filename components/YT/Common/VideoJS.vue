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

let player: Player;

const seek = (seconds: number) => {
    if (player) {
        player.currentTime(seconds);
        console.log('Seeking to', seconds);
    } else {
        console.error('Video element is not found');
    }
};


onMounted(async () => {
    if (props.videoId) {
        player = videojs('videojs-player');
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
        try {
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

            player.src({
                src: url,
                type: "video/webm"
            });
        } catch (e) {
            if (DLResults.streaming_data && DLResults.streaming_data.hls_manifest_url) {
                const uri = DLResults.streaming_data.hls_manifest_url;
                player.src({
                    src: uri,
                    type: "application/x-mpegURL"
                });
            } else {
                throw e;
            }
        }
    }
});

onBeforeUnmount(() => {
    if (player) {
        player.dispose();
    }
});

defineExpose({ seek });

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
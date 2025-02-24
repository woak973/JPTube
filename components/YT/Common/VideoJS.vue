<template>
</template>

<script setup lang="ts">
import { Innertube, UniversalCache } from 'youtubei.js'

const props = defineProps({
    route: String
});
if (props.route) {
    const langStore = useLangStore();
    const locationStore = useLocationStore();

    const DLlang = langStore.lang || 'ja';
    const DLlocation = locationStore.location || 'JP';
    const DLyt = await Innertube.create({
        fetch: PlayerfetchFn,
        cache: new UniversalCache(false),
        lang: DLlang,
        location: DLlocation
    });

    const DLResults = await DLyt.getInfo(props.route);
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
}
</script>
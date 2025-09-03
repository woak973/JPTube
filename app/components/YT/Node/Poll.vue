<template>
  <template v-if="data">
    <v-card-subtitle>{{ data.total_votes?.text }}</v-card-subtitle>
    <v-row dense>
      <template v-for="choise in data.choices">
        <v-col cols="12">
          <v-card elevation="16">
            <v-row>
              <v-col cols="3" md="2" lg="1" class="d-flex align-center justify-center image">
                <v-img :src="getProxifiedUrl(choise.image?.[0]?.url || '')" aspect-ratio="16/9" rounded>
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate />
                    </div>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="9" md="10" lg="11" class="description">
                <v-card-title class="small-text omit">{{ choise.text }}</v-card-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </template>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.Poll,
});
</script>

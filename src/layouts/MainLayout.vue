<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fitbit"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        />
        <q-toolbar-title> Task Tracker </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :leftDrawerOpen="leftDrawerOpen" />
    </q-page-container>
  </q-layout>
</template>

<script>
import MainPageVue from "src/pages/MainPage.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    MainPageVue,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

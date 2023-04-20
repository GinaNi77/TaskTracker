<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-regular q-mb-md">Команда</div>
    <q-list v-for="item in team_pages" :key="item.id">
      <q-item
        clickable
        v-ripple
        @click="
          openNewPage(item.id);
          $emit('update:selectedPage', selectedTeamPage);
          $emit('openPage');
        "
      >
        <q-item-section avatar>
          <q-icon color="primary" name="fitbit" />
        </q-item-section>

        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import PerformerUser from "src/components/PerformerUser.vue";
import ResponsibleUser from "src/components/ResponsibleUser.vue";

export default defineComponent({
  name: "team-page",
  props: ["team_pages", "selectedPage"],
  components: {
    PerformerUser,
    ResponsibleUser,
  },

  setup() {
    const selectedTeamPage = ref("Команда");
    const openNewPage = (id) => {
      selectedTeamPage.value = id;
    };
    return {
      openNewPage,
      selectedTeamPage,
    };
  },
});
</script>
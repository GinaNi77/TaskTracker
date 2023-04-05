<template>
  <div class="q-pa-md">
    <AddPerformerUser v-if="selectedTeamPage === 'Исполнители'" />
    <AddResponsibleUser v-else-if="selectedTeamPage === 'Ответственные'" />
    <div class="text-h5 text-weight-regular q-mb-md">Команда</div>
    <q-list v-for="item in team_pages" :key="item.id">
      <q-item clickable v-ripple @click="openNewPage(item.label)">
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
import AddPerformerUser from "../components/AddPerformerUser.vue";
import AddResponsibleUser from "../components/AddResponsibleUser.vue";

export default defineComponent({
  name: "team-page",
  props: ["team_pages"],
  components: {
    AddPerformerUser,
    AddResponsibleUser,
  },

  setup() {
    const selectedTeamPage = ref("Команда");
    const openNewPage = (label) => {
      selectedTeamPage.value = label;
    };
    return {
      openNewPage,
      selectedTeamPage,
    };
  },
});
</script>
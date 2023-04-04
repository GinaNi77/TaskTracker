<template>
  <AddPerformerUser v-if="selected === 'Исполнители'" />
  <AddResponsibleUser v-else-if="selected === 'Ответственные'" />
  <div v-else class="q-pa-md">
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
    const selected = ref();

    const openNewPage = (label) => {
      selected.value = label;
      console.log(selected);
      //   switch (label) {
      //     case "Исполнители":
      //       window.location.href = "#/addUser";
      //       break;
      //     case "Исполнители":
      //       window.location.href = "#/addUser2";
      //       break;
      //     default:
      //       window.location.href = "#/teamPage";
      //   }
    };

    return {
      openNewPage,
      selected,
    };
  },
});
</script>
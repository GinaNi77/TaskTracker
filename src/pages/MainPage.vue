<template>
  <div v-if="result">
    <q-drawer
      :width="400"
      :breakpoint="300"
      class="bg-grey-1"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      v-model="leftDrawerOpen"
    >
      <q-scroll-area
        class="fit"
        :width="400"
        :horizontal-thumb-style="{ opacity: 0 }"
      >
        <q-tree
          :nodes="treePages"
          node-key="label"
          v-model:selected="selected"
          no-selection-unset
        />
      </q-scroll-area>
    </q-drawer>

    <TeamPage :team_pages="teams" v-if="selected === 'Команда'" />
    <AddPerformerUser v-else-if="selected === 'Исполнители'" />
    <AddResponsibleUser v-else-if="selected === 'Ответственные'" />
    <AddModule v-else-if="selected === 'Модули'"/>
    <div v-else>Гадость ...</div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import AddPerformerUser from "../components/AddPerformerUser.vue";
import AddResponsibleUser from "../components/AddResponsibleUser.vue";
import TeamPage from "../components/TeamPage.vue";
import AddModule from "../components/AddModule.vue";

export default defineComponent({
  components: {
    AddPerformerUser,
    AddResponsibleUser,
    TeamPage,
    AddModule,
  },
  props: ["leftDrawerOpen"],

  setup() {
    const treePages = ref([]);
    const parentPages = ref([]);
    const selected = ref("");
    const teams = ref([]);

    const { result, loading, error, onResult, refetch } = useQuery(
      gql`
        query parentPages {
          rootPages {
            data {
              id
              parent_id
              page_type
              title
              content
              icon
              level
              is_public
              position
              config
              children {
                data {
                  id
                  title
                }
              }
              created_at
              updated_at
            }
          }
        }
      `
    );

    onResult(() => {
      parentPages.value = result.value.rootPages.data;
      console.log(parentPages.value);

      parentPages.value.forEach((page) => {
        let treeElem = {
          label: page.title,
          // avatar: page.icon,
          children: page.children.data.map((elem) => {
            elem = { label: elem.title, id: elem.id };
            return elem;
          }),
        };
        treePages.value.push(treeElem);
      });

      selected.value = treePages.value[0].label;
      teams.value = treePages.value[0].children;
      console.log(teams);
      console.log(teams.value);
    });

    return {
      drawer: ref(false),
      miniState: ref(true),
      result,
      parentPages,
      treePages,
      selected,
      teams,
    };
  },
});
</script>

<style scoped>
.team-div {
  display: flex;
  flex-direction: column;
}

.team-list {
  padding-left: 50px;
}
</style>
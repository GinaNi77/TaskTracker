<template>
  <q-drawer
    v-model="leftDrawerOpen"
    :width="400"
    :breakpoint="300"
    class="bg-grey-1"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area
      class="fit"
      :width="400"
      :horizontal-thumb-style="{ opacity: 0 }"
    >
      <q-tree
        v-if="result"
        :nodes="treePages"
        node-key="label"
        v-model:selected="selected"
      />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  setup() {
    const treePages = ref([]);
    const parentPages = ref([]);
    const selected = ref();
    const leftDrawerOpen = ref(true);

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
      console.log(treePages.value[0].label);
    });

    return {
      drawer: ref(false),
      miniState: ref(true),
      result,
      parentPages,
      treePages,
      selected,
      leftDrawerOpen,
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
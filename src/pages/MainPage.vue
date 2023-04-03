<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
      <q-list padding>
        <q-item>
          <div class="team-div">
            <div class="flex">
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section> Команда </q-item-section>
            </div>
            <q-list class="team-list">
              <q-item clickable v-for="item in childrenPages">
                <q-item-section>
                  {{ item.title }}
                </q-item-section></q-item
              >
            </q-list>
          </div>
        </q-item>

        <q-item active clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>

          <q-item-section> Модули </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>

          <q-item-section> Мои задачи </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  setup() {
    const childrenPages = ref([]);

    const { result, onResult } = useQuery(gql`
      query {
        page(id: "6932152816939161311") {
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
          is_block
          children(perPage: 10, page: 1) {
            data {
              id
              title
            }
          }
          created_at
          updated_at
        }
      }
    `);

    onResult(() => {
      childrenPages.value = result.value.page.children.data;
      console.log(childrenPages.value);
    });
    return {
      drawer: ref(false),
      miniState: ref(true),
      onResult,
      result,
      childrenPages,
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
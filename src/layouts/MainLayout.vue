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

    <q-drawer
      :width="400"
      :breakpoint="300"
      class="bg-grey-1"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      v-model="leftDrawerOpen"
      v-if="
        $route.name != 'login' &&
        $route.name != 'register' &&
        $route.name != 'loginDefault'
      "
    >
      <q-scroll-area
        class="fit"
        :width="400"
        :horizontal-thumb-style="{ opacity: 0 }"
      >
        <q-tree
          :nodes="treePages"
          node-key="id"
          v-model:selected="selected"
          @update:selected="onTreeItemSelected(selected)"
          no-selection-unset
          default-expand-all
        />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view
        :team_pages="teams"
        :selectedPage="selected"
        @update:selectedPage="selected = $event"
        @openPage="onTreeItemSelected(selected)"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import { getClientOptions } from "src/apollo/index.js";
import { provideApolloClient } from "@vue/apollo-composable";
import { ApolloClient } from "@apollo/client/core";
import router from "../router";

import MainPageVue from "../pages/MainPage.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    MainPageVue,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const treePages = ref([]);
    const parentPages = ref([]);
    const modulesList = ref([]);
    const selected = ref("");

    const hey = "Hey";

    const teams = ref([]); //! Связка с TeamPage?
    const newModule = ref(); // Вывод модулей --

    const apolloClient = new ApolloClient(getClientOptions());
    provideApolloClient(apolloClient);

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
      const urlMap = {
        Команда: "/teams",
        Модули: "/modules",
        "Мои задачи": "/tasks",
      };

      parentPages.value = result.value.rootPages.data;
      parentPages.value.forEach((page) => {
        let treeElem = {
          label: page.title,
          id: page.id,
          url: urlMap[page.title],
          children: page.children.data.map((elem) => {
            elem = {
              label: elem.title,
              id: elem.id,
              url: `${urlMap[page.title]}/${elem.id}`,
            };
            return elem;
          }),
        };
        treePages.value.push(treeElem);
      });

      teams.value = treePages.value[0].children;
      getModules();
    });

    const getModules = () => {
      const { result, onResult } = useQuery(
        gql`
          query getModules {
            paginate_type1(page: 1, perPage: 100) {
              data {
                id
                type_id
                author_id
                level
                position
                created_at
                updated_at
                name
                property4 {
                  id
                  user_id
                  fullname {
                    first_name
                    last_name
                  }
                }
                property6 {
                  date
                }
                property7 {
                  date
                }
                property9 {
                  name
                  property8
                }
              }

              paginatorInfo {
                perPage
                currentPage
                lastPage
                total
                count
                from
                to
                hasMorePages
              }
            }
          }
        `
      );

      onResult(() => {
        modulesList.value = [];
        modulesList.value = result.value.paginate_type1.data;
        console.log(modulesList.value);

        modulesList.value.forEach((page) => {
          treePages.value[1].children.push({
            label: page.name,
            id: page.id,
          });
        });
      });
    };

    const onTreeItemSelected = (selected) => {
      let item = treePages.value.find((item) => item.id === selected);
      if (!item) {
        item = treePages.value.find((item) => {
          return item.children.find((_item) => _item.id === selected);
        });
        for (let i = 0; i < treePages.value.length; i++) {
          const root = treePages.value[i];
          for (let j = 0; j < root.children.length; j++) {
            if (root.children[j].id === selected) {
              item = root.children[j];
              break;
            }
          }
        }
      }
      router.push({ path: item.url });
    };

    const on = (selected) => {
      console.log(selected);
    };

    return {
      result,
      parentPages,
      treePages,
      selected,
      teams,
      hey,
      leftDrawerOpen,
      on,
      getModules,
      onTreeItemSelected,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

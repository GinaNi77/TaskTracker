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
      :width="300"
      :breakpoint="200"
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
          @update:selected="onTreeItemSelected(selected), toggleLeftDrawer()"
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
        @authorized="onUserAuthorized($event)"
        @clear="clear()"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "../router";
import MainPageVue from "../pages/MainPage.vue";
import rabbit from "/src/rabbit/rabbit"
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

export default defineComponent({
  name: "MainLayout",
  components: {
    MainPageVue,
  },

  setup() {

    onMounted(() => {
  rabbit.queueCreate();
  rabbit.rabbitConnect();
});

    const leftDrawerOpen = ref(false);
    const treePages = ref([]);
    const parentPages = ref([]);
    const modulesList = ref([]);
    const selected = ref("");

    const teams = ref([]);
    const userGroups = ref([]);
    const userID = ref();

    const clear = () => {
      userID.value = "";
      userGroups.values = [];
      treePages.value = [];
    };

    const getUserGroups = () => {
      userID.value = localStorage.getItem("userSignInId");

      const { result, onResult, refetch } = useQuery(
        gql`
          {
            paginate_group(page: 1, perPage: 100) {
              data {
                id
                name
                subject {
                  user_id
                  id
                  fullname {
                    first_name
                  }
                }
              }
            }
          }
        `
      );

      onResult(() => {
        const groups = ref([]);
        groups.value = result.value.paginate_group.data;

        userGroups.value = [];
        groups.value.forEach((item) => {
          item.subject.forEach((subject) => {
            if (subject.user_id == userID.value) {
              console.log(subject.user_id, userID.value);
              userGroups.value.push(item.id);
            }
          });
        });

        getTree();
      });
    };

    const getTree = () => {
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
                    object {
                      id
                    }
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

        treePages.value = [];
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
                canView: canViewTreeItem(elem),
              };
              return elem;
            }),
          };

          if (
            canViewTreeItem(page) ||
            treeElem.children.some((item) => item.canView)
          ) {
            treeElem.children = treeElem.children.filter(
              (item) => item.canView
            );
            treePages.value.push(treeElem);
          }
        });

        if (treePages.value[findIndexByUrl("/teams")]) {
          teams.value = treePages.value[findIndexByUrl("/teams")].children;
        }

        getModules();
      });
    };

    const getModules = () => {
      const { result, onResult, refetch } = useQuery(
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
        modulesList.value = result.value.paginate_type1.data;
        console.log(modulesList.value);

        modulesList.value.forEach((page) => {
          if (canViewTreeItem(page)) {
            treePages.value[findIndexByUrl("/modules")].children.push({
              label: page.name,
              id: page.id,
              url: `${treePages.value[findIndexByUrl("/modules")].url}/${
                page.id
              }`,
            });
          } else {
            const user = JSON.parse(localStorage.getItem("userData"));
          }
        });
      });
    };

    const canViewTreeItem = (item) => {
      if (userID.value == "5120362227219750820") {
        return true;
      } else {
        //  check module
        if (
          (item.property4?.user_id && item.property4.user_id == userID.value) ||
          userID == "5120362227219751000"
        ) {
          return true;
        }
        // check teams
        else if (
          userID == "5120362227219751000" ||
          userGroups.value.some((group) => group === item.id)
        ) {
          return true;
        } else if (
          userGroups.value.some((group) => group === item.object?.id)
        ) {
          return true;
        } else if (item.title === "Модули" || item.title === "Мои задачи") {
          return true;
        }
        return false;
      }
    };

    const findIndexByUrl = (url) => {
      let index = treePages.value.findIndex((elem) => elem.url == url);
      return index;
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

    if (!!localStorage.getItem("token")) {
      getUserGroups();
    }

    const onUserAuthorized = () => {
      getUserGroups();
    };

    return {
      parentPages,
      treePages,
      selected,
      teams,
      leftDrawerOpen,
      clear,
      getModules,
      onTreeItemSelected,
      onUserAuthorized,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

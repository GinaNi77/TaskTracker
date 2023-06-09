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
import { defineComponent, ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getRootPages, getAllGroup, getModules } from "src/graphql/query";
import router from "../router";
import MainPageVue from "../pages/MainPage.vue";
import rabbit from "/src/rabbit/rabbit";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

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

    const teams = ref([]);
    const userGroups = ref([]);
    const userID = ref();

    onMounted(() => {
      rabbit.queueCreate();
      rabbit.rabbitConnect();
    });

    const clear = () => {
      userID.value = "";
      userGroups.values = [];
      treePages.value = [];
    };

    const getData = () => {
      let group = apolloClient.query({ query: getAllGroup });
      let rootPages = apolloClient.query({ query: getRootPages });

      Promise.all([group, rootPages]).then(([group, rootPages]) => {
        userID.value = localStorage.getItem("userSignInId");
        const groups = ref([]);
        groups.value = group.data.paginate_group.data;

        userGroups.value = [];
        groups.value.forEach((item) => {
          item.subject.forEach((subject) => {
            if (subject.user_id == userID.value) {
              userGroups.value.push(item.id);
            }
          });
        });

        parentPages.value = rootPages.data.rootPages.data;

        getAllTree();
      });
    };

    const getAllTree = () => {
      const urlMap = {
        Команда: "/teams",
        Модули: "/modules",
        "Мои задачи": "/tasks",
      };

      treePages.value = [];
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
          treeElem.children = treeElem.children.filter((item) => item.canView);
          treePages.value.push(treeElem);
        }
      });

      const { result: modules, onResult, refetch } = useQuery(getModules);
      refetch();

      onResult(() => {
        modulesList.value = modules.value.paginate_type1.data;
        treePages.value[findIndexByUrl("/modules")].children = [];

        modulesList.value.forEach((page) => {
          if (canViewTreeItem(page)) {
            treePages.value[findIndexByUrl("/modules")].children.push({
              label: page.name,
              id: page.id,
              url: `${treePages.value[findIndexByUrl("/modules")].url}/${
                page.id
              }`,
            });
          }
        });
      });

      if (treePages.value[findIndexByUrl("/teams")]) {
        teams.value = treePages.value[findIndexByUrl("/teams")].children;
      }
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
      getData();
    }

    const onUserAuthorized = () => {
      getData();
    };

    return {
      parentPages,
      treePages,
      selected,
      teams,
      leftDrawerOpen,
      clear,
      onTreeItemSelected,
      onUserAuthorized,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

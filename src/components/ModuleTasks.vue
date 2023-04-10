<template>
  <div class="flex justify-between q-py-lg" style="width: 90%; margin: 0 auto">
    <p class="text-h5">Список задач модуля</p>
    <q-btn round color="black" no-border flat to="/addTask" icon="add_circle" />
  </div>

  <q-list class="q-mb-xl flex justify-center">
    <table style="width: 90%; border-collapse: collapse">
      <tr>
        <th>Название</th>
        <th>Задача</th>
        <th>Описание</th>
        <th>Имя исполнителя</th>
        <th>Фамилия исполнителя</th>
        <th>Статус</th>
        <th></th>
      </tr>

      <tr v-for="item in tasksListById" :key="item.index">
        <td>{{ item.property9.name }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.property3 }}</td>
        <td>{{ item.property5.fullname.first_name }}</td>
        <td>{{ item.property5.fullname.last_name }}</td>

        <td v-if="item.property8 == 8536411824694842134">Назначена</td>
        <td v-else-if="item.property8 == 3812168432889805433">Выполнена</td>
        <td v-else>Завершена</td>

        <td>
          <div class="flex justify-center">
            <q-btn class="bg-teal-10 q-mr-xs text-white" icon="edit" />
            <q-btn
              class="bg-red-10 q-ml-xs text-white"
              icon="delete"
              @click="deleteModules(item.id)"
            />
          </div>
        </td>
      </tr>
    </table>
  </q-list>
</template>

<script>
import { defineComponent, ref, onUpdated, onBeforeUpdate } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "../router";

export default defineComponent({
  setup() {
    const tasksList = ref([]);
    const tasksListById = ref([]);
    const moduleID = ref();

    moduleID.value = router.currentRoute.value.params.id;

    const getTasks = () => {
      const { result, onResult, refetch } = useQuery(
        gql`
          query getModules {
            paginate_type2(page: 1, perPage: 100) {
              data {
                id
                type_id
                author_id
                level
                position
                created_at
                updated_at
                name
                property3
                property8
                property5 {
                  id
                  user_id
                  fullname {
                    first_name
                    last_name
                  }
                }
                property9 {
                  id
                  name
                  property4 {
                    fullname {
                      first_name
                      last_name
                    }
                  }
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
        `,
        null,
        {
          pollInterval: 1,
        }
      );

      // name - названия модуля
      // property 6 - дата начала
      // property 7 - дата конца
      // property 4 - данные об ответсвенном за модуль
      // property 9 - привязанные задачи (property 8 - статус задачи)
      refetch();
      onResult(() => {
        tasksList.value = result.value.paginate_type2.data;
        console.log(tasksList.value);

        tasksListById.value = tasksList.value.filter(
          (item) => item.property9.id === moduleID.value
        );

        console.log(tasksListById.value);
      });
    };

    const { mutate: deleteModuleTask } = useMutation(gql`
      mutation ($id: String!) {
        delete_type2(id: $id) {
          status
        }
      }
    `);

    const deleteModules = async (id) => {
      const { data } = await deleteModuleTask({
        id: id,
      });
      console.log("deleted");
    };

    getTasks();

    onUpdated(() => {
      moduleID.value = router.currentRoute.value.params.id;
      getTasks();
    });

    return {
      tasksList,
      tasksListById,
      deleteModules,
    };
  },
});
</script>

<style scoped>
th {
  border: 1px solid black;
  padding: 5px;
}

td {
  border: 1px solid black;
  padding: 5px 10px;
}
</style>


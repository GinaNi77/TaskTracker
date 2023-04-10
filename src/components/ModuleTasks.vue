<template>
  <div>Modules table</div>

  <q-list class="q-mb-xl flex justify-center">
    <table style="width: 90%; border-collapse: collapse">
      <caption class="q-my-lg text-h5">
        Список модулей
      </caption>
      <tr>
        <th>Название</th>
        <th>Задача</th>
        <th>Описание</th>
        <th>Имя исполнителя</th>
        <th>Фамилия исполнителя</th>
        <th>Статус</th>
        <th>Редактировать</th>
        <th>Удалить</th>
      </tr>

      <tr v-for="item in modulesList" :key="item.index">
        <td>{{ item.property9.name }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.property3 }}</td>
        <td>{{ item.property5.fullname.first_name }}</td>
        <td>{{ item.property5.fullname.last_name }}</td>

        <td v-if="item.property8 == 8536411824694842134">Назначена</td>
        <td v-else-if="item.property8 == 3812168432889805433">Выполнена</td>
        <td v-else>Завершена</td>

        <td><q-btn class="bg-teal-10 text-white" icon="edit" /></td>
        <td>
          <q-btn
            class="bg-red-10 text-white"
            icon="delete"
            @click="deleteModules(item.id)"
          />
        </td>
      </tr>
    </table>
  </q-list>
</template>

<script>
import { defineComponent, ref, onUpdated } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "../router";

export default defineComponent({
  setup() {
    const modulesList = ref([]);

    const moduleID = ref();
    moduleID.value = router.currentRoute.value.params.id;

    onUpdated(() => {
      moduleID.value = router.currentRoute.value.params.id;
      console.log("onUpdated" + moduleID.value);
    });

    const { result, onResult } = useQuery(
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

    onResult(() => {
      modulesList.value = result.value.paginate_type2.data;
      console.log(modulesList.value);
    });

    // const getModuleTasksStatusQuantity = (status) => {
    //   let counter;
    //   for (let i = 0; i < modulesList.value.length; i++) {
    //     console.log(modulesList.value[i]);
    //     // for (let n = 0; n < modulesList.value[i].property9.length; n++) {
    //     //   // if (modulesList.value[i].property9[n] == status) {
    //     //   //   counter++;
    //     //     console.log(modulesList.value[i].property9[n]);
    //     //   // }
    //     // }
    //   }
    //   return counter;

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

    return {
      onResult,
      modulesList,
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


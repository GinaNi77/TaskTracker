<template>
  <q-list class="q-mb-xl flex justify-center">
    <table style="width: 90%; border-collapse: collapse">
      <caption class="q-my-lg text-h5">
        Список модулей
      </caption>
      <tr>
        <th>Название</th>
        <th>Дата начала</th>
        <th>Дата конца</th>
        <th>Имя ответственного</th>
        <th>Фамилия ответственного</th>
        <th>Назначено</th>
        <th>Выполнено</th>
        <th>Завершено</th>
        <th>Редактировать</th>
        <th>Удалить</th>
      </tr>

      <tr v-for="item in modulesList" :key="item.index">
        <td>{{ item.name }}</td>
        <td>{{ item.property6.date }}</td>
        <td>{{ item.property7.date }}</td>
        <td>{{ item.property4.fullname.first_name }}</td>
        <td>{{ item.property4.fullname.last_name }}</td>
        <td>
          {{
            item.property9.reduce(function (a, b) {
              if (b.property8 == "8536411824694842134") {
                return ++a;
              } else return 0;
            }, 0)
          }}
        </td>
        <td>
          {{
            item.property9.reduce(function (a, b) {
              if (b.property8 == "3812168432889805433") {
                return ++a;
              } else return 0;
            }, 0)
          }}
        </td>
        <td>
          {{
            item.property9.reduce(function (a, b) {
              if (b.property8 == "6403872496291980172") {
                return ++a;
              } else return 0;
            }, 0)
          }}
        </td>
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
  <div class="flex justify-center q-mb-lg">
      <q-btn color="black" outline to="/addModule">Добавить модуль</q-btn>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  setup() {
    const modulesList = ref([]);

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

    // name - названия модуля
    // property 6 - дата начала
    // property 7 - дата конца
    // property 4 - данные об ответсвенном за модуль
    // property 9 - привязанные задачи (property 8 - статус задачи)

    onResult(() => {
      modulesList.value = result.value.paginate_type1.data;
      // console.log(modulesList.value);
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

    const { mutate: deleteModule } = useMutation(gql`
      mutation ($id: String!) {
        delete_type1(id: $id) {
          status
        }
      }
    `);

    const deleteModules = async (id) => {
      const { data } = await deleteModule({
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
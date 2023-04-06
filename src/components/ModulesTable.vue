<template>
  <div>Modules table</div>
  <!-- <q-list>
        <q-item v-for="item in modulesList" :key="item.index">
            <q-item-section>{{item.name}}</q-item-section>
            <q-item-section>{{item.property6.date}}</q-item-section>
            <q-item-section>{{item.property7.date}}</q-item-section>
            <q-item-section>{{item.property4.fullname.first_name}} {{item.property4.fullname.last_name}}</q-item-section>
        </q-item>
    </q-list> -->

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
      </tr>

      <tr v-for="item in modulesList" :key="item.index">
        <td>{{ item.name }}</td>
        <td>{{ item.property6.date }}</td>
        <td>{{ item.property7.date }}</td>
        <td>{{ item.property4.fullname.first_name }}</td>
        <td>{{ item.property4.fullname.last_name }}</td>
        <td></td>
        <td></td>
        <td></td>
        <q-btn icon="edit"/>
        <q-btn icon="delete"/>
      </tr>
    </table>
  </q-list>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
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
      console.log(modulesList.value);
    });

    return {
      onResult,
      modulesList,
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
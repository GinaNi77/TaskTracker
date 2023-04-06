<template>
    <q-list>
      <table style="width: 80%; border-collapse: collapse; text-align: left; margin:0px auto;  border: 2px solid #400303; ">
        <caption class="q-my-lg text-h5">
          Список задач
        </caption>
        <tr style="">
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Исполнители</th>
          <th>Модуль</th>
        </tr>

        <tr style="border: solid 2px #400303;" v-for="task in tasksList" :key="task.index" :class="
                task.property8 == 8536411824694842134
                  ? 'bg-pink-4'
                  : task.property8 == 3812168432889805433
                  ? 'bg-yellow-4'
                  : 'bg-light-green-4'
              ">
          <td>{{task.name}}</td>
          <td>{{task.property3}}</td>
          <td v-if="task.property8 == 8536411824694842134">Назначена</td>
          <td v-else-if="task.property8 == 3812168432889805433">Выполнена</td>
          <td v-else>Завершена</td>
          <td>{{task.property5.fullname.first_name}} {{task.property5.fullname.last_name}}</td>
          <td>{{task.property9.name}}</td>
        </tr>
      </table>
    </q-list>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
    setup() {

        const tasksList = ref([])

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
        property9{
          name
          property4{
            fullname{
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
  } `, null,
      {
        pollInterval: 1,
      }
    );

    // name - названия задания
    // property 3 - описание задания
    // property 8 - айдишник статуса задачи
    // property 5 - данные об исполнителе задачи
    // property 9 - привязанный модуль (property4 - данные об ответсвенном за модуль)


    onResult(() => {
        tasksList.value = result.value.paginate_type2.data;
        console.log( tasksList.value)
    });

    return{
           onResult,  tasksList
        }
        
    },
})
</script>

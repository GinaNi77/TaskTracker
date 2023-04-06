<template>
    <q-list>
      <table style="width: 80%; border-collapse: collapse; text-align: left; margin:30px auto;  border: 1px solid #400303; ">
        <caption class="q-my-lg text-h5">
          Список задач
        </caption>
        <tr style="font-size:16px;">
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Исполнители</th>
          <th>Модуль</th>
          <th>Редактировать</th>
          <th>Удалить</th>
        </tr>

        <tr style="border: solid 1px #400303;" v-for="task in tasksList" :key="task.index" :class="
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
          <td>
            <q-btn class="bg-teal-10 text-white" icon="edit"></q-btn>
          </td>
          <td>
            <q-btn class="bg-red-10 text-white" @click="deleteTasks(task.id)" icon="delete"></q-btn>
          </td>
        </tr>
      </table>
    </q-list>
    <div class="flex justify-center q-mb-lg">
      <q-btn color="black" outline to="/addTask">Добавить задачу</q-btn>
    </div>
    
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuery } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
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
    

    const {mutate: deleteTask} = useMutation(gql`
      mutation($id: String!) {
      delete_type2(id: $id) {
      status
            }
        }
    `)

    const deleteTasks = async(id) => {
      const {data} = await deleteTask(
        {
          id:id,
        }
      )

    }

    return{
           onResult,  tasksList, deleteTasks
        }
        
    },
})
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

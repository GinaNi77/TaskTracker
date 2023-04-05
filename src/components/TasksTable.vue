<template>
    <div>TasksTable</div>
    <q-list>
        <q-item v-for="task in tasksList" :key="task.index">
            <q-item-section>{{task.name}}</q-item-section>
            <q-item-section>{{task.property3}}</q-item-section>
            <q-item-section>{{task.property8}}</q-item-section>
            <q-item-section>{{task.property5.fullname.first_name}} {{task.property5.fullname.last_name}}</q-item-section>
            <q-item-section>{{task.property9.name}}</q-item-section>
        </q-item>
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
  } `
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
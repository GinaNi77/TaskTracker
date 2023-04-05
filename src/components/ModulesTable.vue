<template>
    <div>Modules table</div>
    <q-list>
        <q-item v-for="item in modulesList">
            <q-item-section>{{item.name}}</q-item-section>
            <q-item-section>{{item.property6.date}}</q-item-section>
            <q-item-section>{{item.property7.date}}</q-item-section>
        </q-item>
    </q-list>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
    setup() {

        const modulesList = ref([])

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
         property6 {
          date
        }
        property7 {
          date
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
    console.log( modulesList.value)
    });

    return{
           onResult,  modulesList
           
        }
        
    },
})
</script>

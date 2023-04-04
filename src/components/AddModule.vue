<template>
     <q-page padding>
        <q-form class="row justify-center" @submit.prevent="">
            <p class="col-12 text-h5 text-center">Добавить Модуль</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
                <q-input
                    label="Название"
                    v-model="title"
                />

                <q-input label="Ответственный" v-model="responsibleUser">
                    <template #append>
                        <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                           <q-dropdown color="white" class="text-black" flat>
                                <q-list>
                                    <q-item clickable v-close-popup  v-for="user in responsibleUsers" :key="user.index" @click="onItemClick(user.fullname.first_name)">
                                    <q-item-section>
                                        <q-item-label>{{user.fullname.first_name}}</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                    </q-dropdown>
                        </q-popup-proxy>
                    </template>
                </q-input>

                <q-input
                    label="Дата начала"
                    v-model="start_date">
                    <template #append>
                        <q-icon name="event" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                           <q-date
                                v-model="start_date"
                                minimal
                            /> 
                        </q-popup-proxy>
                    </template>
                </q-input>

                <q-input
                    label="Дата окончания"
                    v-model="end_date">
                    <template #append>
                        <q-icon name="event" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                           <q-date
                                v-model="end_date"
                                minimal
                            /> 
                        </q-popup-proxy>
                    </template>
                </q-input>

                <div class="q-mt-lg">
                    <q-btn outline size="md" color="black" label="Добавить" class="full-width" type="submit"/>     
                </div>    

            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
    setup() {

    const responsibleUsers = ref([])
    const title = ref('')
    const responsibleUser = ref()
    const start_date = ref()
    const end_date = ref()

    const { result, onResult } = useQuery(
      gql`
        query {
          get_group(id: "4833572297286333641") {
            name
            subject {
              id
              type_id
              email {
                email
              }
              fullname {
                first_name
                last_name
              }
            }
          }
        }
      `
    );

    onResult(() => {
      responsibleUsers.value = result.value.get_group.subject;
      console.log(responsibleUsers.value)
    });
  
    const onItemClick = (name) => {
            responsibleUser.value = name
    }

        return{
           title, responsibleUsers, onResult,onItemClick, responsibleUser, start_date, end_date
           
        }
        
    },
})
</script>

<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="addTasks">
            <p class="col-12 text-h5 text-center">Добавить Задачу</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
                <q-input
                    label="Название"
                    v-model="title"
                />

                <q-input
                    label="Описание"
                    v-model="description"
                />

                <q-input label="Исполнитель" v-model="performerUser">
                    <template #append>
                        <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                                <q-list>
                                    <q-item clickable v-close-popup  v-for="user in performerUsers" :key="user.index" @click="getUserId(user.id)">
                                    <q-item-section>
                                        <q-item-label>{{user.fullname.first_name}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{user.fullname.last_name}}</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                        </q-popup-proxy>
                    </template>
                </q-input>


                <q-input label="Модуль" v-model=" moduleId">
                    <template #append>
                        <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                                <q-list>
                                    <q-item clickable v-close-popup  v-for="item in modulesList" :key="item.index" @click="getModuleId(item.id)">
                                    <q-item-section>
                                        <q-item-label>{{item.name}}</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                        </q-popup-proxy>
                    </template>
                </q-input>

                <div class="q-mt-lg">
                    <q-btn outline size="md" color="black" label="Добавить" class="full-width" type="submit"/>     
                </div>

                <div class="q-mt-lg">
                    <q-btn flat size="md" color="black" label="Главная страница" class="full-width" to="/main"/>     
                </div>     

            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "add-performer-user",
  
  setup() {

    const performerUsers = ref([]);
    const performerUser = ref('')
    const modulesList=ref([])
    const moduleId = ref()
    const title = ref('')
    const description = ref('')

    
    const { result, onResult } = useQuery(
      gql`
        query {
          get_group(id: "4753316581813399177") {
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
      performerUsers.value = result.value.get_group.subject;
      console.log(performerUsers.value);
    });

    const getModules = () =>{
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
                    }
                }
            }`
    );

    onResult(() => {
      modulesList.value = result.value.paginate_type1.data
      console.log(modulesList.value)
    });

    return { 
        onResult
        }
    }

    getModules()

    const getUserId = (id) => {
            performerUser.value = id
    }

    const getModuleId = (id) => {
            moduleId.value = id
    }

    const { mutate: addTask } = useMutation(gql`
        mutation ($input: create_type2_input!) {
        create_type2(input: $input) {
        status
        recordId
        record {
            id
            type_id
            author_id
            level
            position
            created_at
            updated_at
            name
            property5 {
            id
            user_id
            fullname {
                first_name
                last_name
                     }
            }
            property3
            property8
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
  }
}`
    )

    const addTasks = async () => {
       const {data} = await addTask(
        {
            "input":{
                "name": title.value,
                    "property3": description.value,
                    "property8": "8536411824694842134",
                    // айдишник статуса задачи 
                    // 8536411824694842134 - Назначена
                    // 3812168432889805433 - Выполнена
                    // 6403872496291980172 - Завершена
                    // При добавлении задачи ее статус всегда - Назначена
                    "property9": {
                        "6591698446779899108": moduleId.value
                        // айдишник типа Модуль
                    },
                    "property5":{
                        "2730894142110796608": performerUser.value
                        // айдишник типа Субъект
                                }
            }
        })
        resetForm()
        console.log(data.create_type2.recordId)  
    };

    const resetForm = () => {
        title.value = "",
        description.value = "",
        moduleId.value = "",
        performerUser.value = ""
      
    };

    return {
      onResult, performerUsers, getModules, modulesList, performerUser, getUserId, getModuleId, moduleId, addTasks, title, description
    };


  },
});
</script>
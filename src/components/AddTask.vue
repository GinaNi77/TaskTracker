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
                        <q-icon name="arrow_drop_down" class="cursor-pointer" @click="getPerformerUsers"></q-icon>
                        <q-popup-proxy>
                                <q-list>
                                    <q-item clickable v-close-popup  v-for="user in performerList" :key="user.index" @click="getUserId(user.id)">
                                    <q-item-section>                                        
                                      <q-item-label>{{ user.fullname.first_name +" "+user.fullname.last_name}}</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                </q-list>
                        </q-popup-proxy>
                    </template>
                </q-input>


                <q-input label="Модуль" v-model=" moduleId">
                    <template #append>
                        <q-icon name="arrow_drop_down" class="cursor-pointer" @click="modulesGet"></q-icon>
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
                    <q-btn flat size="md" color="black" label="Задачи" class="full-width" to="/tasks"/>     
                </div>     

            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { addTask, ruleCreate } from "src/graphql/mutation"
import { getPerformerUser, getModules } from "src/graphql/query"
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "add-performer-user",
  
  setup() {

    const performerList = ref([]);
    const performerUser = ref('')
    const modulesList= ref(JSON.parse(localStorage.getItem("modulesArray")))
    const moduleId = ref()
    const title = ref('')
    const description = ref('')
    const $q = useQuasar();

    
    const getPerformerUsers = () =>{

      const { result, onResult, refetch } = useQuery(getPerformerUser)
      onResult(() => {
        performerList.value = result.value.get_group.subject;
      });
      refetch()
      return{
        onResult
      }
  }

  const modulesGet = () => {
      const { result, onResult, refetch } = useQuery(getModules)
       
      onResult(() => {
        modulesList.value = result.value.paginate_type1.data;})

      refetch();
      return{onResult}
    };

    const getUserId = (id) => {
            performerUser.value = id
    }

    const getModuleId = (id) => {
            moduleId.value = id
    }

    const { mutate: taskAdd } = useMutation(addTask)

    const { mutate: createPermissionRule } = useMutation(ruleCreate)

    const createRule = async (moduleData) => {

      console.log(moduleData.create_type2.recordId)
      console.log(moduleData.create_type2.record.property5.id)

      const { data: ruleData } = await createPermissionRule({
        input: {
          model_type: "object",
          model_id: moduleData.create_type2.recordId,
          owner_type: "subject",
          owner_id: moduleData.create_type2.record.property5.id,
          level: 5,
        },
      });
      console.log(ruleData.permissionRuleCreate.status)
      console.log(ruleData.permissionRuleCreate.recordId)

    }

    const addTasks = async () => {
       const {data} = await taskAdd(
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

        createRule(data)

        console.log(data.create_type2.recordId);
        console.log(data.create_type2.record.property5.id);
         
         $q.notify({
        message: "Задача добавлена",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
        resetForm()
          
    };

    const resetForm = () => {
        title.value = "",
        description.value = "",
        moduleId.value = "",
        performerUser.value = ""
      
    };

    return {
        performerList, modulesList,
        performerUser, getUserId, getModuleId,
        moduleId, addTasks, title,
        description, getPerformerUsers, modulesGet
    };


  },
});
</script>
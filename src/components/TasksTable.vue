<template>
    <q-list>
      <table style="width: 80%; border-collapse: collapse; text-align: left; margin:30px auto;  border: 1px solid #400303; ">
        <caption class="q-mb-lg text-h5">
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
            <q-btn class="bg-teal-10 text-white" icon="edit"  @click="getTaskId(task.id)"></q-btn>
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

    <q-dialog v-model="alert">
      <q-card>
        <q-form class="row justify-center" @submit.prevent="updateTasks">
            <p class="col-12 text-h5 text-center q-mt-md">Изменить Задачу</p>
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

                <q-input label="Cтатус" v-model="taskStatus">
                    <template #append>
                        <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                        <q-popup-proxy>
                                <q-list v-close-popup>
                                    <q-item  clickable @click="getTaskStatus('Назначена')">
                                    <q-item-section >
                                        <q-item-label>Назначена</q-item-label>
                                    </q-item-section ></q-item>
                                    <q-item clickable @click="getTaskStatus('Выполнена')">
                                    <q-item-section >
                                        <q-item-label>Выполнена</q-item-label>
                                    </q-item-section>
                                    </q-item>
                                    <q-item  clickable @click="getTaskStatus('Завершена')">
                                    <q-item-section >
                                        <q-item-label>Завершена</q-item-label>
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
                    <q-btn outline size="md" color="black" label="Изменить" class="full-width q-mb-md" type="submit"/>     
                </div>
            </div>
        </q-form>
      </q-card>
    </q-dialog>
    
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuery } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
    setup() {

        const tasksList = ref([])
        const modulesList = ref([])
        const performerUsers = ref([])
        const alert= ref(false)
        const title = ref('')
        const description = ref('')
        const performerUser = ref('')
        const moduleId = ref()
        const taskId = ref()
        const taskStatus = ref()

        const getTaskId=(id)=>{
          alert.value = true
          taskId.value = id
          
        }
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
    });
    

    const getResponsible = ()=>{
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
    });

      return { 
        onResult
        }
    }

    getResponsible()

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
    });

    return { 
        onResult
        }
    }

    getModules()

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

    const getUserId = (id) => {
            performerUser.value = id
    }

    const getModuleId = (id) => {
            moduleId.value = id
    }

    const getTaskStatus = (status) =>{
      if ( status == "Назначена"){
        taskStatus.value = "8536411824694842134"
        }
      else if(status == "Выполнена"){
        taskStatus.value = "3812168432889805433"
        }
      else{
        taskStatus.value = "6403872496291980172"
      }
        }

    const {mutate: updateTask}=useMutation(gql`
    mutation ($id: String!,$input: update_type2_input!) {
    update_type2(id: $id, input: $input) {
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
}
    `)

    const updateTasks = async() => {
      const {data} = await updateTask(
        {
  "id": taskId.value,
  "input":{
	"name": title.value,
  "property3": description.value,
  "property8": taskStatus.value,
  "property5":{
  	"2730894142110796608":performerUser.value
              },
  "property9":{
    "6591698446779899108":moduleId.value
              }
  }
    
  }
        )
        reset()

}

const reset = ()=>{
  taskId.value = "",
  title.value = "",
  description.value = "",
  taskStatus.value = "",
  performerUser.value = "",
  moduleId.value = ""
}

    return{
           onResult,  tasksList, deleteTasks, alert, getModules, 
           modulesList, performerUsers, getResponsible, title,
           description, getUserId, getModuleId, performerUser, moduleId,
            taskId, getTaskId, updateTasks, taskStatus, getTaskStatus, reset
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

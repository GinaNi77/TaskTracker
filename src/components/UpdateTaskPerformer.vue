<template>
     <q-card>
      <q-form class="row justify-center" @submit.prevent="updateTasks">
        <p class="col-12 text-h5 text-center q-mt-md">Изменить Задачу</p>
        <div class="q-gutter-y-lg">
          <q-input v-if="userID == 5120362227219750820" label="Название" v-model="title" />

          <q-input v-if="userID == 5120362227219750820" label="Описание" v-model="description" />

          <q-input label="Исполнитель" v-model="performerUser">
            <template #append>
              <q-icon name="arrow_drop_down" class="cursor-pointer" @click="getPerformer"></q-icon>
              <q-popup-proxy>
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="user in performerUsers"
                    :key="user.index"
                    @click="getUserId(user.id)"
                  >
                    <q-item-section>
                      <q-item-label
                        >{{
                          user.fullname.first_name +
                          " " +
                          user.fullname.last_name
                        }}
                      </q-item-label>
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
                  <q-item clickable v-if="userID == 5120362227219750820" @click="getTaskStatus('Назначена')">
                    <q-item-section>
                      <q-item-label>Назначена</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="getTaskStatus('Выполнена')">
                    <q-item-section>
                      <q-item-label>Выполнена</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="getTaskStatus('Завершена')">
                    <q-item-section>
                      <q-item-label>Завершена</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-popup-proxy>
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn
              outline
              size="md"
              color="black"
              label="Изменить"
              class="full-width q-mb-md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card> 
</template>

<script>
export default {
    name: 'UpdateTaskPerformer',
  }
</script>

<script setup>

import { ref } from "vue"
import { useQuery, useMutation } from "@vue/apollo-composable";
import { taskUpdate, ruleDelete, ruleCreate } from "src/graphql/mutation";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import { getPerformerUser, getModules, permissionTreeSubjects} from "src/graphql/query";

provideApolloClient(apolloClient);

const props = defineProps({
  title: String,
  performerUser: String,
  description: String,
  taskStatus: String,
  moduleId: String,
  taskId:String,
})

const userID = localStorage.getItem("userSignInId");
const title = ref(props.title);
const performerUser = ref(props.performerUser);
const description = ref(props.description);
const taskStatus = ref(props.taskStatus);
const moduleId = ref(props.moduleId);
const taskId = ref(props.taskId);
const performerUsers = ref([])
const modulesList = ref([])
const permissionArray = ref([])
const permission_id = ref([])
const flag = ref(false)

const emit = defineEmits(['updateTask'])

 const getPerformer = () => {
      const { result, onResult, refetch } = useQuery(getPerformerUser);

      onResult(() => {
        performerUsers.value = result.value.get_group.subject;
      });

      refetch();
      return {
        onResult,
      };
    };

    const modulesGet = () => {
      const { result, onResult, refetch } = useQuery(getModules);

      onResult(() => {
        modulesList.value = result.value.paginate_type1.data;
      });

      refetch();

      return {
        onResult,
      };
    };

 const getUserId = (id) => {
      performerUser.value = id;
      flag == true;
      if(flag){
        permissionArray.value.forEach((item) => {
        if (item.subject_id === props.performerUser) {
            permission_id.value = item.permission_rule_id;
        }
      });
      }
    };

     const { mutate: deleteRule } = useMutation(ruleDelete);

    const deletePermission = async (id) => {
      const { data } = await deleteRule({
        id: permission_id.value,
      });
    };

    const { mutate: createPermissionRule } = useMutation(ruleCreate)

    const createRule = async (moduleData) => {

      const { data: ruleData } = await createPermissionRule({
        input: {
          model_type: "object",
          model_id: props.taskId,
          owner_type: "subject",
          owner_id: performerUser.value,
          level: 5,
        },
      });
      }

const getModuleId = (id) => {
      moduleId.value = id;
    };

const getTaskStatus = (status) => {
    if (status == "Назначена") {
        taskStatus.value = "8536411824694842134";
    } else if (status == "Выполнена") {
        taskStatus.value = "3812168432889805433";
    } else {
        taskStatus.value = "6403872496291980172";
    }
    };

  const { mutate: updateTask } = useMutation(taskUpdate);

    const updateTasks = async () => {
      const { data } = await updateTask({
        id: taskId.value,
        input: {
          name: title.value,
          property3: description.value,
          property8: taskStatus.value,
          property5: {
            "2730894142110796608": performerUser.value,
          },
          property9: {
            "6591698446779899108": moduleId.value,
          },
        },
      });
      if(flag){
        deletePermission();
        createRule();
        flag == false;
      }
      emitFun()
      reset();
    };

    const reset = () => {
      (taskId.value = ""),
        (title.value = ""),
        (description.value = ""),
        (taskStatus.value = ""),
        (performerUser.value = ""),
        (moduleId.value = "");
    };

const emitFun = () => {
        emit("updateTask");
    }

    const permissionTreeGet = () => {
      const { result, onResult, refetch } = useQuery(permissionTreeSubjects,{     
	      "modelId": props.taskId,
	      "groupId": "3969277701932267641"
      });

      onResult(() => {
        permissionArray.value = result.value.permissionTreeSubjects.data;
      });

      refetch();

      return {
        onResult,
      };
    };

    permissionTreeGet();
</script>
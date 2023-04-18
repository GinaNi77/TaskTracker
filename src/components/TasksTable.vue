<template>
  <div v-if="userID == 5120362227219750820">
    <q-list>
      <table
        style="
          width: 80%;
          border-collapse: collapse;
          text-align: left;
          margin: 30px auto;
          border: 1px solid #400303;
        "
      >
        <caption class="q-mb-lg text-h5">
          Список задач
        </caption>
        <tr style="font-size: 16px">
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Исполнители</th>
          <th>Модуль</th>
          <th></th>
        </tr>

        <tr
          style="border: solid 1px #400303"
          v-for="task in ownerTasksList"
          :key="task.index"
          :class="
            task.property8 == 8536411824694842134
              ? 'bg-pink-4'
              : task.property8 == 3812168432889805433
              ? 'bg-yellow-4'
              : 'bg-light-green-4'
          "
        >
          <td>{{ task.name }}</td>
          <td>{{ task.property3 }}</td>
          <td v-if="task.property8 == 8536411824694842134">Назначена</td>
          <td v-else-if="task.property8 == 3812168432889805433">Выполнена</td>
          <td v-else>Завершена</td>
          <td>
            {{ task.property5.fullname.first_name }}
            {{ task.property5.fullname.last_name }}
          </td>
          <td>{{ task.property9.name }}</td>
          <td>
            <div class="flex justify-center">
              <q-btn
                class="bg-teal-10 text-white q-ma-xs"
                icon="edit"
                @click="getTaskId(task.id)"
              >
              </q-btn>
              <q-btn
                class="bg-red-10 text-white q-ma-xs"
                @click="deleteTasks(task.id)"
                icon="delete"
              >
              </q-btn>
            </div>
          </td>
        </tr>
      </table>
    </q-list>
    <div class="flex justify-center q-mb-lg">
      <q-btn color="black" outline to="/addTask" class="q-mb-sm"
        >Добавить задачу</q-btn
      >
    </div>

    <q-dialog v-model="alert">
      <q-card>
        <q-form class="row justify-center" @submit.prevent="updateTasks">
          <p class="col-12 text-h5 text-center q-mt-md">Изменить Задачу</p>
          <div class="q-gutter-y-lg">
            <q-input label="Название" v-model="title" />

            <q-input label="Описание" v-model="description" />

            <q-input label="Исполнитель" v-model="performerUser">
              <template #append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
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
                        <q-item-label>{{
                          user.fullname.first_name +
                          " " +
                          user.fullname.last_name
                        }}</q-item-label>
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
                    <q-item clickable @click="getTaskStatus('Назначена')">
                      <q-item-section>
                        <q-item-label>Назначена</q-item-label>
                      </q-item-section></q-item
                    >
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

            <q-input label="Модуль" v-model="moduleId">
              <template #append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                <q-popup-proxy>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      v-for="item in modulesList"
                      :key="item.index"
                      @click="getModuleId(item.id)"
                    >
                      <q-item-section>
                        <q-item-label>{{ item.name }}</q-item-label>
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
    </q-dialog>
  </div>

  <div v-else>
    <q-list>
      <table
        style="
          width: 80%;
          border-collapse: collapse;
          text-align: left;
          margin: 30px auto;
          border: 1px solid #400303;
        "
      >
        <caption class="q-mb-lg text-h5">
          Список задач
        </caption>
        <tr style="font-size: 16px">
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Исполнители</th>
          <th>Модуль</th>
          <th></th>
        </tr>

        <tr
          style="border: solid 1px #400303"
          v-for="task in tasksListById"
          :key="task.index"
          :class="
            task.property8 == 8536411824694842134
              ? 'bg-pink-4'
              : task.property8 == 3812168432889805433
              ? 'bg-yellow-4'
              : 'bg-light-green-4'
          "
        >
          <td>{{ task.name }}</td>
          <td>{{ task.property3 }}</td>
          <td v-if="task.property8 == 8536411824694842134">Назначена</td>
          <td v-else-if="task.property8 == 3812168432889805433">Выполнена</td>
          <td v-else>Завершена</td>
          <td>
            {{ task.property5.fullname.first_name }}
            {{ task.property5.fullname.last_name }}
          </td>
          <td>{{ task.property9.name }}</td>
          <td>
            <div class="flex justify-center">
              <q-btn
                class="bg-teal-10 text-white q-ma-xs"
                icon="edit"
                @click="getTaskId(task.id)"
              >
              </q-btn>
            </div>
          </td>
        </tr>
      </table>
    </q-list>

    <q-dialog v-model="alert">
      <q-card>
        <q-form class="row justify-center" @submit.prevent="updateTasks">
          <p class="col-12 text-h5 text-center q-mt-md">Изменить Задачу</p>
          <div class="q-gutter-y-lg">
            <q-input label="Cтатус" v-model="taskStatus">
              <template #append>
                <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
                <q-popup-proxy>
                  <q-list v-close-popup>
                    <q-item clickable @click="getTaskStatus('Назначена')">
                      <q-item-section>
                        <q-item-label>Назначена</q-item-label>
                      </q-item-section></q-item
                    >
                    <q-item clickable @click="getTaskStatus('Выполнена')">
                      <q-item-section>
                        <q-item-label>Выполнена</q-item-label>
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
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import {
  getPerformerUser,
  getModules,
  getTasks,
  getSubjectTasks,
} from "src/graphql/query";
import { taskUpdate, taskDelete } from "src/graphql/mutation";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const tasksList = ref([]);
    const tasksListById = ref([]);
    const ownerTasksList = ref([]);
    const modulesList = ref([]);
    const performerUsers = ref([]);
    const alert = ref(false);
    const title = ref("");
    const description = ref("");
    const performerUser = ref("");
    const moduleId = ref();
    const taskId = ref();
    const taskStatus = ref();

    const performerUserToggler = ref(false);
    const userID = localStorage.getItem("userSignInId");

    const getTaskId = (id) => {
      alert.value = true;
      taskId.value = id;

      ownerTasksList.value.forEach((item) => {
        // console.log(ownerTasksList.value);
        if (item.id === taskId.value) {
          title.value = item.name;
          performerUser.value = item.property5.id;
          description.value = item.property3;
          taskStatus.value = item.property8;
          moduleId.value = item.property9.id;
        }
        // console.log(moduleId);
      });
      modulesGet();
      getPerformer();
    };

    const subjectTasksGet = () => {
      const { result, onResult, refetch } = useQuery(getSubjectTasks);

      onResult(() => {
        tasksList.value = result.value.paginate_subject.data;

        tasksListById.value = [];
        for (let i = 0; i < tasksList.value.length; i++) {
          for (let j = 0; j < tasksList.value[i].property5.length; j++) {
            if (tasksList.value[i].property5[j].property5.user_id == userID) {
              tasksListById.value.push(tasksList.value[i].property5[j]);
            }
          }
        }
        getOwnerTasksList();
      });

      refetch();

      return {
        onResult,
      };
    };

    subjectTasksGet();

    const getPerformer = () => {
      const { result, onResult, refetch } = useQuery(getPerformerUser);

      onResult(() => {
        performerUsers.value = result.value.get_group.subject;
        checkPerformerUser();
      });

      refetch();
      return {
        onResult,
      };
    };

    const checkPerformerUser = () => {
      for (let i = 0; i < performerUsers.value.length; i++) {
        if (performerUsers.value[i].user_id == userID.value) {
          performerUserToggler.value = true;
        }
      }
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

    const getOwnerTasksList = () => {
      const { result, onResult, refetch } = useQuery(getTasks);

      onResult(() => {
        ownerTasksList.value = result.value.paginate_type2.data;
      });

      refetch();

      return {
        onResult,
      };
    };

    const { mutate: deleteTask } = useMutation(taskDelete);

    const deleteTasks = async (id) => {
      const { data } = await deleteTask({
        id: id,
      });
      subjectTasksGet();
    };

    const getUserId = (id) => {
      performerUser.value = id;
    };

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
      $q.notify({
        message: "Задача изменена",
        icon: "check",
        timeout: 1000,
        color: "black",
      });
      reset();
      subjectTasksGet();
    };

    const reset = () => {
      (taskId.value = ""),
        (title.value = ""),
        (description.value = ""),
        (taskStatus.value = ""),
        (performerUser.value = ""),
        (moduleId.value = "");
    };

    return {
      tasksListById,
      deleteTasks,
      alert,
      modulesGet,
      modulesList,
      performerUsers,
      getPerformer,
      title,
      description,
      getUserId,
      getModuleId,
      performerUser,
      moduleId,
      taskId,
      getTaskId,
      updateTasks,
      taskStatus,
      getTaskStatus,
      reset,
      getOwnerTasksList,
      ownerTasksList,
      performerUserToggler,
      checkPerformerUser,
      userID,
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

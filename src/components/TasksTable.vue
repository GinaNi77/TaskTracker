<template>
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
        v-for="task in tasksList"
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
              v-if="userID == 5120362227219750820"
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
    <UpdateTask
    :title="title"
    :performerUser="performerUser"
    :description="description"
    :taskStatus="taskStatus"
    :moduleId="moduleId"
    :taskId="taskId"
    @updateTask="closeWindow"   />
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
import { getTasks } from "src/graphql/query";
import { taskDelete } from "src/graphql/mutation";
import { useQuasar } from "quasar";
import UpdateTask from "src/components/UpdateTask.vue"

export default defineComponent({
  components:{
    UpdateTask
  },
  setup() {
    const $q = useQuasar();
    const tasksList = ref([]);
    const alert = ref(false);
    const title = ref("");
    const description = ref("");
    const performerUser = ref("");
    const moduleId = ref();
    const taskId = ref();
    const taskStatus = ref();
    const userID = localStorage.getItem("userSignInId");

    const getTaskId = (id) => {
      alert.value = true;
      taskId.value = id;

      tasksList.value.forEach((item) => {
        if (item.id === taskId.value) {
          title.value = item.name;
          performerUser.value = item.property5.id;
          description.value = item.property3;
          taskStatus.value = item.property8;
          moduleId.value = item.property9.id;
        }
      });
    };

    const getTasksList = () => {
      const { result, onResult, refetch } = useQuery(getTasks);

      onResult(() => {
        tasksList.value = [];

        if (userID == 5120362227219750820) {
          tasksList.value = result.value.paginate_type2.data;
        } else {
          tasksList.value = result.value.paginate_type2.data.filter(
            (item) => item.property5.user_id == userID
          );
        }
      });

      refetch();

      return {
        onResult,
      };
    };

    getTasksList();

    const { mutate: deleteTask } = useMutation(taskDelete);

    const deleteTasks = async (id) => {
      const { data } = await deleteTask({
        id: id,
      });
      getTasksList();
    };

    const closeWindow = ()=>{
      alert.value = false;
  
      $q.notify({
        message: "Задача изменена",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
    }   

    return {
      closeWindow,
      deleteTasks,
      alert,
      title,
      description,
      performerUser,
      moduleId,
      taskId,
      getTaskId,
      taskStatus,
      userID,
      getTasksList,
      tasksList,
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

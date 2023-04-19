<template>
  <div class="flex justify-end q-py-lg" style="width: 90%; margin: 0 auto">
    <q-btn round color="black" no-border flat to="/addTask" icon="add_circle" />
  </div>

  <q-list class="q-mb-xl flex justify-center">
    <div
      style="width: 100%"
      class="flex justify-center"
      v-if="tasksList.length"
    >
      <table style="width: 90%; border-collapse: collapse">
        <tr>
          <th>Название</th>
          <th>Задача</th>
          <th>Описание</th>
          <th>Имя исполнителя</th>
          <th>Фамилия исполнителя</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>

        <tr
          v-for="item in tasksList"
          :key="item.index"
          :class="
            item.property8 == 8536411824694842134
              ? 'bg-pink-4'
              : item.property8 == 3812168432889805433
              ? 'bg-yellow-4'
              : 'bg-light-green-4'
          "
        >
          <td>{{ item.property9.name }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.property3 }}</td>
          <td>{{ item.property5.fullname.first_name }}</td>
          <td>{{ item.property5.fullname.last_name }}</td>

          <td v-if="item.property8 == 8536411824694842134">Назначена</td>
          <td v-else-if="item.property8 == 3812168432889805433">Выполнена</td>
          <td v-else>Завершена</td>

          <td>
            <div class="flex justify-center">
              <q-btn
                class="bg-teal-10 q-ma-xs text-white"
                icon="edit"
                @click="getTaskId(item.id)"
              />

              <q-btn v-if="userID == 5120362227219750820"
                class="bg-red-10 q-ma-xs text-white"
                icon="delete"
                @click="deleteModules(item.id)"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="flex column justify-center items-center" v-else>
      <q-icon name="sentiment_very_satisfied" color="grey" size="10em" />
      <div style="color: #a0a0a0" class="text-h5">Все задачи решены!</div>
    </div>
  </q-list>
  <q-dialog v-model="alert">
      <UpdateTaskPerformer
    :title="title"
    :performerUser="performerUser"
    :description="description"
    :taskStatus="taskStatus"
    :moduleId="moduleID"
    :taskId="taskId"
    @updateTask="closeWindow"/>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onUpdated, onBeforeUpdate } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import router from "../router";
import { useQuasar } from "quasar";
import { taskDelete } from "src/graphql/mutation";
import { getTasks } from "src/graphql/query";
import UpdateTaskPerformer from "src/components/UpdateTaskPerformer.vue"

export default defineComponent({
  components:{
    UpdateTaskPerformer
  },
  setup() {
    const $q = useQuasar();
    const tasksList = ref([]);
    const moduleID = ref();
    const taskId = ref();
    const alert = ref(false);
    const taskStatus = ref();
    const title = ref("");
    const description = ref("");
    const performerUser = ref("");

    const userID = localStorage.getItem("userSignInId");

    moduleID.value = router.currentRoute.value.params.id;

    const tasksGet = () => {
      const { result, onResult, refetch } = useQuery(getTasks);
      refetch();
      onResult(() => {
        tasksList.value = result.value.paginate_type2.data.filter(
          (item) => item.property9.id === moduleID.value
        );
      });
    };

    const { mutate: deleteModuleTask } = useMutation(taskDelete);

    const deleteModules = async (id) => {
      const { data } = await deleteModuleTask({
        id: id,
      });
      console.log("deleted");
    };

    tasksGet();

    onUpdated(() => {
      moduleID.value = router.currentRoute.value.params.id;
      tasksGet();
    });

    const getTaskId = (id) => {
      alert.value = true;
      taskId.value = id;

      tasksList.value.forEach((item) => {
        if (item.id === taskId.value) {
          title.value = item.name;
          performerUser.value = item.property5.id;
          description.value = item.property3;
          taskStatus.value = item.property8;
        }
      });
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
      tasksList,
      deleteModules,
      alert,
      getTaskId,
      closeWindow,
      taskStatus,
      title,
      description,
      performerUser,
      userID,
      moduleID
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


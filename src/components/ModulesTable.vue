<template>
  <q-list class="q-mb-xl flex justify-center">
    <table style="width: 90%; border-collapse: collapse">
      <caption class="q-my-lg text-h5">
        Список модулей
      </caption>
      <tr>
        <th>Название</th>
        <th>Дата начала</th>
        <th>Дата конца</th>
        <th>Имя ответственного</th>
        <th>Фамилия ответственного</th>
        <th>Назначено</th>
        <th>Выполнено</th>
        <th>Завершено</th>
        <th></th>
      </tr>

      <tr v-for="item in modulesList" :key="item.index">
        <td>{{ item.name }}</td>
        <td>{{ item.property6.date }}</td>
        <td>{{ item.property7.date }}</td>
        <td>{{ item.property4.fullname.first_name }}</td>
        <td>{{ item.property4.fullname.last_name }}</td>
        <td>
          {{
            item.property9.reduce(function (count, cur_value) {
              if (cur_value.property8 == "8536411824694842134") {
                return ++count;
              } else return count;
            }, 0)
          }}
        </td>
        <td>
          {{
            item.property9.reduce(function (count, cur_value) {
              if (cur_value.property8 == "3812168432889805433") {
                return ++count;
              } else return count;
            }, 0)
          }}
        </td>
        <td>
          {{
            item.property9.reduce(function (count, cur_value) {
              if (cur_value.property8 == "6403872496291980172") {
                return ++count;
              } else return count;
            }, 0)
          }}
        </td>
        <td>
          <div class="flex justify-center">
            <q-btn
              class="bg-teal-10 text-white q-ma-xs"
              icon="edit"
              @click="getModuleId(item.id)"
            />
            <q-btn
              :disabled="item.property9.length ? '' : disabled"
              class="bg-red-10 q-ma-xs text-white"
              icon="delete"
              @click="deleteModules(item.id)" 
            />
          </div>
        </td>
      </tr>
    </table>
  </q-list>
  <div class="flex justify-center q-mb-lg">
    <q-btn color="black" outline to="/addModule">Добавить модуль</q-btn>
  </div>

  <q-dialog v-model="alert">
    <UpdateModule
    :moduleId="moduleId"
    :modulesList="modulesList"
    :title="title"
    :responsibleUser="responsibleUser"
    :start_date="start_date"
    :end_date="end_date"
    :responsibleUsers="responsibleUsers"
    @updateModule="closeWindow"
    />
  </q-dialog>
</template>

<script>
import { defineComponent, ref} from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { moduleDelete } from "src/graphql/mutation";
import { getResponsibleUser, getModules } from "src/graphql/query";
import { useQuasar } from "quasar";
import UpdateModule from "src/components/UpdateModule.vue"

export default defineComponent({
  components:{
    UpdateModule
  },
  setup() {
    const $q = useQuasar();
    const moduleId = ref();
    const modulesList = ref([]);
    const responsibleUsers = ref([]);
    const title = ref("");
    const responsibleUser = ref();
    const start_date = ref("");
    const end_date = ref();
    const alert = ref(false);

    const modulesGet = () => {
      const { result, onResult, refetch } = useQuery(getModules);

      onResult(() => {
        let userID = localStorage.getItem("userSignInId");
        if (userID != "5120362227219750820") {
          modulesList.value = result.value.paginate_type1.data.filter(
            (item) => item.property4.user_id == userID
          );
        } else {
          modulesList.value = result.value.paginate_type1.data;
        }
      });
      refetch();
    };

    const getModuleId = (id) => {
      alert.value = true;
      moduleId.value = id;

      modulesList.value.forEach((item) => {
        if (item.id === moduleId.value) {
          title.value = item.name;
          responsibleUser.value = item.property4.id;
          start_date.value = item.property6.date;
          end_date.value = item.property7.date;
        }
      });
    };

    const getResponsibleUsers = () => {
      const { result, onResult, refetch } = useQuery(getResponsibleUser);

      onResult(() => {
        responsibleUsers.value = result.value.get_group.subject;
      });
      refetch();
      return { onResult };
    };

    const { mutate: deleteModule } = useMutation(moduleDelete);

    const deleteModules = async (id) => {
      const { data } = await deleteModule({
        id: id,
      });
      modulesGet();
    };

      modulesGet();
      getResponsibleUsers();

    const closeWindow = ()=>{
      alert.value = false;
  
      $q.notify({
        message: "Модуль изменен",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
    }

    return {
      deleteModules,
      title,
      responsibleUsers,
      responsibleUser,
      start_date,
      end_date,
      getModuleId,
      alert,
      moduleId,
      modulesList,
      closeWindow
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
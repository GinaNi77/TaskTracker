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

      <tr v-for="item in modulesListById" :key="item.index">
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
    <q-card>
      <q-form class="row justify-center" @submit.prevent="updateModules">
        <p class="col-12 text-h5 text-center q-mt-md">Изменить Модуль</p>
        <div class="q-gutter-y-lg">
          <q-input label="Название" v-model="title" />

          <q-input label="Ответственный" v-model="responsibleUser">
            <template #append>
              <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="user in responsibleUsers"
                    :key="user.index"
                    @click="onItemClick(user.id)"
                  >
                    <q-item-section>
                      <q-item-label>{{
                        user.fullname.first_name +
                        "  " +
                        user.fullname.last_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-popup-proxy>
            </template>
          </q-input>

          <q-input label="Дата начала" v-model="start_date">
            <template #append>
              <q-icon name="event" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-date v-model="start_date" minimal mask="DD.MM.YYYY" />
              </q-popup-proxy>
            </template>
          </q-input>

          <q-input label="Дата окончания" v-model="end_date">
            <template #append>
              <q-icon name="event" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-date v-model="end_date" minimal mask="DD.MM.YYYY" />
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
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { moduleUpdate, moduleDelete } from "src/graphql/mutation";
import { getResponsibleUser, getModules } from "src/graphql/query";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const moduleId = ref();
    const modulesList = ref([]);
    const modulesListById = ref([]);
    const responsibleUsers = ref([]);
    const title = ref("");
    const responsibleUser = ref();
    const start_date = ref("");
    const end_date = ref();
    const alert = ref(false);

    const modulesGet = () => {
      const { result, onResult, refetch } = useQuery(getModules);

      onResult(() => {
        modulesList.value = result.value.paginate_type1.data;

        let userID = localStorage.getItem("userSignInId");
        if (userID != "5120362227219750820") {
          modulesListById.value = modulesList.value.filter(
            (item) => item.property4.user_id == userID
          );
        } else {
          modulesListById.value = modulesList.value;
        }
      });
      refetch();
    };

    const onItemClick = (id) => {
      responsibleUser.value = id;
    };

    const getModuleId = (id) => {
      alert.value = true;
      moduleId.value = id;

      modulesList.value.forEach((item) => {
        console.log(modulesList.value);
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

    const { mutate: updateModule } = useMutation(moduleUpdate);

    const updateModules = async (id) => {
      const { data } = await updateModule({
        id: moduleId.value,
        input: {
          name: title.value,
          property6: {
            date: start_date.value,
          },
          property7: {
            date: end_date.value,
          },
          property4: {
            "2730894142110796608": responsibleUser.value,
          },
        },
      });
      $q.notify({
        message: "Модуль изменен",
        icon: "check",
        timeout: 1000,
        color: "black",
      });
      resetForm();
      modulesGet();
    };

    const resetForm = () => {
      (moduleId.value = ""),
        (title.value = ""),
        (start_date.value = ""),
        (end_date.value = ""),
        (responsibleUser.value = "");
    };

    onMounted(() => {
      modulesGet();
      getResponsibleUsers();
    });

    return {
      modulesListById,
      deleteModules,
      title,
      responsibleUsers,
      responsibleUser,
      start_date,
      end_date,
      getModuleId,
      alert,
      moduleId,
      onItemClick,
      updateModules,
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
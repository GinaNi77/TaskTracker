<template>
  <div class="flex justify-end q-py-lg" style="width: 90%; margin: 0 auto">
    <q-btn round color="black" no-border flat to="/addTask" icon="add_circle" />
  </div>

  <q-list class="q-mb-xl flex justify-center">
    <div
      style="width: 100%"
      class="flex justify-center"
      v-if="tasksListById.length"
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
          v-for="item in tasksListById"
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

              <q-btn
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
                    v-for="user in performerList"
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
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onUpdated, onBeforeUpdate } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "../router";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const tasksList = ref([]);
    const tasksListById = ref([]);
    const moduleID = ref();
    const taskId = ref();
    const alert = ref(false);
    const taskStatus = ref();
    const title = ref("");
    const description = ref("");
    const performerUser = ref("");
    const performerList = ref(
      JSON.parse(localStorage.getItem("performerArray"))
    );

    moduleID.value = router.currentRoute.value.params.id;
    console.log(moduleID.value);

    const getTasks = () => {
      const { result, onResult, refetch } = useQuery(
        gql`
          query getModules {
            paginate_type2(page: 1, perPage: 100) {
              data {
                id
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
                property9 {
                  id
                  name
                  property4 {
                    fullname {
                      first_name
                      last_name
                    }
                  }
                }
              }
            }
          }
        `,
        null,
        {
          pollInterval: 1,
        }
      );

      refetch();
      onResult(() => {
        tasksList.value = result.value.paginate_type2.data;
        console.log(tasksList.value);

        tasksListById.value = tasksList.value.filter(
          (item) => item.property9.id === moduleID.value
        );

        console.log(tasksListById.value);
      });
    };

    const { mutate: deleteModuleTask } = useMutation(gql`
      mutation ($id: String!) {
        delete_type2(id: $id) {
          status
        }
      }
    `);

    const deleteModules = async (id) => {
      const { data } = await deleteModuleTask({
        id: id,
      });
      console.log("deleted");
    };

    getTasks();

    onUpdated(() => {
      moduleID.value = router.currentRoute.value.params.id;
      getTasks();
    });

    const getTaskId = (id) => {
      alert.value = true;
      taskId.value = id;
    };

    const getTaskStatus = (status) => {
      if (status == "Выполнена") {
        taskStatus.value = "3812168432889805433";
      } else {
        taskStatus.value = "6403872496291980172";
      }
    };

    const getUserId = (id) => {
      performerUser.value = id;
    };

    const { mutate: updateTask } = useMutation(gql`
      mutation ($id: String!, $input: update_type2_input!) {
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
            property9 {
              name
              property4 {
                fullname {
                  first_name
                  last_name
                }
              }
            }
          }
        }
      }
    `);

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
            "6591698446779899108": moduleID.value,
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
      tasksList,
      tasksListById,
      deleteModules,
      alert,
      getTaskId,
      getTaskStatus,
      taskStatus,
      title,
      description,
      updateTasks,
      getUserId,
      performerList,
      performerUser,
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


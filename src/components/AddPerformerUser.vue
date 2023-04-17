<template>
  <q-page padding>
    <q-list class="q-mb-xl">
      <table style="width: 100%; border-collapse: collapse">
        <caption class="q-my-lg text-h5">
          Список исполнителей
        </caption>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Email</th>
        </tr>

        <tr v-for="user in performerUsers" :key="user.index">
          <td>{{ user.fullname.first_name }}</td>
          <td>{{ user.fullname.last_name }}</td>
          <td>{{ user.email.email }}</td>
        </tr>
      </table>
    </q-list>

    <div class="flex justify-center q-mb-lg">
      <q-btn
        outline
        size="md"
        color="black"
        label="Добавить исполнителя"
        @click="alert = true"
      />
    </div>

    <q-dialog v-model="alert">
      <q-card>
        <q-form
          class="row justify-center q-my-md"
          @submit.prevent="addPerformer"
        >
          <p class="col-12 text-h5 text-center">Добавить исполнителя</p>
          <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
            <q-input label="Имя" v-model="form.name" />

            <q-input label="Фамилия" v-model="form.surname" />

            <q-input label="Почта" v-model="form.email" />

            <div class="q-mt-lg">
              <q-btn
                outline
                size="md"
                color="black"
                label="Добавить"
                class="full-width"
                type="submit"
              />
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useQuery } from "@vue/apollo-composable";
import { getPerformerUser } from "src/graphql/query"
import {addUserToGroup} from "src/graphql/mutation"
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "add-performer-user",

  setup() {
    const alert = ref(false);
    const form = ref({
      name: "",
      email: "",
      surname: "",
    });

    const $q = useQuasar();
    const performerUsers = ref([]);

    const newPerformer = () =>{

    const { result, onResult, refetch } = useQuery(getPerformerUser)

    onResult(() => {
      performerUsers.value = result.value.get_group.subject;
      localStorage.setItem("performerArray", JSON.stringify(performerUsers.value))
    });
    refetch()
    
    return{
      onResult
    }
  }

  newPerformer()

    const { mutate: userGroupInviteUser } = useMutation(addUserToGroup)

    const addPerformer = async () => {
      const { data } = await userGroupInviteUser({
        input: {
          name: form.value.name,
          surname: form.value.surname,
          email: form.value.email,
          page_group_id: "3969277701932267641",
        },
      });
      $q.notify({
        message: "Исполнитель добавлен",
        icon: "check",
        timeout: 1000,
        color:"black"
      });

      resetForm();
      newPerformer()
    };

    const resetForm = () => {
      (form.value.email = ""),
        (form.value.surname = ""),
        (form.value.name = "");
    };

    return {
      form,
      addPerformer,
      performerUsers,
      alert,
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
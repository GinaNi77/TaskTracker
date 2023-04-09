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
import gql from "graphql-tag";

export default defineComponent({
  name: "add-performer-user",

  setup() {
    const alert = ref(false);
    const form = ref({
      name: "",
      email: "",
      surname: "",
    });

    const performerUsers = ref([]);

    const { result, onResult, refetch } = useQuery(
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
      localStorage.setItem("performerArray", JSON.stringify(performerUsers.value))
    });

    const { mutate: userGroupInviteUser } = useMutation(gql`
      mutation UserGroupInviteUser($input: UserGroupInviteUserInput!) {
        userGroupInviteUser(input: $input) {
          status
        }
      }
    `);

    const addPerformer = async () => {
      const { data } = await userGroupInviteUser({
        input: {
          name: form.value.name,
          surname: form.value.surname,
          email: form.value.email,
          page_group_id: "3969277701932267641",
        },
      });

      resetForm();
    };

    const resetForm = () => {
      (form.value.email = ""),
        (form.value.surname = ""),
        (form.value.name = "");
    };

    refetch();
    return {
      form,
      addPerformer,
      onResult,
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
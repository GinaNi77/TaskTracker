<template>

  <q-page padding>
    <q-list class="q-mb-xl">
      <table style="width: 100%; border-collapse: collapse">
        <caption class="q-my-lg text-h5">
          Список ответственных
        </caption>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Email</th>
        </tr>

        <tr v-for="user in responsibleUsers" :key="user.index">
          <td>{{ user.fullname.first_name }}</td>
          <td>{{ user.fullname.last_name }}</td>
          <td>{{ user.email.email }}</td>
        </tr>
      </table>
    </q-list>

    <q-form class="row justify-center" @submit.prevent="addResponsible">
      <p class="col-12 text-h5 text-center">Добавить ответственного</p>
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
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  setup() {
    const form = ref({
      name: "",
      email: "",
      surname: "",
    });

    const responsibleUsers = ref([]);

    const { result, onResult } = useQuery(
      gql`
        query {
          get_group(id: "4833572297286333641") {
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
      responsibleUsers.value = result.value.get_group.subject;
    });

    const { mutate: userGroupInviteUser } = useMutation(gql`
      mutation UserGroupInviteUser($input: UserGroupInviteUserInput!) {
        userGroupInviteUser(input: $input) {
          status
        }
      }
    `);

    const addResponsible = async () => {
      const { data } = await userGroupInviteUser({
        input: {
          name: form.value.name,
          surname: form.value.surname,
          email: form.value.email,
          page_group_id: "9163702586231323932",
        },
      });
      resetForm();
    };

    const resetForm = () => {
      (form.value.email = ""),
        (form.value.surname = ""),
        (form.value.name = "");
    };


    return{
        form, addResponsible, onResult, responsibleUsers
    }
  }
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
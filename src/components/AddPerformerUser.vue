<template>
  <q-page padding>
    <q-list>
      <q-item v-for="user in performerUsers" :key="user.index">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.fullname.first_name.substr(0, 1) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label
            >{{ user.fullname.first_name }}
            {{ user.fullname.last_name }}</q-item-label
          >
          <q-item-label>{{ user.email.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-form class="row justify-center" @submit.prevent="addPerformer">
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
    const form = ref({
      name: "",
      email: "",
      surname: "",
    });

    const performerUsers = ref([]);

    const { result, onResult } = useQuery(
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
      console.log(performerUsers.value);
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
      console.log(data.userGroupInviteUser.status);
      resetForm();
    };

    const resetForm = () => {
      (form.value.email = ""),
        (form.value.surname = ""),
        (form.value.name = "");
    };

    return {
      form,
      addPerformer,
      onResult,
      performerUsers,
    };
  },
});
</script>
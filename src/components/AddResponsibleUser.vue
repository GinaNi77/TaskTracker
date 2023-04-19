<template>
      <q-card>
        <q-form
          class="row justify-center q-my-md"
          @submit.prevent="addResponsible"
        >
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
      </q-card>
</template>

<script>
  export default {
    name: 'AddResponsibleUser',
  }
</script>

<script setup>
import { ref } from 'vue'

import { useMutation } from "@vue/apollo-composable";
import {addUserToGroup} from "src/graphql/mutation"
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

    const form = ref({
      name: "",
      email: "",
      surname: "",
    });

    const emit = defineEmits(['newResponsible'])


    const { mutate: userGroupInviteUser } = useMutation(addUserToGroup)

    const addResponsible = async () => {
      const { data } = await userGroupInviteUser({
        input: {
          name: form.value.name,
          surname: form.value.surname,
          email: form.value.email,
          page_group_id: "9163702586231323932",
        },
      });
      emitFun()
      
      resetForm();
      
    };

    const emitFun = ()=>{
        emit("newResponsible");
    }

    const resetForm = () => {
      (form.value.email = ""),
        (form.value.surname = ""),
        (form.value.name = "");
    };

</script>

<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="signIn">
      <p class="col-12 text-h5 text-center">Вход</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
        <q-input label="Почта" v-model="form.email" />

        <q-input label="Пароль" v-model="form.password" />

        <div class="q-mt-lg">
          <q-btn
            outline
            size="md"
            color="black"
            label="Войти"
            class="full-width"
            type="submit"
            @click="signIn"
          />
        </div>

        <div>
          <q-btn
            flat
            size="md"
            color="black"
            label="Регистрация"
            class="full-width"
            to="/register"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import router from "src/router";
import {userSignIn} from "src/graphql/mutation" 

import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

export default defineComponent({
  name: "PageLogin",
  setup() {
    const form = ref({
      email: "",
      password: "",
    });

    const { mutate: signInUser } = useMutation(userSignIn)

    const signIn = async () => {
      const { data } = await signInUser({
        input: {
          login: form.value.email,
          password: form.value.password,
        },
      });
      localStorage.setItem("token", data.userSignIn.record.access_token);
      localStorage.setItem("userSignInId", data.userSignIn.recordId);

      resetForm();
      if (data.userSignIn.status === 200) {
        window.location.href = "#/main";
      }
    };

    const resetForm = () => {
      (form.value.email = ""), (form.value.password = "");
    };

    return {
      form,
      signIn,
      resetForm,
    };
  },
});
</script>
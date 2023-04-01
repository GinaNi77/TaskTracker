<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="">
      <p class="col-12 text-h5 text-center">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
        <q-input label="Email" v-model="form.email" />

        <q-input label="Password" v-model="form.password" />

        <div class="q-mt-lg">
          <q-btn
            outline
            size="md"
            color="black"
            label="Login"
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
            label="Register"
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
import gql from "graphql-tag";

export default defineComponent({
  name: "PageLogin",
  setup() {
    const form = ref({
      email: "",
      password: "",
    });

    const { mutate: signInUser } = useMutation(gql`
      mutation UserSignIn($input: UserSignInInput!) {
        userSignIn(input: $input) {
          recordId
          record {
            token_type
            expires_in
            access_token
            refresh_token
          }
          status
        }
      }
    `);

    const signIn = async () => {
      const { data } = await signInUser({
        input: {
          login: form.value.email,
          password: form.value.password,
        },
      });

      console.log(data.userSignIn);
      console.log(data.userSignIn.status);

      if (data.userSignIn.status === 200) {
        window.location.href = "#/main";
      }
    };

    return {
      form,
      signIn,
      signInUser,
    };
  },
});
</script>
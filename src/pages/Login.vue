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
import { useMutation, useQuery } from "@vue/apollo-composable";
import { userSignIn } from "src/graphql/mutation";
import gql from "graphql-tag";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

export default defineComponent({
  name: "PageLogin",
  emits: ["authorized"],
  setup(props, { emit }) {
    const form = ref({
      email: "sofiya.khodyreva@bk.ru",
      password: "SofiyaKH",
    });
    localStorage.clear();
    emit("clear");
    console.log(localStorage.getItem("userSignInId"));

    // const subjectId = ref([])

    const { mutate: signInUser } = useMutation(userSignIn)

    const signIn = async () => {
      const { data } = await signInUser({
        input: {
          login: form.value.email,
          password: form.value.password,
        },
      });
      // userIdGet(data.userSignIn.recordId)

      resetForm();
      if (data.userSignIn.status === 200) {
        localStorage.setItem("token", data.userSignIn.record.access_token);
        localStorage.setItem("userSignInId", data.userSignIn.recordId);
        emit("authorized");
        window.location.href = "#/main";
      }
    };

//     const userIdGet=(subjectData)=>{

//       console.log(subjectData)
//       const { result, onResult } = useQuery(gql`
//         query {
//             paginate_subject(
//               page: 1
//               perPage: 100
//               where: {column: "user_id", operator: EQ, value: "${subjectData}"}
//             )
//             {
//               data {
//                 id
//                 type_id
//                 author_id
//                 level
//                 position
//                 created_at
//                 updated_at
//                 user_id
//                 fullname {
//                   first_name
//                   last_name
//                 }
//                 email{
//                   email
//                 }
              
//               } 
//           }
//         }`
// )
//       onResult(() => {
//         subjectId.value = result.value.paginate_subject.data
//         console.log(subjectId.value)
//       });

//       return{
//         onResult, subjectId
//       }
//     }

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
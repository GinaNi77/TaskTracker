<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="signUp">
            <p class="col-12 text-h5 text-center">Регистрация</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
                <q-input
                    label="Имя"
                    v-model="form.name"
                />

                <q-input
                    label="Фамилия"
                    v-model="form.surname"
                />

                <q-input
                    label="Почта"
                    v-model="form.email"
                /> 

                <div class="q-mt-lg">
                    <q-btn outline size="md" color="black" label="Register" class="full-width" type="submit"/>     
                </div>    

                <q-form  @submit.prevent="setPassword">
                    <q-input
                        label="Код"
                        v-model="formPas.code"
                    />

                    <q-input
                        label="Пароль"
                        v-model="formPas.password"
                    />

                    <div class="q-mt-lg">
                        <q-btn outline size="md" color="black" label="Установить пароль" class="full-width" type="submit"/>     
                    </div>    
                </q-form>
            </div>

        
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from "graphql-tag";

export default defineComponent({
  name: 'PageRegister',
  setup(){
    const form = ref({
        name:"",
        email: "",
        surname: ""
    })

    const formPas = ref({
        code:"",
        password: "",
    })

     const { mutate: userSignUp } = useMutation(gql`
        mutation UserSignUp($input: UserSignUpInput!) {
        userSignUp(input: $input) {
            recordId
            record {
                id
                email
                registration_passed
                name
                surname
            }
            status
        }
        }`
    )

    const signUp = async () => {
       const {data} = await userSignUp(
        {
            "input": {
            "name": form.value.name,
            "surname": form.value.surname,
            "email": form.value.email
            }
        })
        console.log(data.userSignUp.recordId)
        localStorage.setItem("userSignUpId", data.userSignUp.recordId)   
    };

    const { mutate: userSignUpSetPassword } = useMutation(gql`
    mutation UserSignUpSetPassword($input: UserSignUpSetPasswordInput!) {
    userSignUpSetPassword(input: $input) {
            status
    }
    }`)

      const setPassword = async () => {
       const {data} = await userSignUpSetPassword(
        {
        "input": {
        "user_id": localStorage.getItem('userSignUpId'),
            "code": formPas.value.code,
            "password": formPas.value.password
        }
        }
       )
       resetForm();
       if (data.userSignUpSetPassword.status === 200) {
            window.location.href = "#/login";
        }
    };

    const resetForm = () => {
      form.value.email = "",
      form.value.surname = "",
      form.value.name = "",
      formPas.value.code = "",
      formPas.value.password = ""
    };

    return{
        form, formPas, signUp, setPassword
    }
  }
})
</script>
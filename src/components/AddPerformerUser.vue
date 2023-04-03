<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="addPerformer">
            <p class="col-12 text-h5 text-center">Добавить исполнителя</p>
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
                    <q-btn outline size="md" color="black" label="Добавить" class="full-width" type="submit"/>     
                </div>    
            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from "graphql-tag";

export default defineComponent({
  setup(){
    const form = ref({
        name:"",
        email: "",
        surname: ""
    })

     const { mutate: userGroupInviteUser } = useMutation(gql`
            mutation inviteUserToGroup($input: InviteUserToGroupInput!) {
                inviteUserToGroup(input: $input) {
                status
            }
        }`
    )

    const addPerformer = async () => {
       const {data} = await userGroupInviteUser(
        {
            "input": {
            "name": form.value.name,
            "surname": form.value.surname,
            "email": form.value.email,
            "page_group_id": "4753316581813399177"
            }
        }) 
        resetForm()
    };

    const resetForm = () => {
      form.value.email = "",
      form.value.surname = "",
      form.value.name = ""
    };

    return{
        form, addPerformer
    }
  }
})
</script>
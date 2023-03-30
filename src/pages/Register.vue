<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="">
            <p class="col-12 text-h5 text-center">Register</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
                <q-input
                    label="Name"
                    v-model="form.name"
                />

                <q-input
                    label="Surname"
                    v-model="form.surname"
                />

                <q-input
                    label="Mail"
                    v-model="form.email"
                /> 

                <div class="q-mt-lg">
                    <q-btn outline size="md" color="black" label="Register" class="full-width" type="submit"/>     
                </div>    
            </div>
        </q-form>
    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'PageRegister',
  setup(){
    const form = ref({
        name:"",
        email: "",
        surname: ""
    })
    return{
        form
    }
  }
})
</script>
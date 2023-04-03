<template>
    <div>Ответственные</div>

    <q-form class="row justify-center" @submit.prevent="signIn">
            <p class="col-12 text-h5 text-center">Login</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
                <q-input
                    label="Name"
                    v-model="form.name"
                />

                <q-input
                    label="Password"
                    v-model="form.password"
                /> 

                <div class="q-mt-lg">
                    <q-btn outline size="md" color="black" label="Login" class="full-width" type="submit"/>     
                </div>

                <div >
                    <q-btn flat size="md" color="black" label="Register" class="full-width" to="/register"/>     
                </div>     
            </div>
        </q-form>
</template>
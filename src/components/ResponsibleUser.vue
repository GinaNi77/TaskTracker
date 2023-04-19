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

    <div class="flex justify-center q-mb-lg">
      <q-btn
        outline
        size="md"
        color="black"
        label="Добавить ответственного"
        @click="alert = true"
      />
    </div>

    <q-dialog v-model="alert">
      <AddResponsibleUser @newResponsible="closeWindow"/>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getResponsibleUser } from "src/graphql/query";
import { useQuasar } from 'quasar'
import AddResponsibleUser from "src/components/AddResponsibleUser.vue";

export default defineComponent({
  components:{
    AddResponsibleUser,
  },

  setup() {
    const alert = ref(false);
    const $q = useQuasar();
    const responsibleUsers = ref([]);

    const newResponsible = () =>{
      const { result, onResult, refetch } = useQuery(getResponsibleUser)
      refetch()
      onResult(() => {
        responsibleUsers.value = result.value.get_group.subject;
      });
      
      return{
        onResult
      }
    }

    newResponsible()

    const closeWindow = ()=>{
      alert.value = false
      newResponsible()

      $q.notify({
        message: "Ответственный добавлен",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
    }

    return {
      responsibleUsers,
      alert,
      closeWindow
    };
  },
});
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
<template>
  <q-page padding>
    <q-list class="q-mb-xl">
      <table style="width: 100%; border-collapse: collapse">
        <caption class="q-my-lg text-h5">
          Список исполнителей
        </caption>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Email</th>
        </tr>

        <tr v-for="user in performerUsers" :key="user.index">
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
        label="Добавить исполнителя"
        @click="alert = true"
      />
    </div>

    <q-dialog v-model="alert">
      <AddPerformerUser @newPerformer="closeWindow"/>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getPerformerUser } from "src/graphql/query"
import { useQuasar } from 'quasar'
import AddPerformerUser from "src/components/AddPerformerUser.vue";

export default defineComponent({
  name: "PerformerUser",
  components:{
    AddPerformerUser,
  },

  setup() {
    const alert = ref(false);

    const $q = useQuasar();
    const performerUsers = ref([]);

    const newPerformers = () => {

      const { result, onResult, refetch } = useQuery(getPerformerUser)
      refetch()
      onResult(() => {
        performerUsers.value = result.value.get_group.subject;
      });
      return{
        onResult
      }
  }

  newPerformers()

  const closeWindow = ()=>{
      newPerformers();
      alert.value = false;
    

      $q.notify({
        message: "Исполнитель добавлен",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
    }

    return {
      performerUsers,
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
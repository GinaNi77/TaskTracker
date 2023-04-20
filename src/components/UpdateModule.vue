<template>
    <q-card>
      <q-form class="row justify-center" @submit.prevent="updateModules">
        <p class="col-12 text-h5 text-center q-mt-md">Изменить Модуль</p>
        <div class="q-gutter-y-lg">
          <q-input label="Название" v-model="title" />

          <q-input label="Ответственный" v-model="responsibleUser">
            <template #append>
              <q-icon name="arrow_drop_down" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="user in responsibleUsers"
                    :key="user.index"
                    @click="onItemClick(user.id)"
                  >
                    <q-item-section>
                      <q-item-label>{{
                        user.fullname.first_name +
                        "  " +
                        user.fullname.last_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-popup-proxy>
            </template>
          </q-input>

          <q-input label="Дата начала" v-model="start_date">
            <template #append>
              <q-icon name="event" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-date v-model="start_date" minimal mask="DD.MM.YYYY" />
              </q-popup-proxy>
            </template>
          </q-input>

          <q-input label="Дата окончания" v-model="end_date">
            <template #append>
              <q-icon name="event" class="cursor-pointer"></q-icon>
              <q-popup-proxy>
                <q-date v-model="end_date" minimal mask="DD.MM.YYYY" />
              </q-popup-proxy>
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn
              outline
              size="md"
              color="black"
              label="Изменить"
              class="full-width q-mb-md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card>
</template>

<script>
export default {
    name: 'UpdateModule',
  }
</script>

<script setup>
import { ref } from "vue"
import { useQuery, useMutation } from "@vue/apollo-composable";
import { moduleUpdate } from "src/graphql/mutation";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";

provideApolloClient(apolloClient);

const props = defineProps({
  title: String,
  responsibleUser: String,
  start_date: String,
  end_date: String,
  modulesList: Array,
  responsibleUsers:Array,
  moduleId: String,
})

const moduleId = ref(props.moduleId);
const modulesList = ref(props.modulesList);
const responsibleUsers = ref(props.responsibleUsers);
const title = ref(props.title);
const responsibleUser = ref(props.responsibleUser);
const start_date = ref(props.start_date);
const end_date = ref(props.end_date);

const onItemClick = (id) => {
      responsibleUser.value = id;
};

const emit = defineEmits(['updateModule'])

const { mutate: updateModule } = useMutation(moduleUpdate);

    const updateModules = async (id) => {

      const { data } = await updateModule({
        id: moduleId.value,
        input: {
          name: title.value,
          property6: {
            date: start_date.value,
          },
          property7: {
            date: end_date.value,
          },
          property4: {
            "2730894142110796608": responsibleUser.value,
          },
        },
      });

      emitFun();
      resetForm();
};

const resetForm = () => {
      (moduleId.value = ""),
        (title.value = ""),
        (start_date.value = ""),
        (end_date.value = ""),
        (responsibleUser.value = "");
    };

const emitFun = () => {
        emit("updateModule");
    }

</script>


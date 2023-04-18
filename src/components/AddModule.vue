<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="addModules">
      <p class="col-12 text-h5 text-center">Добавить Модуль</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
        <q-input label="Название" v-model="title" />

        <q-input label="Ответственный" v-model="responsibleUser">
          <template #append>
            <q-icon name="arrow_drop_down" class="cursor-pointer" @click=" getResponsibleUsers"></q-icon>
            <q-popup-proxy>
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  v-for="user in responsibleList"
                  :key="user.index"
                  @click="onItemClick(user.id)"
                >
                  <q-item-section>
                    <q-item-label>{{ user.fullname.first_name +" "+user.fullname.last_name}}</q-item-label>
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
            label="Добавить"
            class="full-width"
            type="submit"
            :modules="newModule"
            @click="
              $emit('@update:updateModules', newModule);
              $emit('addModule');
            "
          />
        </div>
        <div class="q-mt-lg">
          <q-btn
            flat
            size="md"
            color="black"
            label="Модули"
            class="full-width"
            to="/modules"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {addModule, ruleCreate} from "src/graphql/mutation"
import { useQuasar } from 'quasar'
import { getResponsibleUser } from "src/graphql/query"

export default defineComponent({
  props: ["modules"],
  setup() {
  
    const responsibleList = ref([])
    const title = ref("");
    const responsibleUser = ref();
    const start_date = ref();
    const end_date = ref();
    const $q = useQuasar();
  
    const newModule = ref();

    const onItemClick = (id) => {
      responsibleUser.value = id;
    };

     const getResponsibleUsers = () => {
      const { result, onResult, refetch } = useQuery(getResponsibleUser)

      onResult(() => {
        responsibleList.value = result.value.get_group.subject;
      });
      refetch();
      return { onResult, responsibleList };
    };

    const { mutate: moduleAdd } = useMutation(addModule)

const { mutate: createPermissionRule } = useMutation(ruleCreate)

    const createRule = async (moduleData) => {

      console.log(moduleData.create_type1.recordId)
      console.log(moduleData.create_type1.record.property4.id)

      const { data: ruleData } = await createPermissionRule({
        input: {
          model_type: "object",
          model_id: moduleData.create_type1.recordId,
          owner_type: "subject",
          owner_id: moduleData.create_type1.record.property4.id,
          level: 5,
        },
      });
      console.log(ruleData.permissionRuleCreate.status)
      console.log(ruleData.permissionRuleCreate.recordId)

    }

    const addModules = async () => {
      const { data } = await moduleAdd({
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
            // айдишник типа Субъект
          },
        },
      });

      console.log(data.create_type1.recordId)
      console.log(data.create_type1.record.property4.id)

      createRule(data)

       $q.notify({
        message: "Модуль добавлен",
        icon: "check",
        timeout: 1000,
        color:"black"
      });
      resetForm();
    };

    const resetForm = () => {
      (title.value = ""),
        (start_date.value = ""),
        (end_date.value = ""),
        (responsibleUser.value = "");
    };

    return {
      title,
      onItemClick,
      responsibleUser,
      start_date,
      end_date,
      addModules,
      responsibleList,  getResponsibleUsers
    };
  },
});
</script>

<template>
    <div>UserAlert</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import {Stomp} from "@stomp/stompjs"

export default defineComponent({
    setup() {

        let queue = '';

        const{mutate: getHash}= useMutation(gql`
        mutation {
            notificationSubscribe {
                hash
            }
            }
        `);

        const getUserHash = async () => {
        const { data } = await getHash({
        })
        queue = data.notificationSubscribe.hash
         console.log(queue)
        };

        getUserHash()

        let url = 'wss://stud.druid.1t.ru/ws';
        let client = Stomp.client(url);

        let headers = {
        login: 'readonly',
        passcode: '@3P^Lgdab)sv',
                        };

       

        let onConnect = async () => {
            console.log('connected');

            let onMessage = (message) => {
                console.log('Receive message:', JSON.parse(message.body));

                message.ack();
            };

            client.subscribe(`/amq/queue/${queue}`, onMessage, {ack: 'client'});
        }

        let onError = (msg) => {
            console.log('Error', msg);
        }

        let onClose = (msg) => {
            console.log('Close', msg);
        }

        client.connect(headers, onConnect, onError, onClose, '/');

        return{
            getUserHash
        }

    },
})
</script>

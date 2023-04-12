
import { useMutation } from "@vue/apollo-composable";
import { useQuery } from "@vue/apollo-composable";
import { getModulesTasks, getModules} from "src/graphql/query";
import { getQueue} from "src/graphql/mutation";
import {Stomp} from "@stomp/stompjs"


const { mutate: createQueue } = useMutation(getQueue);
const { refetch: refetchTasks} = useQuery(getModulesTasks);
const { refetch: refetchModules} = useQuery(getModules);


    const queueCreate = async () => {
        const { data: queueData } = await createQueue();
        localStorage.setItem("queue", queueData.notificationSubscribe.hash);

        return queueData;
    }

    const rabbitConnect = () => {

        const queue = localStorage.getItem("queue");

        let url = 'wss://stud.druid.1t.ru/ws';
        let client = Stomp.client(url);

        let headers = {
        login: 'readonly',
        passcode: '@3P^Lgdab)sv',
        };

        let onConnect = async () => {
            console.log('connected');

            let onMessage = (message) => {

                const msgObj = JSON.parse(message.body);
                console.log("Receive message:", msgObj);

                refetchTasks()
                refetchModules()

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
    
    
    }

    const rabbit = { queueCreate, rabbitConnect };
    export default rabbit;
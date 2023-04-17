import { useQuery, useMutation, provideApolloClient} from "@vue/apollo-composable";
import apolloClient from "src/apollo/client";
import { getTasks, getModules} from "src/graphql/query";
import { getQueue} from "src/graphql/mutation";
import { Stomp } from "@stomp/stompjs"

provideApolloClient(apolloClient);

const { mutate: createQueue } = useMutation(getQueue);
const { refetch: refetchTasks} = useQuery(getTasks);
const { refetch: refetchModules} = useQuery(getModules);


    const queueCreate = async () => {
        const { data} = await createQueue();
        localStorage.setItem("queue", data.notificationSubscribe.hash);

        return data;
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
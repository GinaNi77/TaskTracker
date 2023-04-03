import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from "@apollo/client/link/context";
import { concat } from "apollo-link";
export /* async */ function getClientOptions(/* {app, router, ...} */ options) {

  const httpLink = createHttpLink({
    uri:
      process.env.GRAPHQL_URI ||
      // Change to your graphql endpoint.
      "https://app.stud.druid.1t.ru/graphql",
  });
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    if (token === "") {
      return {
        headers: {
          ...headers,
        },
      };
    } else {
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    }
  });

  return Object.assign(
    // General options.
    {
      // link: createHttpLink({
      //   uri:
      //     process.env.GRAPHQL_URI ||
      //     // Change to your graphql endpoint.
      //     'https://app.stud.druid.1t.ru/graphql',
      // }),
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    },

    
    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},
    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},
    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}

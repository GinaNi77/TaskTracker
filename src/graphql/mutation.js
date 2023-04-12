import gql from "graphql-tag"

export const getQueue = gql `
mutation {
    notificationSubscribe {
        hash
    }
    }
`
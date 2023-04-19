import gql from "graphql-tag";


export const userSignIn = gql`
  mutation UserSignIn($input: UserSignInInput!) {
    userSignIn(input: $input) {
      recordId
      record {
        token_type
        expires_in
        access_token
        refresh_token
      }
      status
    }
  }
`;

export const getQueue = gql`
mutation {
    notificationSubscribe {
        hash
    }
    }
`;

export const addModule = gql`
      mutation ($input: create_type1_input!) {
        create_type1(input: $input) {
          status
          recordId
          record {
            id
            type_id
            author_id
            level
            position
            created_at
            updated_at
            name
            property4 {
              id
              user_id
              fullname {
                first_name
                last_name
              }
            }
            property6 {
              date
            }
            property7 {
              date
            }
          }
        }
      }
    `;

export const addTask = gql`
    mutation ($input: create_type2_input!) {
    create_type2(input: $input) {
    status
    recordId
    record {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
        property5 {
        id
        user_id
        fullname {
            first_name
            last_name
                 }
        }
        property3
        property8
        property9{
        name
        property4{
            id
            fullname{
            first_name
            last_name
                    }
                } 
            }
        }
    }
}`;

export const addUserToGroup = gql`
mutation UserGroupInviteUser($input: UserGroupInviteUserInput!) {
  userGroupInviteUser(input: $input) {
    status
  }
}
`;

export const moduleDelete = gql`
      mutation ($id: String!) {
        delete_type1(id: $id) {
          status
        }
      }
    `;

export const moduleUpdate = gql`
    mutation ($id: String!, $input: update_type1_input!) {
      update_type1(id: $id, input: $input) {
        status
        recordId
        record {
          id
          type_id
          author_id
          level
          position
          created_at
          updated_at
          name
          property4 {
            id
            user_id
            fullname {
              first_name
              last_name
            }
          }
          property6 {
            date
          }
          property7 {
            date
          }
        }
      }
    }
  `;

export const taskUpdate = gql`
  mutation ($id: String!, $input: update_type2_input!) {
    update_type2(id: $id, input: $input) {
      status
      recordId
      record {
        id
        type_id
        author_id
        level
        position
        created_at
        updated_at
        name
        property5 {
          id
          user_id
          fullname {
            first_name
            last_name
          }
        }
        property3
        property8
        property9 {
          name
          property4 {
            fullname {
              first_name
              last_name
            }
          }
        }
      }
    }
  }
`;

export const taskDelete = gql`
mutation ($id: String!) {
  delete_type2(id: $id) {
    status
  }
}
`;

export const SignUpSetPassword = gql`
mutation UserSignUpSetPassword($input: UserSignUpSetPasswordInput!) {
userSignUpSetPassword(input: $input) {
        status
}
}`

export const SignUp = gql`
mutation UserSignUp($input: UserSignUpInput!) {
userSignUp(input: $input) {
    recordId
    record {
        id
        email
        registration_passed
        name
        surname
    }
    status
}
}`

export const ruleCreate = gql`
mutation permissionRuleCreate($input: PermissionRuleCreateInput!) {
  permissionRuleCreate(input: $input) {
    recordId
    status
    record {
        id
        author_id,
        level
        model_type
        model_id,
        config,
        owner_id,
        owner_type,
        created_at,
        updated_at
    }
  }
}`
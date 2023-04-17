import gql from "graphql-tag"

export const getModulesTasks = gql`
      query getModules {
        paginate_type2(page: 1, perPage: 100) {
          data {
            id
            type_id
            author_id
            level
            position
            created_at
            updated_at
            name
            property3
            property8
            property5 {
              id
              user_id
              fullname {
                first_name
                last_name
              }
            }
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
          paginatorInfo {
            perPage
            currentPage
            lastPage
            total
            count
            from
            to
            hasMorePages
          }
        }
      }
    `;

    export const getModules = gql`
            query getModules {
              paginate_type1(page: 1, perPage: 100) {
                data {
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
                  property9 {
                    name
                    property8
                  }
                }
  
                paginatorInfo {
                  perPage
                  currentPage
                  lastPage
                  total
                  count
                  from
                  to
                  hasMorePages
                }
              }
            }
          `;
          
export const getResponsibleUser = gql`
              query {
                get_group(id: "4833572297286333641") {
                  name
                  subject {
                    id
                    type_id
                    email {
                      email
                    }
                    fullname {
                      first_name
                      last_name
                    }
                  }
                }
              }
            `;

export const getPerformerUser = gql`
            query {
              get_group(id: "4753316581813399177") {
                name
                subject {
                  id
                  type_id
                  email {
                    email
                  }
                  fullname {
                    first_name
                    last_name
                  }
                }
              }
            }
          `;

export const getTasks = gql`
              query getModules {
                paginate_type2(page: 1, perPage: 100) {
                  data {
                    id
                    type_id
                    author_id
                    level
                    position
                    created_at
                    updated_at
                    name
                    property3
                    property8
                    property5 {
                      id
                      user_id
                      fullname {
                        first_name
                        last_name
                      }
                    }
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
                  paginatorInfo {
                    perPage
                    currentPage
                    lastPage
                    total
                    count
                    from
                    to
                    hasMorePages
                  }
                }
              }
            `;

export const getSubjectTasks = gql`
query {
  paginate_subject(page: 1, perPage: 100) {
    data {
      id
      type_id
      author_id
      level
      position
      created_at
      updated_at
      user_id
      fullname {
        first_name
        last_name
      }
      property5 {
        name
        property3
        property8
        property9 {
          name
        }
        property5 {
          user_id
          fullname {
            first_name
            last_name
          }
        }
      }
    }
  }
}
`

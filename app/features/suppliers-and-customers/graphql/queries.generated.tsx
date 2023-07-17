import * as Types from '../../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSuppliersAndCustomersQueryVariables = Types.Exact<{
  namOrEmail?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetSuppliersAndCustomersQuery = { __typename?: 'Query', suppliersAndCustomers: { __typename?: 'SuppliersAndCustomerConnection', nodes: Array<{ __typename?: 'SuppliersAndCustomer', id: string, address: string, cpf: string, createdAt?: any | null, updatedAt?: any | null, email?: string | null, name?: string | null, phone: string }>, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null } } };


export const GetSuppliersAndCustomersDocument = gql`
    query getSuppliersAndCustomers($namOrEmail: String, $limit: Int = 9999, $offset: Int) {
  suppliersAndCustomers(
    filter: {or: [{name: {iLike: $namOrEmail}}, {email: {iLike: $namOrEmail}}]}
    paging: {limit: $limit, offset: $offset}
    sorting: {field: name, direction: ASC}
  ) {
    nodes {
      id
      address
      cpf
      createdAt
      updatedAt
      email
      name
      phone
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useGetSuppliersAndCustomersQuery__
 *
 * To run a query within a React component, call `useGetSuppliersAndCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSuppliersAndCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSuppliersAndCustomersQuery({
 *   variables: {
 *      namOrEmail: // value for 'namOrEmail'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetSuppliersAndCustomersQuery(baseOptions?: Apollo.QueryHookOptions<GetSuppliersAndCustomersQuery, GetSuppliersAndCustomersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSuppliersAndCustomersQuery, GetSuppliersAndCustomersQueryVariables>(GetSuppliersAndCustomersDocument, options);
      }
export function useGetSuppliersAndCustomersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSuppliersAndCustomersQuery, GetSuppliersAndCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSuppliersAndCustomersQuery, GetSuppliersAndCustomersQueryVariables>(GetSuppliersAndCustomersDocument, options);
        }
export type GetSuppliersAndCustomersQueryHookResult = ReturnType<typeof useGetSuppliersAndCustomersQuery>;
export type GetSuppliersAndCustomersLazyQueryHookResult = ReturnType<typeof useGetSuppliersAndCustomersLazyQuery>;
export type GetSuppliersAndCustomersQueryResult = Apollo.QueryResult<GetSuppliersAndCustomersQuery, GetSuppliersAndCustomersQueryVariables>;
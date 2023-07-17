import * as Types from '../../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetFinancesQueryVariables = Types.Exact<{
  nameOrEmail?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFinancesQuery = { __typename?: 'Query', finances: { __typename?: 'FinancesConnection', nodes: Array<{ __typename?: 'Finances', id: string, comments?: string | null, dueDate: any, issuedate: any, payDay?: any | null, paymentTerm: any, status: Types.FinaceStatusTypeEnum, value: number, createdAt?: any | null, updatedAt?: any | null, accountplan?: { __typename?: 'AccountPlan', id: string, accountPlanType: Types.AccountPlanTypeEnum, costType: Types.CostTypeEnum, name: string } | null, supplierAndCustomer?: { __typename?: 'SuppliersAndCustomer', id: string, name?: string | null, address: string, cpf: string, email?: string | null, phone: string } | null }>, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null } } };

export type GetFinancesForDarshboardQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.FinancesFilter>;
  sorting?: Types.InputMaybe<Array<Types.FinancesSort> | Types.FinancesSort>;
  paging?: Types.InputMaybe<Types.OffsetPaging>;
}>;


export type GetFinancesForDarshboardQuery = { __typename?: 'Query', finances: { __typename?: 'FinancesConnection', nodes: Array<{ __typename?: 'Finances', id: string, comments?: string | null, dueDate: any, issuedate: any, payDay?: any | null, paymentTerm: any, status: Types.FinaceStatusTypeEnum, value: number, createdAt?: any | null, updatedAt?: any | null, accountplan?: { __typename?: 'AccountPlan', id: string, accountPlanType: Types.AccountPlanTypeEnum, costType: Types.CostTypeEnum, name: string } | null, supplierAndCustomer?: { __typename?: 'SuppliersAndCustomer', id: string, name?: string | null, address: string, cpf: string, email?: string | null, phone: string } | null }> } };


export const GetFinancesDocument = gql`
    query getFinances($nameOrEmail: String, $limit: Int = 9999, $offset: Int) {
  finances(
    filter: {or: [{supplierAndCustomer: {name: {iLike: $nameOrEmail}}}, {supplierAndCustomer: {email: {iLike: $nameOrEmail}}}]}
    paging: {limit: $limit, offset: $offset}
    sorting: {field: dueDate, direction: DESC}
  ) {
    nodes {
      id
      comments
      dueDate
      issuedate
      payDay
      paymentTerm
      status
      value
      createdAt
      updatedAt
      accountplan {
        id
        accountPlanType
        costType
        name
      }
      supplierAndCustomer {
        id
        name
        address
        cpf
        email
        phone
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useGetFinancesQuery__
 *
 * To run a query within a React component, call `useGetFinancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFinancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFinancesQuery({
 *   variables: {
 *      nameOrEmail: // value for 'nameOrEmail'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetFinancesQuery(baseOptions?: Apollo.QueryHookOptions<GetFinancesQuery, GetFinancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFinancesQuery, GetFinancesQueryVariables>(GetFinancesDocument, options);
      }
export function useGetFinancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFinancesQuery, GetFinancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFinancesQuery, GetFinancesQueryVariables>(GetFinancesDocument, options);
        }
export type GetFinancesQueryHookResult = ReturnType<typeof useGetFinancesQuery>;
export type GetFinancesLazyQueryHookResult = ReturnType<typeof useGetFinancesLazyQuery>;
export type GetFinancesQueryResult = Apollo.QueryResult<GetFinancesQuery, GetFinancesQueryVariables>;
export const GetFinancesForDarshboardDocument = gql`
    query getFinancesForDarshboard($filter: FinancesFilter, $sorting: [FinancesSort!], $paging: OffsetPaging) {
  finances(filter: $filter, sorting: $sorting, paging: $paging) {
    nodes {
      id
      comments
      dueDate
      issuedate
      payDay
      paymentTerm
      status
      value
      createdAt
      updatedAt
      accountplan {
        id
        accountPlanType
        costType
        name
      }
      supplierAndCustomer {
        id
        name
        address
        cpf
        email
        phone
      }
    }
  }
}
    `;

/**
 * __useGetFinancesForDarshboardQuery__
 *
 * To run a query within a React component, call `useGetFinancesForDarshboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFinancesForDarshboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFinancesForDarshboardQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sorting: // value for 'sorting'
 *      paging: // value for 'paging'
 *   },
 * });
 */
export function useGetFinancesForDarshboardQuery(baseOptions?: Apollo.QueryHookOptions<GetFinancesForDarshboardQuery, GetFinancesForDarshboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFinancesForDarshboardQuery, GetFinancesForDarshboardQueryVariables>(GetFinancesForDarshboardDocument, options);
      }
export function useGetFinancesForDarshboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFinancesForDarshboardQuery, GetFinancesForDarshboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFinancesForDarshboardQuery, GetFinancesForDarshboardQueryVariables>(GetFinancesForDarshboardDocument, options);
        }
export type GetFinancesForDarshboardQueryHookResult = ReturnType<typeof useGetFinancesForDarshboardQuery>;
export type GetFinancesForDarshboardLazyQueryHookResult = ReturnType<typeof useGetFinancesForDarshboardLazyQuery>;
export type GetFinancesForDarshboardQueryResult = Apollo.QueryResult<GetFinancesForDarshboardQuery, GetFinancesForDarshboardQueryVariables>;
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getBaseUrl } from '@/utils/Env'

// Determine the GraphQL endpoint URL
const getGraphQLEndpoint = () => {
  if (typeof window === 'undefined') {
    return `${getBaseUrl()}/api/graphql`
  }
  return '/api/graphql'
}

// Create HTTP link
const createHttpLink = () =>
  new HttpLink({
    uri: getGraphQLEndpoint(),
    credentials: 'include', // send cookies if you need auth
  })

// Attach cookies for SSR requests
const authLink = setContext(async (_, { headers }) => {
  if (typeof window === 'undefined') {
    const { headers: nextHeaders } = await import('next/headers')
    const cookie = (await nextHeaders()).get('cookie') ?? ''
    return { headers: { ...headers, cookie } }
  }
  return { headers }
})

// Create a new Apollo Client instance (for server-side rendering)
export const createApolloClient = () =>
  new ApolloClient({
    link: authLink.concat(createHttpLink()),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  })

// Singleton for client-side only (safe because browser instances are per-tab)
let clientSideApolloClient: ApolloClient<any> | null = null

export const apolloClient =
  typeof window === 'undefined'
    ? createApolloClient() // Server-side: always create new instance
    : (clientSideApolloClient ??= createApolloClient()) // Client-side: reuse singleton

import { gql } from '@apollo/client'

import { apolloClient } from '@/libs/ApolloClient'

const GET_THEME = gql`
  query GetTheme {
    getTheme {
      colors {
        primary
        secondary
        accent
        background
        surface
      }
    }
  }
`

const UPDATE_THEME = gql`
  mutation UpdateTheme($colors: ThemeColorsInput!) {
    updateTheme(colors: $colors) {
      colors {
        primary
        secondary
        accent
        background
        surface
      }
    }
  }
`

export const themeApiClient = {
  async getTheme() {
    const { data } = await apolloClient.query({
      query: GET_THEME,
      fetchPolicy: 'network-only',
    })
    return data.getTheme
  },

  async updateTheme(colors: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
  }) {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_THEME,
      variables: { colors },
    })
    return data.updateTheme
  },
}

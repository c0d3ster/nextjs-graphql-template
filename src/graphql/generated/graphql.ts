
import { gql } from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ContactFormInput = {
  readonly email: Scalars['String']['input'];
  readonly message: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly subject: Scalars['String']['input'];
};

export type ContactFormSubmission = {
  readonly __typename?: 'ContactFormSubmission';
  readonly email: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly message: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
  readonly subject: Scalars['String']['output'];
  readonly submittedAt: Scalars['String']['output'];
};

export type CreateProjectInput = {
  readonly actualCompletionDate?: InputMaybe<Scalars['String']['input']>;
  readonly budget?: InputMaybe<Scalars['Float']['input']>;
  readonly description: Scalars['String']['input'];
  readonly estimatedCompletionDate?: InputMaybe<Scalars['String']['input']>;
  readonly progressPercentage?: InputMaybe<Scalars['Float']['input']>;
  readonly projectName: Scalars['String']['input'];
  readonly projectType: ProjectType;
  readonly requirements?: InputMaybe<Scalars['String']['input']>;
  readonly startDate?: InputMaybe<Scalars['String']['input']>;
  readonly status: ProjectStatus;
  readonly techStack?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectRequestInput = {
  readonly additionalInfo?: InputMaybe<Scalars['String']['input']>;
  readonly budget?: InputMaybe<Scalars['Float']['input']>;
  readonly contactPreference?: InputMaybe<Scalars['String']['input']>;
  readonly description: Scalars['String']['input'];
  readonly projectName: Scalars['String']['input'];
  readonly projectType: ProjectType;
  readonly requirements?: InputMaybe<Scalars['String']['input']>;
  readonly timeline?: InputMaybe<Scalars['String']['input']>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

/** Environment for file storage */
export enum Environment {
  Dev = 'DEV',
  Prod = 'PROD'
}

export type File = {
  readonly __typename?: 'File';
  readonly contentType: Scalars['String']['output'];
  readonly downloadUrl?: Maybe<Scalars['String']['output']>;
  readonly environment: Environment;
  readonly fileName: Scalars['String']['output'];
  readonly fileSize: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly key: Scalars['String']['output'];
  readonly originalFileName: Scalars['String']['output'];
  readonly project?: Maybe<Scalars['String']['output']>;
  readonly projectId?: Maybe<Scalars['ID']['output']>;
  readonly uploadedAt: Scalars['String']['output'];
  readonly uploadedBy?: Maybe<Scalars['String']['output']>;
  readonly uploadedById?: Maybe<Scalars['ID']['output']>;
};

export type FileFilterInput = {
  readonly contentType?: InputMaybe<Scalars['String']['input']>;
  readonly environment?: InputMaybe<Environment>;
  readonly projectId?: InputMaybe<Scalars['ID']['input']>;
  readonly userId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly approveProjectRequest: Scalars['String']['output'];
  readonly assignProject: Project;
  readonly createProject: Project;
  readonly createProjectRequest: ProjectRequest;
  readonly deleteFile: Scalars['Boolean']['output'];
  readonly rejectProjectRequest: Scalars['String']['output'];
  readonly submitContactForm: ContactFormSubmission;
  readonly updateProject: Project;
  readonly updateProjectRequest: ProjectRequest;
  readonly updateProjectRequestStatus: ProjectRequest;
  readonly updateProjectStatus: Project;
  readonly updateUser: User;
  readonly uploadProjectLogo: Scalars['String']['output'];
};


export type MutationApproveProjectRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignProjectArgs = {
  developerId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateProjectRequestArgs = {
  input: CreateProjectRequestInput;
};


export type MutationDeleteFileArgs = {
  key: Scalars['String']['input'];
};


export type MutationRejectProjectRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitContactFormArgs = {
  input: ContactFormInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdateProjectRequestArgs = {
  id: Scalars['ID']['input'];
  input: CreateProjectRequestInput;
};


export type MutationUpdateProjectRequestStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateProjectStatusArgs = {
  id: Scalars['ID']['input'];
  progressPercentage?: InputMaybe<Scalars['Float']['input']>;
  status: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUploadProjectLogoArgs = {
  contentType: Scalars['String']['input'];
  file: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
};

export type Project = {
  readonly __typename?: 'Project';
  readonly actualCompletionDate?: Maybe<Scalars['String']['output']>;
  readonly budget?: Maybe<Scalars['Float']['output']>;
  readonly client?: Maybe<User>;
  readonly clientId: Scalars['ID']['output'];
  readonly collaborators?: Maybe<ReadonlyArray<ProjectCollaborator>>;
  readonly createdAt: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  readonly developer?: Maybe<User>;
  readonly developerId?: Maybe<Scalars['ID']['output']>;
  readonly estimatedCompletionDate?: Maybe<Scalars['String']['output']>;
  readonly featured: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly liveUrl?: Maybe<Scalars['String']['output']>;
  readonly logo?: Maybe<Scalars['String']['output']>;
  readonly overview?: Maybe<Scalars['String']['output']>;
  readonly priority?: Maybe<ProjectPriority>;
  readonly progressPercentage?: Maybe<Scalars['Float']['output']>;
  readonly projectName: Scalars['String']['output'];
  readonly projectRequest?: Maybe<ProjectRequest>;
  readonly projectType: ProjectType;
  readonly repositoryUrl?: Maybe<Scalars['String']['output']>;
  readonly requestId?: Maybe<Scalars['ID']['output']>;
  readonly requirements?: Maybe<Scalars['String']['output']>;
  readonly stagingUrl?: Maybe<Scalars['String']['output']>;
  readonly startDate?: Maybe<Scalars['String']['output']>;
  readonly status: ProjectStatus;
  readonly statusUpdates?: Maybe<ReadonlyArray<StatusUpdate>>;
  readonly techStack?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly title?: Maybe<Scalars['String']['output']>;
  readonly updatedAt: Scalars['String']['output'];
};

export type ProjectCollaborator = {
  readonly __typename?: 'ProjectCollaborator';
  readonly id: Scalars['ID']['output'];
  readonly joinedAt: Scalars['String']['output'];
  readonly role: Scalars['String']['output'];
  readonly user?: Maybe<User>;
  readonly userId?: Maybe<Scalars['ID']['output']>;
};

export type ProjectFilter = {
  readonly clientId?: InputMaybe<Scalars['String']['input']>;
  readonly developerId?: InputMaybe<Scalars['String']['input']>;
  readonly priority?: InputMaybe<ProjectPriority>;
  readonly projectType?: InputMaybe<ProjectType>;
  readonly status?: InputMaybe<ProjectStatus>;
};

/** Priority level of a project */
export enum ProjectPriority {
  High = 'High',
  Low = 'Low',
  Medium = 'Medium',
  Urgent = 'Urgent'
}

export type ProjectRequest = {
  readonly __typename?: 'ProjectRequest';
  readonly additionalInfo?: Maybe<Scalars['String']['output']>;
  readonly budget?: Maybe<Scalars['Float']['output']>;
  readonly contactPreference?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly projectName: Scalars['String']['output'];
  readonly projectType: ProjectType;
  readonly requirements?: Maybe<Scalars['String']['output']>;
  readonly reviewer?: Maybe<User>;
  readonly reviewerId?: Maybe<Scalars['ID']['output']>;
  readonly status: ProjectStatus;
  readonly statusUpdates: ReadonlyArray<StatusUpdate>;
  readonly timeline?: Maybe<Scalars['String']['output']>;
  readonly title?: Maybe<Scalars['String']['output']>;
  readonly updatedAt: Scalars['String']['output'];
  readonly user?: Maybe<User>;
  readonly userId?: Maybe<Scalars['ID']['output']>;
};

export type ProjectRequestFilter = {
  readonly projectName?: InputMaybe<Scalars['String']['input']>;
  readonly projectType?: InputMaybe<ProjectType>;
  readonly reviewerId?: InputMaybe<Scalars['String']['input']>;
  readonly status?: InputMaybe<Scalars['String']['input']>;
  readonly userId?: InputMaybe<Scalars['String']['input']>;
};

/** Status of a project */
export enum ProjectStatus {
  Approved = 'Approved',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  InProgress = 'InProgress',
  InReview = 'InReview',
  InTesting = 'InTesting',
  ReadyForLaunch = 'ReadyForLaunch',
  Requested = 'Requested'
}

export type ProjectSummary = {
  readonly __typename?: 'ProjectSummary';
  readonly activeProjects: Scalars['Float']['output'];
  readonly completedProjects: Scalars['Float']['output'];
  readonly inReviewRequests: Scalars['Float']['output'];
  readonly pendingReviewRequests: Scalars['Float']['output'];
  readonly totalProjects: Scalars['Float']['output'];
  readonly totalRequests: Scalars['Float']['output'];
};

/** Type of project */
export enum ProjectType {
  Api = 'Api',
  Consultation = 'Consultation',
  ECommerce = 'ECommerce',
  Maintenance = 'Maintenance',
  MobileApp = 'MobileApp',
  Other = 'Other',
  WebApp = 'WebApp',
  Website = 'Website'
}

export type Query = {
  readonly __typename?: 'Query';
  readonly featuredProjects: ReadonlyArray<Project>;
  readonly file?: Maybe<File>;
  readonly files: ReadonlyArray<File>;
  readonly me?: Maybe<User>;
  readonly myDashboard: UserDashboard;
  readonly project?: Maybe<Project>;
  readonly projectBySlug?: Maybe<Project>;
  readonly projectFiles: ReadonlyArray<File>;
  readonly projectRequest?: Maybe<ProjectRequest>;
  readonly projectRequests: ReadonlyArray<ProjectRequest>;
  readonly projects: ReadonlyArray<Project>;
  readonly user?: Maybe<User>;
  readonly userFiles: ReadonlyArray<File>;
  readonly users: ReadonlyArray<User>;
};


export type QueryFeaturedProjectsArgs = {
  userEmail?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFileArgs = {
  key: Scalars['String']['input'];
};


export type QueryFilesArgs = {
  filter?: InputMaybe<FileFilterInput>;
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProjectFilesArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectRequestsArgs = {
  filter?: InputMaybe<ProjectRequestFilter>;
};


export type QueryProjectsArgs = {
  filter?: InputMaybe<ProjectFilter>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserFilesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilter>;
};

export type StatusUpdate = {
  readonly __typename?: 'StatusUpdate';
  readonly createdAt: Scalars['String']['output'];
  readonly entityId: Scalars['ID']['output'];
  readonly entityType: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isClientVisible: Scalars['Boolean']['output'];
  readonly newStatus: ProjectStatus;
  readonly oldStatus?: Maybe<ProjectStatus>;
  readonly progressPercentage?: Maybe<Scalars['Float']['output']>;
  readonly updateMessage: Scalars['String']['output'];
  readonly updatedBy: Scalars['ID']['output'];
  readonly updatedByUser?: Maybe<User>;
};

export type UpdateProjectInput = {
  readonly actualCompletionDate?: InputMaybe<Scalars['String']['input']>;
  readonly budget?: InputMaybe<Scalars['Float']['input']>;
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly estimatedCompletionDate?: InputMaybe<Scalars['String']['input']>;
  readonly featured?: InputMaybe<Scalars['Boolean']['input']>;
  readonly logo?: InputMaybe<Scalars['String']['input']>;
  readonly progressPercentage?: InputMaybe<Scalars['Float']['input']>;
  readonly projectName?: InputMaybe<Scalars['String']['input']>;
  readonly projectType?: InputMaybe<ProjectType>;
  readonly requirements?: InputMaybe<Scalars['String']['input']>;
  readonly startDate?: InputMaybe<Scalars['String']['input']>;
  readonly status?: InputMaybe<ProjectStatus>;
  readonly techStack?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  readonly availability?: InputMaybe<Scalars['String']['input']>;
  readonly avatarUrl?: InputMaybe<Scalars['String']['input']>;
  readonly bio?: InputMaybe<Scalars['String']['input']>;
  readonly firstName?: InputMaybe<Scalars['String']['input']>;
  readonly hourlyRate?: InputMaybe<Scalars['Float']['input']>;
  readonly lastName?: InputMaybe<Scalars['String']['input']>;
  readonly portfolio?: InputMaybe<Scalars['String']['input']>;
  readonly skills?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};

export type User = {
  readonly __typename?: 'User';
  readonly availability?: Maybe<Scalars['String']['output']>;
  readonly avatarUrl?: Maybe<Scalars['String']['output']>;
  readonly bio?: Maybe<Scalars['String']['output']>;
  readonly clerkId?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['String']['output']>;
  readonly email: Scalars['String']['output'];
  readonly firstName?: Maybe<Scalars['String']['output']>;
  readonly hourlyRate?: Maybe<Scalars['Float']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly lastName?: Maybe<Scalars['String']['output']>;
  readonly portfolio?: Maybe<Scalars['String']['output']>;
  readonly role?: Maybe<UserRole>;
  readonly skills?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly updatedAt?: Maybe<Scalars['String']['output']>;
};

export type UserDashboard = {
  readonly __typename?: 'UserDashboard';
  readonly assignedProjects: ReadonlyArray<Project>;
  readonly availableProjects: ReadonlyArray<Project>;
  readonly projectRequests: ReadonlyArray<ProjectRequest>;
  readonly projects: ReadonlyArray<Project>;
  readonly summary: ProjectSummary;
};

export type UserFilter = {
  readonly availability?: InputMaybe<Scalars['String']['input']>;
  readonly email?: InputMaybe<Scalars['String']['input']>;
  readonly firstName?: InputMaybe<Scalars['String']['input']>;
  readonly lastName?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<UserRole>;
};

/** User role in the system */
export enum UserRole {
  Admin = 'Admin',
  Client = 'Client',
  Developer = 'Developer',
  SuperAdmin = 'SuperAdmin'
}

export type SubmitContactFormMutationVariables = Exact<{
  input: ContactFormInput;
}>;


export type SubmitContactFormMutation = { readonly __typename?: 'Mutation', readonly submitContactForm: { readonly __typename?: 'ContactFormSubmission', readonly id: string, readonly name: string, readonly email: string, readonly subject: string, readonly message: string, readonly submittedAt: string } };

export type UserDisplayFragment = { readonly __typename?: 'User', readonly id: string, readonly firstName?: string | null, readonly lastName?: string | null, readonly email: string };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { readonly __typename?: 'Query', readonly me?: { readonly __typename?: 'User', readonly id: string, readonly clerkId?: string | null, readonly email: string, readonly firstName?: string | null, readonly lastName?: string | null, readonly role?: UserRole | null, readonly bio?: string | null, readonly skills?: ReadonlyArray<string> | null, readonly portfolio?: string | null, readonly hourlyRate?: number | null, readonly availability?: string | null, readonly avatarUrl?: string | null, readonly createdAt?: string | null, readonly updatedAt?: string | null } | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { readonly __typename?: 'Query', readonly user?: { readonly __typename?: 'User', readonly id: string, readonly clerkId?: string | null, readonly email: string, readonly firstName?: string | null, readonly lastName?: string | null, readonly role?: UserRole | null, readonly bio?: string | null, readonly skills?: ReadonlyArray<string> | null, readonly portfolio?: string | null, readonly hourlyRate?: number | null, readonly availability?: string | null, readonly avatarUrl?: string | null, readonly createdAt?: string | null, readonly updatedAt?: string | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { readonly __typename?: 'Mutation', readonly updateUser: { readonly __typename?: 'User', readonly id: string, readonly firstName?: string | null, readonly lastName?: string | null, readonly bio?: string | null, readonly skills?: ReadonlyArray<string> | null, readonly portfolio?: string | null, readonly hourlyRate?: number | null, readonly availability?: string | null, readonly updatedAt?: string | null } };

export const UserDisplayFragmentDoc = gql`
    fragment UserDisplay on User {
  id
  firstName
  lastName
  email
}
    `;
export const SubmitContactFormDocument = gql`
    mutation SubmitContactForm($input: ContactFormInput!) {
  submitContactForm(input: $input) {
    id
    name
    email
    subject
    message
    submittedAt
  }
}
    `;

/**
 * __useSubmitContactFormMutation__
 *
 * To run a mutation, you first call `useSubmitContactFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitContactFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitContactFormMutation, { data, loading, error }] = useSubmitContactFormMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitContactFormMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SubmitContactFormMutation, SubmitContactFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SubmitContactFormMutation, SubmitContactFormMutationVariables>(SubmitContactFormDocument, options);
      }
export type SubmitContactFormMutationHookResult = ReturnType<typeof useSubmitContactFormMutation>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    clerkId
    email
    firstName
    lastName
    role
    bio
    skills
    portfolio
    hourlyRate
    availability
    avatarUrl
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  user(id: $id) {
    id
    clerkId
    email
    firstName
    lastName
    role
    bio
    skills
    portfolio
    hourlyRate
    availability
    avatarUrl
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    bio
    skills
    portfolio
    hourlyRate
    availability
    updatedAt
  }
}
    `;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
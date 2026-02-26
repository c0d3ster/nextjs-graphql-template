import { Field, InputType, ObjectType } from 'type-graphql'

@InputType()
export class ContactFormInput {
  @Field()
  name!: string

  @Field()
  email!: string

  @Field()
  subject!: string

  @Field()
  message!: string
}

@ObjectType()
export class ContactSubmission {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field()
  email!: string

  @Field()
  subject!: string

  @Field()
  message!: string

  @Field()
  submittedAt!: string
}

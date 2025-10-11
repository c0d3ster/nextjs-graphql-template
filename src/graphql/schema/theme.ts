import { Field, InputType, ObjectType } from 'type-graphql'

/**
 * Theme color input for updating theme
 */
@InputType()
export class ThemeColorsInput {
  @Field({
    nullable: true,
    description: 'Primary brand color (RGB format: "59 130 246")',
  })
  primary?: string

  @Field({ nullable: true, description: 'Secondary brand color (RGB format)' })
  secondary?: string

  @Field({ nullable: true, description: 'Accent color (RGB format)' })
  accent?: string

  @Field({ nullable: true, description: 'Background color (RGB format)' })
  background?: string

  @Field({ nullable: true, description: 'Surface color (RGB format)' })
  surface?: string
}

/**
 * Theme colors object
 */
@ObjectType()
export class ThemeColors {
  @Field({ description: 'Primary brand color' })
  primary!: string

  @Field({ description: 'Secondary brand color' })
  secondary!: string

  @Field({ description: 'Accent color' })
  accent!: string

  @Field({ description: 'Background color' })
  background!: string

  @Field({ description: 'Surface color' })
  surface!: string
}

/**
 * Theme response type
 */
@ObjectType()
export class Theme {
  @Field(() => ThemeColors, { description: 'Theme color configuration' })
  colors!: ThemeColors

  @Field({ description: 'CSS string to inject for runtime theme changes' })
  css!: string
}

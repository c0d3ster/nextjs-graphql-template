'use client'

import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'

import Link from 'next/link'

type ButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  className?: string
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
} & Omit<ComponentPropsWithoutRef<'button'>, 'type'>

const baseStyles =
  'inline-block rounded border font-mono font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'

const buttonStyle =
  'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black'

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const Button = ({
  size = 'md',
  href,
  external = false,
  className = '',
  children,
  onClick,
  type = 'button',
  disabled = false,
  ref,
  ...props
}: ButtonProps) => {
  const buttonClasses = `${baseStyles} ${buttonStyle} ${sizes[size]} ${className}`

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={buttonClasses}
        >
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'

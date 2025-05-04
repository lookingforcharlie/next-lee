import type { ComponentPropsWithRef } from 'react'

//ComponentPropsWithRef<'button'> means: This component accepts exactly the same props as a normal <button> element—including all optional ones

export default function Button({
  onClick,
  children,
  type = 'button', // default value
  ...props
}: ComponentPropsWithRef<'button'>) {
  // const analytics = () => console.log('button clicked')
  return (
    // put ...props on top make user override the default props such as className
    <button
      {...props}
      type={type}
      onClick={onClick}
      // {props.className} can override the default className
      className={`border border-amber-300 bg-amber-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-amber-800 ${props.className}`}
    >
      {children}
    </button>
  )
}

// ComponentPropsWithRef is a type that takes a component and returns the props of the component

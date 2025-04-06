export default function NestedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <nav>
      <div className='flex flex-col gap-4'>{children}</div>
    </nav>
  )
}

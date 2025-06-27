export default function Layout({
  children,
  footer,
}: Readonly<{
  children: React.ReactNode;
  footer: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {footer}
    </>
  );
}

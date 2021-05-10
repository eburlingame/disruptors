import React, { ReactNode } from "react";

const Layout = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return <div>{children}</div>;
};

export default Layout;

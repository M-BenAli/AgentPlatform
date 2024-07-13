import React from "react";

type Props = {
  children: React.ReactNode;
};
const MaxWidthWrapper = ({ children }: Props) => {
  return <div className="container p-4 sm:p-6">{children}</div>;
};
export default MaxWidthWrapper;

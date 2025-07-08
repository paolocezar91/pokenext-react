import React from "react";

export default function Table({ headers, children }: {
  headers: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="sticky top-0 bg-background z-1">
          {headers}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  );
};


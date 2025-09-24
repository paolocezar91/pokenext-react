import React, { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

function LazyRow({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });
  return <tbody ref={ref}>{inView && children}</tbody>;
}

export default function Table({
  headers,
  children,
  className = "",
}: {
  headers: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={`w-full text-xs ${className}`}>
      <thead>
        <tr className="bg-black pt-1 sticky top-0 bg-background z-1">
          {headers}
        </tr>
      </thead>
      <LazyRow>{children}</LazyRow>
    </table>
  );
}

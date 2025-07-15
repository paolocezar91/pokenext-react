import React, { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

function LazyRow({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  return <tbody ref={ref}>
    {inView && children}
  </tbody>;
}

export default function Table({ headers, children }: {
  headers: ReactNode;
  children: ReactNode;
}) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="sticky top-0 bg-background z-1">
          {headers}
        </tr>
      </thead>
      <LazyRow>{children}</LazyRow>
    </table>
  );
};


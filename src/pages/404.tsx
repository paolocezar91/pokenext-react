'use client';

import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [seconds, setSeconds] = useState<number>(3);
  const router = useRouter();

  const goTo = () => {
    router.push('/');
  };

  useEffect(() => {
    const startTimer = (duration: number) => {
      let timer = duration;
      const interval = setInterval(() => {
        setSeconds(timer % 60);

        if (--timer < 0) {
          clearInterval(interval);
          goTo();
        }
      }, 1000);
    };
    console.log('timer');
    startTimer(3);
  }, []);

  const title = '404 - Page Not Found';

  return (
    <RootLayout title={title}>
      <div>
        <h1>{title}</h1>
        <p>You will be redirected in {seconds} seconds</p>
      </div>
    </RootLayout>
  );
}
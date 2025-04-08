'use client';

import RootLayout from "@/app/layout";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  let seconds = 3;

  function startTimer(duration: number) {
    let timer = duration;
    setInterval(function () {
      seconds = timer % 60;

      if (--timer < 0) {
        router.push('/');
      }
    }, 1000);
  }

  startTimer(3);

  const title = '404 - Page Not Found';

  return (
    <RootLayout title={title}>
      <div>
        <h1>{title}</h1>
        <p>You will be redirected in {seconds}</p>
      </div>
    </RootLayout>
  );
}
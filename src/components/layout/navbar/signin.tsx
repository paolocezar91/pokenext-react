import React from "react";
import { signIn } from "next-auth/react";

function SignInForm() {
  return (
    <form
      action={async () => {
        await signIn("github");
      }}
    >
      <button className="
        cursor-pointer
        w-full
        text-xs
        text-white
        rounded
        px-2
        py-1
        placeholder-gray-500
        border-solid
        border-2
        border-black
        bg-blue-400"
      type="submit">Sign in with GitHub</button>
    </form>
  );
}

// function SignOut({ children }: { children: React.ReactNode }) {
//   return (
//     <form
//       action={async () => {
//         "use server";
//         await signOut();
//       }}
//     >
//       <p>{children}</p>
//       <button type="submit">Sign out</button>
//     </form>
//   );
// }


export default function SignIn() {

  return (
    <div className="flex items-center justify-center">
      <div
        className="bg-(--pokedex-red) p-4 rounded shadow-md w-full max-w-sm border-2 border-solid border-background"
      >
        <SignInForm />
      </div>

    </div>
  );
};
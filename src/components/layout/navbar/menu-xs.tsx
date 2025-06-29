import { ReactNode } from "react";
import NavUserAuth from "./nav-user-auth/nav-user-auth";
import Search from "./search";

export default function MenuXs({}: { children?: ReactNode }) {
  return (
    <div
      className={`md:hidden flex`}
      id="navbar-multi-level"
    >
      <Search className="mr-4"/>
      <NavUserAuth />
    </div>
  );
};
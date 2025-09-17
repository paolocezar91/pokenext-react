import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ReactNode, useState } from "react";
import NavButton from "./nav-button";
import NavUserAuth from "./nav-user-auth/nav-user-auth";
import Search from "./search";

export default function MenuXs({ children }: { children?: ReactNode }) {
  const [openSearch, setOpenSearch] = useState(false);
  return (
    <>
      <div className={`md:hidden flex`} id="navbar-multi-level">
        <NavButton
          isActive={openSearch}
          onClick={() => setOpenSearch(!openSearch)}
        >
          <MagnifyingGlassIcon className="w-6" />
        </NavButton>
        <div className="mr-2">{children}</div>
        <NavUserAuth />
      </div>
      {openSearch && (
        <div className="bg-gray-700 mt-4 w-full">
          <Search className="w-full" />
        </div>
      )}
    </>
  );
}

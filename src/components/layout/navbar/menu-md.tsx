// components/MobileMenu.tsx
import NavUserAuth from "./nav-user-auth/nav-user-auth";
import Search from "./search";

export default function MenuMd() {
  return (
    <div className="hidden w-full md:block md:w-auto" >
      <ul className="
          flex
          flex-col
          items-center
          p-4
          mt-4
          border
          border-gray-700
          rounded
          rtl:space-x-reverse
          md:p-0
          md:space-x-4
          md:flex-row
          md:mt-0
          md:border-0
          md:bg-(--pokedex-red)
        ">
        <li className="h-10">
          <div className="go-to rounded">
            <Search />
          </div>
        </li>
        <li className="h-10">
          <NavUserAuth />
        </li>
      </ul>
    </div>
  );
};
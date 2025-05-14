import NavbarClient from "./Component.client";
//import { getUser } from "/lib/dal";

const Navbar = async () => {
  //const user = await getUser();
  const user = {
    username: "marshmallow",
    email: "breezy@gmail.com",
  };
  return <NavbarClient user={user} />;
};

export default Navbar;

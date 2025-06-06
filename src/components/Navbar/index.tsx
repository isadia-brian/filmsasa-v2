import NavbarClient from "./Component.client";
import { getUser } from "@/lib/dal";

const Navbar = async () => {
  const user = await getUser();

  return <NavbarClient user={user} />;
};

export default Navbar;

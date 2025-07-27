import { AuthButton } from "./auth-button";
import { HeaderClient } from "./header-client";

export async function Header() {
  return <HeaderClient authButton={<AuthButton />} />;
}
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { BetlinkLogo } from "@/components/betlink-logo";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col w-full">
      <div className="p-6 md:p-10">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BetlinkLogo />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

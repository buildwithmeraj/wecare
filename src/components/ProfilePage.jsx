import Link from "next/link";
import { PiListHeartFill } from "react-icons/pi";
import LogoutButton from "./auth/LogoutButton";

export default async function ProfilePage() {
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="w-full max-w-sm bg-base-100 border border-base-300 rounded-2xl shadow-md p-6 text-center">
        <h1 className="mb-4">Profile</h1>

        <LogoutButton className="btn btn-error" />
      </div>
    </div>
  );
}

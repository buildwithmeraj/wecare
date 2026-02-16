import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const logout = () => {
  toast.success("Logged out successfully");
  signOut();
};

export default logout;

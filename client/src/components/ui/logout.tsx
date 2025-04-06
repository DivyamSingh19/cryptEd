"use client";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/login"); // or wherever your login page is
  };

  return (
    <Button
      onClick={handleLogout}
      className="text-white bg-red-500 hover:bg-red-600"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

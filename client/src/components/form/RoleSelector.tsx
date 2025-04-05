import React from "react";
import { UserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircleIcon,
  ShieldCheck,
  GraduationCap,
  BookOpenCheckIcon,
} from "lucide-react";
import { Label } from "../ui/label";

interface RoleSelectorProps {
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  setSelectedRole,
}) => {
  const roleIcons = {
    [UserRole.STUDENT]: <GraduationCap className="h-5 w-5" />,
    [UserRole.PROFESSOR]: <BookOpenCheckIcon className="h-5 w-5" />,
    [UserRole.COLLEGE_ADMIN]: <ShieldCheck className="h-5 w-5" />,
  };

  return (
    <>
      <Label>Select your role:</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.values(UserRole).map((role) => (
          <div
            key={role}
            onClick={() => setSelectedRole(role as UserRole)}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all
              ${
                selectedRole === role
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            {selectedRole === role && (
              <div className="absolute top-2 right-2 text-primary">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedRole === role
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {roleIcons[role]}
              </div>
              <span
                className={`font-medium text-sm capitalize ${
                  selectedRole === role ? "text-green-600" : ""
                }`}
              >
                {role.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoleSelector;

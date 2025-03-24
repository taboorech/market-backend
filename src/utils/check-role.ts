import { CustomError } from "../libs/classes/custom-error.class";
import { UserRole } from "../libs/enum/user-role.enum";

interface AssertUserAccessOptions {
  user: { id: number; role: UserRole } | null | undefined;
  ownerId?: number;
  allowedRoles?: UserRole[];
  message?: string;
}

export const assertUserAccess = ({
  user,
  ownerId,
  allowedRoles = [],
  message = "Access denied",
}: AssertUserAccessOptions): void => {
  if (!user) {
    throw new CustomError(401, "Unauthorized");
  }

  const isOwner = ownerId !== undefined && user.id === ownerId;
  const hasRole = allowedRoles.includes(user.role);

  if (!isOwner && !hasRole) {
    throw new CustomError(403, message);
  }
};

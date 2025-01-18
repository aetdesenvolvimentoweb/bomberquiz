import {
  UpdateUserPasswordProps,
  UpdateUserRoleProps,
  UserProfile,
  UserProps,
} from "../../entities";

export type UserValidatorUseCase = {
  validatesCreation: (userProps: UserProps) => Promise<void>;
  validatesId: (id: string) => Promise<void>;
  validatesUpdatePassword: (
    updateUserPasswordProps: UpdateUserPasswordProps
  ) => Promise<void>;
  validatesUpdateProfile: (userProfile: UserProfile) => Promise<void>;
  validatesUpdateRole: (
    updateUserRoleProps: UpdateUserRoleProps
  ) => Promise<void>;
};

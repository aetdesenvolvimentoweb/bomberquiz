import { UpdateUserPasswordProps } from "../../entities";

export type UpdateUserPasswordUseCase = {
  updatePassword: (props: {
    id: string;
    props: UpdateUserPasswordProps;
  }) => Promise<void>;
};

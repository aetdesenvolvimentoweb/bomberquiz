import { UpdateUserPasswordProps } from "../../../entities";

export type UpdatePasswordPropsValidatorUseCase = {
  validateUpdatePasswordProps: (props: {
    id: string;
    props: UpdateUserPasswordProps;
  }) => Promise<void>;
};

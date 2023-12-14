type ParamTypes = {
  data: any;
  makeValidation: () => Promise<void>;
};

export interface DuplicatedKeyValidation {
  checkDuplicatedKey: (params: ParamTypes) => Promise<boolean>;
}

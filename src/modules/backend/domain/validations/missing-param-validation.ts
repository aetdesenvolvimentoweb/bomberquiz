export interface MissingParamValidation {
  checkMissingParams: (data: any) => Promise<void>;
}

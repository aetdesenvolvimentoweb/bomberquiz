export interface ValidKeyValidation {
  checkIsValidKey: (key: any) => Promise<void>;
}

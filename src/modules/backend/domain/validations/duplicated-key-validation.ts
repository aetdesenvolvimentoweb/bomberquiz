export interface DuplicatedKeyValidation {
  checkDuplicatedKey: (key: any) => Promise<void>;
}

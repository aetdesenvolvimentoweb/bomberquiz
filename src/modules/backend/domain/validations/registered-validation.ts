export interface RegisteredValidation {
  isRegistered: (id: string) => Promise<boolean>;
}

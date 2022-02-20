export type FirstPasswordRequest = {
  /** The user email. */
  email: string;
  /** The user first password. */
  password: string;
  /** The confirmationCode send by aws. */
  confirmationCode: string;
};

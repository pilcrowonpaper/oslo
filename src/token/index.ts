import { expirationDate, isWithinExpirationDate } from "../index.js";
import type { TimeSpan } from "../index.js";

export interface VerificationToken {
  value: string;
  expiresAt: Date;
  userId: string;
}

export class VerificationTokenController {
  constructor(expiresIn: TimeSpan) {
    this.expiresIn = expiresIn;
  }
  public expiresIn: TimeSpan;

  public isReusableToken(expiresAt: Date): boolean {
    const activePeriodExpirationDate = new Date(
      expiresAt.getTime() - this.expiresIn.milliseconds() / 2
    );
    return isWithinExpirationDate(activePeriodExpirationDate);
  }

  public createToken(value: string, userId: string): VerificationToken {
    return {
      value,
      userId,
      expiresAt: expirationDate(this.expiresIn),
    };
  }
}

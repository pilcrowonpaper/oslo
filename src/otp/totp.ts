import { TimeSpan } from "../index.js";
import { generateHOTP } from "./hotp.js";

export class TOTPController {
	private digits: number;
	private period: TimeSpan;

	constructor(options?: { digits?: number; period?: TimeSpan }) {
		this.digits = options?.digits ?? 6;
		this.period = options?.period ?? new TimeSpan(30, "s");
	}

	public async generate(secret: string | ArrayBufferLike): Promise<string> {
		const counter = Math.floor(Date.now() / this.period.milliseconds());
		return await generateHOTP({
			secret,
			counter,
			digits: this.digits
		});
	}

	public async verify(
		totp: string,
		secret: string | ArrayBufferLike
	): Promise<boolean> {
		const expectedTOTP = await this.generate(secret);
		return totp === expectedTOTP;
	}
}

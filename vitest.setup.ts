// making sure Date.now() returns the same time for easier testing

const now = new Date();

class StaticDate extends Date {
	constructor(value?: any) {
		if (value === undefined) {
			super(now);
		} else {
			super(value);
		}
	}
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.Date = StaticDate;

globalThis.Date.now = (): number => now.getTime();

export class UnixTime {

    static now(): number {
        return Math.floor(Date.now() / 1000);
    }

    static minutes(amount: number): number {
        return amount * 60;
    }

    static hours(amount: number): number {
        return amount * this.minutes(60);
    }

    static days(amount: number): number {
        return amount * this.hours(24);
    }
}

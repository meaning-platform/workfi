import { expect } from "chai";
import { UnixTime } from "../scripts/time";
import { deployWithoutArguments } from "../scripts/utils";
import { DeadlineUtils, MathUtils } from "../typechain-types";

describe("DeadlineUtils", function () {

    it('returns the correct value when calling getDaysBeforeDate', async () => {
        const deadlineUtils = await deployDeadlineUtils();
        const today = UnixTime.now();
        const expectedDays = 30;
        const futureDate = today + UnixTime.days(expectedDays);

        expect(await deadlineUtils.getDaysBeforeDate(today, futureDate)).to.eq(expectedDays);
    });

    it('returns the correct value when calling getInvestmentOpportunityDeadline', async () => {
        const deadlineUtils = await deployDeadlineUtils();
        const workerDeadlineDuration = UnixTime.days(30);
        const bountyCreationDate = UnixTime.now();
        const workerDeadline = bountyCreationDate + workerDeadlineDuration;
        const investmentOpportunityPercentage = 30_00; // 30%
        const investmentOpportunityDuration = workerDeadlineDuration + (workerDeadlineDuration * investmentOpportunityPercentage) / 10000;
        const expectedDeadline = bountyCreationDate + investmentOpportunityDuration;
        
        expect(await deadlineUtils.getInvestmentOpportunityDeadline(
            bountyCreationDate,
            workerDeadline,
            investmentOpportunityPercentage)
        ).to.eq(expectedDeadline);
    });

    it('returns the correct value when calling getDaysBeforeInvestmentOpportunityDeadline', async () => {
        const deadlineUtils = await deployDeadlineUtils();
        const workerDeadlineDuration = UnixTime.days(30);
        const now = UnixTime.now();
        const bountyCreationDate = now;
        const workerDeadline = bountyCreationDate + workerDeadlineDuration;
        const investmentOpportunityPercentage = 30_00; // 30%
        const investmentOpportunityDuration = workerDeadlineDuration + (workerDeadlineDuration * investmentOpportunityPercentage) / 10000;
        const expectedDays = investmentOpportunityDuration / UnixTime.days(1);

        expect(await deadlineUtils.getDaysBeforeInvestmentOpportunityDeadline(
            bountyCreationDate,
            now,
            workerDeadline,
            investmentOpportunityPercentage)
        ).to.eq(expectedDays);
    });
});

async function deployDeadlineUtils(): Promise<DeadlineUtils> {
    const mathUtils = await deployWithoutArguments<MathUtils>('MathUtils');
    return deployWithoutArguments<DeadlineUtils>('DeadlineUtils', { MathUtils: mathUtils.address });
}
// support/custom-matchers.ts
import { expect as baseExpect } from '@playwright/test';
import { UnrealLocator } from '../engine/unreal-locator';

export const expect = baseExpect.extend({

    async toHaveGasAttribute(
        locator: UnrealLocator, // <-- Now accepts ANY game object!
        setName: string,
        propertyName: string,
        expectedValue: number,
        options = { timeout: 5000 }
    ) {
        const startTime = Date.now();
        let currentValue = -1;

        // Polling Loop: Keep asking Unreal until time runs out
        while (Date.now() - startTime < options.timeout) {

            // Call the generalized method on the base locator
            currentValue = await locator.getGasAttribute(setName, propertyName);

            // If we match the expected value, the test passes immediately!
            if (currentValue === expectedValue) {
                return {
                    pass: true,
                    message: () => `Expected ${setName}.${propertyName} not to be ${expectedValue}`,
                };
            }

            // Wait 100ms before polling again (simulating game ticks)
            await new Promise(r => setTimeout(r, 100));
        }

        // If the loop finishes without returning true, it's a timeout/failure.
        return {
            pass: false,
            message: () => `Timed out waiting for ${setName}.${propertyName} to be ${expectedValue}. Last recorded value was ${currentValue}.`,
        };
    }
});
// support/custom-matchers.ts
import { expect as baseExpect } from '@playwright/test';
import { UnrealLocator } from '../engine/unreal-locator';
import { calculateDistance, Vector3D } from './math';

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
    },

    async toHaveActiveEffect(
        locator: UnrealLocator,
        effectBlueprintPath: string,
        options = { timeout: 5000 }
    ) {
        const startTime = Date.now();
        let hasEffect = false;

        // Polling Loop
        while (Date.now() - startTime < options.timeout) {
            hasEffect = await locator.hasActiveEffect(effectBlueprintPath);

            // If the current state matches what the user is expecting, break the loop early!
            // (If isNot is true, we want hasEffect to be false. If isNot is false, we want hasEffect to be true).
            if (hasEffect !== this.isNot) {
                break;
            }

            await new Promise(r => setTimeout(r, 100)); // Tick wait
        }

        // Playwright standard: 'pass' should reflect the positive statement. 
        // Playwright will automatically invert it if the user called .not
        return {
            pass: hasEffect,
            message: () => `Timed out waiting for actor to ${this.isNot ? 'lose' : 'gain'} effect: ${effectBlueprintPath}`,
        };
    },
    async toHaveGameplayTag(
        locator: UnrealLocator,
        tag: string,
        options = { timeout: 5000 }
    ) {
        const startTime = Date.now();
        let hasTag = false;

        // Polling Loop
        while (Date.now() - startTime < options.timeout) {
            hasTag = await locator.hasGameplayTag(tag);

            // Break early if the current state matches the expected state (handling .not)
            if (hasTag !== this.isNot) {
                break;
            }
        }
        return {
            pass: hasTag,
            message: () => `Timed out waiting for actor to ${this.isNot ? 'lose' : 'gain'} gameplay tag: ${tag}`,
        }
    },

    async toBeVisibleOnScreen(
        locator: UnrealLocator,
        options = { timeout: 5000 }
    ) {
        const startTime = Date.now();
        let isVisible = false;

        // Polling Loop
        while (Date.now() - startTime < options.timeout) {
            isVisible = await locator.isVisibleOnScreen();

            // Break early if the state matches what we expect
            if (isVisible !== this.isNot) {
                break;
            }

            await new Promise(r => setTimeout(r, 100)); // Tick wait
        }

        return {
            pass: isVisible,
            message: () => `Timed out waiting for actor to ${this.isNot ? 'disappear from' : 'appear on'} the screen.`,
        };
    },
    async toHaveMovedFurtherThan(
        locator: UnrealLocator,
        startLocation: Vector3D,
        minDistance: number,
        options = { timeout: 5000 } // Default to 5 seconds
    ) {
        const startTime = Date.now();
        let passed = false;
        let distanceTraveled = 0;

        // Polling Loop: Keep checking the distance until time runs out
        while (Date.now() - startTime < options.timeout) {
            const currentLocation = await locator.getLocation();

            distanceTraveled = calculateDistance(startLocation, currentLocation);
            passed = distanceTraveled > minDistance;

            // Break early if we hit our expected state (respecting Playwright's .not modifier)
            if (passed !== this.isNot) {
                break;
            }

            // Wait 100ms before asking the engine again
            await new Promise(r => setTimeout(r, 100));
        }

        return {
            pass: passed,
            message: () => `Expected actor to have moved further than ${minDistance} units from start, but it only moved ${distanceTraveled.toFixed(2)} units (Timeout: ${options.timeout}ms).`,
        };
    }
});
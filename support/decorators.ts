// support/decorators.ts
import { test } from '@playwright/test';

/**
 * Wraps a method in a Playwright test.step. 
 * Supports dynamic argument injection using {0}, {1}, etc.
 * Uses TS 5.0 Standard Decorators.
 */
export function step(stepName?: string) {
    // 1. New signature: receives the method itself, and a context object
    return function (originalMethod: any, context: ClassMethodDecoratorContext) {

        // context.name holds the name of the function (e.g., 'tapInput')
        const methodName = String(context.name);

        // 2. We return a replacement function
        return async function (this: any, ...args: any[]) {

            let formattedName = stepName || methodName;

            // 3. Replace placeholders like {0} with the actual arguments
            if (stepName && args.length > 0) {
                args.forEach((arg, index) => {
                    const argString = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                    formattedName = formattedName.replace(`{${index}}`, argString);
                });
            }

            // 4. Execute inside Playwright's step wrapper
            return await test.step(formattedName, async () => {
                return await originalMethod.apply(this, args);
            });
        };
    };
}
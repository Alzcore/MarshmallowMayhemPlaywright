/**
 * Executes a callback repeatedly until it returns a truthy value or times out.
 */
export async function waitForCondition<T>(
    action: () => Promise<T | null | undefined>,
    options: { timeout?: number; interval?: number; message?: string } = {}
): Promise<T> {
    const timeout = options.timeout ?? 5000;
    const interval = options.interval ?? 250;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            const result = await action();
            // If the action returned something truthy (not null, undefined, or false)
            if (result) {
                return result;
            }
        } catch (e) {
            // Ignore errors during polling (e.g., actor doesn't exist yet)
        }

        // Wait for the next tick
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Timeout after ${timeout}ms: ${options.message || 'Condition not met'}`);
}
// engine/unreal-locator.ts
import { UnrealRCClient } from './unreal-rc-client';

export class UnrealLocator {
    protected helperLibraryPath = '/Script/MarshmallowMayhem.Default__PlaywrightHelperLibrary';
    constructor(
        protected client: UnrealRCClient,
        public readonly objectPaths: string[],
        private queryDescription: string // Useful for error messages
    ) { }

    /**
     * PLAYWRIGHT STRUCTURAL METHODS
     */

    // Returns an array of strict locators (one for each actor found)
    async all(): Promise<UnrealLocator[]> {
        return this.objectPaths.map(
            path => new UnrealLocator(this.client, [path], this.queryDescription)
        );
    }

    // Returns a locator pointing to only the first actor
    first(): this { // <-- Notice it returns 'this'
        if (this.objectPaths.length === 0) throw new Error(`No actors found for ${this.queryDescription}`);

        // Dynamically spawn the exact same class (e.g., MMCharacter)
        return new (this.constructor as any)(this.client, [this.objectPaths[0]], this.queryDescription);
    }

    // Returns a locator pointing to a specific index
    nth(index: number): UnrealLocator {
        if (index < 0 || index >= this.objectPaths.length) {
            throw new Error(`Index ${index} out of bounds for ${this.queryDescription}`);
        }
        return new UnrealLocator(this.client, [this.objectPaths[index]], this.queryDescription);
    }

    /**
     * THE STRICT MODE GATEKEEPER
     */
    protected getStrictPath(): string {
        if (this.objectPaths.length === 0) {
            throw new Error(`Locator failed: No actors found for [${this.queryDescription}]`);
        }
        if (this.objectPaths.length > 1) {
            throw new Error(`Strict mode violation: Locator resolved to ${this.objectPaths.length} actors for [${this.queryDescription}]. Use .first(), .nth(), or .all() before interacting.`);
        }
        return this.objectPaths[0]; // Safe to use, exactly 1 actor exists
    }

    /**
     * ACTIONS (Now using getStrictPath)
     */
    async getLocation(): Promise<{ X: number; Y: number; Z: number }> {
        // If there are multiple actors and you didn't use .first() or .nth(), this will throw!
        const targetPath = this.getStrictPath();
        return await this.client.callFunction(targetPath, 'K2_GetActorLocation');
    }

    /**
    * Retrieves the current value of a GAS Attribute for this specific locator
    */
    async getGasAttribute(setName: string, propertyName: string): Promise<number> {
        const value = await this.client.callFunction(this.helperLibraryPath, 'GetActorGasAttribute', {
            ActorPath: this.getStrictPath(), // Send this actor's path to the Helper Library!
            AttributeSetName: setName,
            PropertyName: propertyName
        });

        return value;
    }
}
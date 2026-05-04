import { waitForCondition } from '../support/polling';
import { UnrealRCClient } from './unreal-rc-client';
import { step } from '../support/decorators';

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

    /**
   * Pauses test execution until a GAS attribute matches the expected value.
   */
    @step('Wait For Attribute: {0}.{1} == {2}')
    async waitForGasAttribute(
        setName: string,
        propertyName: string,
        expectedValue: number,
        options?: { timeout?: number }
    ): Promise<void> {

        await waitForCondition(async () => {
            const currentValue = await this.getGasAttribute(setName, propertyName);
            return currentValue === expectedValue;
        }, {
            timeout: options?.timeout || 5000,
            message: `Expected ${propertyName} to be ${expectedValue}`
        });
    }

    /**
   * Instantly applies a Gameplay Effect to this actor.
   * @param blueprintPath The path to the GE (e.g., /Game/Abilities/Effects/GE_Poison.GE_Poison_C)
   * @param level The level of the effect to apply (defaults to 1.0)
   */
    @step('Apply Effect: {0} (Level {1})')
    async applyEffect(blueprintPath: string, level: number = 1.0): Promise<void> {
        const success = await this.client.callFunction(this.helperLibraryPath, 'ApplyGameplayEffectToActor', {
            ActorPath: this.getStrictPath(),
            EffectClassPath: blueprintPath,
            Level: level
        });

        if (!success) {
            throw new Error(`Failed to apply Gameplay Effect: ${blueprintPath} to ${this.queryDescription}`);
        }
    }

    /**
   * Checks if a specific Gameplay Effect is currently active on this actor.
   */
    @step('Check Active Effect: {0}')
    async hasActiveEffect(blueprintPath: string): Promise<boolean> {
        const isActive = await this.client.callFunction(this.helperLibraryPath, 'HasActiveGameplayEffect', {
            ActorPath: this.getStrictPath(),
            EffectClassPath: blueprintPath
        });

        return isActive;
    }

    /**
   * Queries the actor's Ability System Component for a specific Gameplay Tag.
   */
    @step('Check Gameplay Tag: {0}')
    async hasGameplayTag(tag: string): Promise<boolean> {
        const hasTag = await this.client.callFunction(this.helperLibraryPath, 'HasGameplayTag', {
            ActorPath: this.getStrictPath(),
            TagString: tag
        });

        return hasTag;
    }
    /**
   * Calculates if this actor's center point is currently inside the player's camera frustum.
   */
    @step('Check Visibility')
    async isVisibleOnScreen(): Promise<boolean> {
        const isVisible = await this.client.callFunction(this.helperLibraryPath, 'IsActorOnScreen', {
            ActorPath: this.getStrictPath()
        });

        return isVisible;
    }
}
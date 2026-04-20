import { UnrealRCClient } from './unreal-rc-client';
import { UnrealLocator } from './unreal-locator';

export type LocatorConstructor<T extends UnrealLocator> = new (
    client: UnrealRCClient,
    objectPaths: string[],
    description: string
) => T;

export class UnrealWorld {
    private helperPath = '/Script/MarshmallowMayhem.Default__PlaywrightHelperLibrary';

    constructor(public client: UnrealRCClient) { }

    /**
     * OVERLOAD 1: Passing a Class (Returns the specific Game Object)
     */
    async getByActor<T extends UnrealLocator>(
        LocatorClass: LocatorConstructor<T>,
        options?: { tag?: string; overrideClassName?: string }
    ): Promise<T>;

    /**
     * OVERLOAD 2: Passing a String (Returns a base UnrealLocator)
     */
    async getByActor(
        className: string,
        options?: { tag?: string }
    ): Promise<UnrealLocator>;

    /**
     * THE IMPLEMENTATION
     */
    async getByActor(
        classOrString: any,
        options?: { tag?: string; overrideClassName?: string }
    ): Promise<any> {

        // Determine if the user passed 'MMCharacter' or the MMCharacter class
        const isString = typeof classOrString === 'string';
        const targetClass = isString ? classOrString : (options?.overrideClassName || classOrString.name);

        // Call Unreal
        const paths: string[] = await this.client.callFunction(
            this.helperPath,
            'FindLocatorsByClass',
            {
                ClassNameTarget: targetClass,
                OptionalTag: options?.tag || ""
            }
        );

        const description = `Class: ${targetClass}, Tag: ${options?.tag || 'none'}`;

        // Return the appropriate locator type
        if (isString) {
            return new UnrealLocator(this.client, paths || [], description);
        } else {
            return new classOrString(this.client, paths || [], description);
        }
    }
}
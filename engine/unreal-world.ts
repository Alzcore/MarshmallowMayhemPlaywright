import { UnrealRCClient } from './unreal-rc-client';
import { UnrealLocator } from './unreal-locator';
import { step } from '../support/decorators';

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

    async spawnActor<T extends UnrealLocator>(
        LocatorClass: LocatorConstructor<T>,
        blueprintPath: string,
        location?: { X: number, Y: number, Z: number },
        rotation?: { Pitch: number, Yaw: number, Roll: number },
        options?: { tag?: string } // <-- Add options here
    ): Promise<T>;

    /** OVERLOAD 2: Passing a String */
    async spawnActor(
        className: string,
        blueprintPath: string,
        location?: { X: number, Y: number, Z: number },
        rotation?: { Pitch: number, Yaw: number, Roll: number },
        options?: { tag?: string } // <-- Add options here
    ): Promise<UnrealLocator>;

    /** THE IMPLEMENTATION */
    @step('Spawn Actor: {1}')
    async spawnActor(
        classOrString: any,
        blueprintPath: string,
        location = { X: 0, Y: 0, Z: 0 },
        rotation = { Pitch: 0, Yaw: 0, Roll: 0 },
        options?: { tag?: string }
    ): Promise<any> {

        // Pass the tag to C++ (default to empty string if undefined)
        const actorPath: string = await this.client.callFunction(
            this.helperPath,
            'SpawnActorInWorld',
            {
                ClassPath: blueprintPath,
                Location: location,
                Rotation: rotation,
                OptionalTag: options?.tag || ""
            }
        );

        if (actorPath.includes("Error")) {
            throw new Error(`Failed to spawn actor: ${actorPath}`);
        }

        const description = `Spawned: ${blueprintPath} | Tag: ${options?.tag || 'none'}`;

        if (typeof classOrString === 'string') {
            return new UnrealLocator(this.client, [actorPath], description);
        } else {
            return new classOrString(this.client, [actorPath], description);
        }
    }
}
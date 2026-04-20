// game-objects/characters/mm-character.ts
import { UnrealLocator } from '../../engine/unreal-locator';

export class MMCharacter extends UnrealLocator {

    async pressInput(tag: string): Promise<void> {
        await this.client.callFunction(this.helperLibraryPath, 'TriggerGasInputOnActor', {
            ActorPath: this.getStrictPath(),
            TagString: tag,
            bIsPressed: true // Press
        });
    }

    async releaseInput(tag: string): Promise<void> {
        await this.client.callFunction(this.helperLibraryPath, 'TriggerGasInputOnActor', {
            ActorPath: this.getStrictPath(),
            TagString: tag,
            bIsPressed: false // Release
        });
    }

    async tapInput(tag: string, durationMs: number = 100): Promise<void> {
        await this.pressInput(tag);
        await new Promise(resolve => setTimeout(resolve, durationMs));
        await this.releaseInput(tag);
    }

}
// game-objects/characters/mm-character.ts
import { UnrealLocator } from '../../engine/unreal-locator';
import { step } from '../../support/decorators';

export class MMCharacter extends UnrealLocator {

    @step('Action: Press [{0}]')
    async pressInput(tag: string): Promise<void> {
        await this.client.callFunction(this.helperLibraryPath, 'TriggerGasInputOnActor', {
            ActorPath: this.getStrictPath(),
            TagString: tag,
            bIsPressed: true // Press
        });
    }

    @step('Action: Release [{0}]')
    async releaseInput(tag: string): Promise<void> {
        await this.client.callFunction(this.helperLibraryPath, 'TriggerGasInputOnActor', {
            ActorPath: this.getStrictPath(),
            TagString: tag,
            bIsPressed: false // Release
        });
    }

    @step('Action: Tap Input [{0}] for {1}ms')
    async tapInput(tag: string, durationMs: number = 100): Promise<void> {
        await this.pressInput(tag);
        await new Promise(resolve => setTimeout(resolve, durationMs));
        await this.releaseInput(tag);
    }

}
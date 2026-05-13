import { UnrealLocator } from '../unreal-locator';
import { step } from '../../support/decorators';

export class FlammableLocator extends UnrealLocator {

    @step('Get Toast Level')
    async getToastLevel(): Promise<number> {
        const level = await this.callActorFunction('GetCurrentToastLevel');
        return Number(level);
    }

    @step('Add Toast: {0}')
    async addToast(amount: number): Promise<void> {
        await this.callActorFunction('AddToast', { Amount: amount });
    }

    @step('Ignite Actor')
    async ignite(): Promise<void> {
        await this.callActorFunction('Ignite');
    }

    @step('Extinguish Actor')
    async extinguish(): Promise<void> {
        await this.callActorFunction('Extinguish');
    }

    @step('Check if On Fire')
    async isOnFire(): Promise<boolean> {
        const result = await this.callActorFunction('IsCurrentlyOnFire');
        return Boolean(result);
    }
}
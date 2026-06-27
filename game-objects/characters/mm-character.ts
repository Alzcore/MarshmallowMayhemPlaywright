import { ActorLocator } from '@specter/test';
import test from '@playwright/test';

export class MMCharacter extends ActorLocator {

    // --- GAS Input Simulators ---

    public async pressGasInput(tag: string): Promise<void> {
        await test.step(`Action: Press GAS Input [${tag}]`, async () => {
            await this.evaluate("TriggerGasInput", { tag: tag, isPressed: true });
        });
    }

    public async releaseGasInput(tag: string): Promise<void> {
        await test.step(`Action: Release GAS Input [${tag}]`, async () => {
            await this.evaluate("TriggerGasInput", { tag: tag, isPressed: false });
        });
    }

    public async tapGasInput(tag: string, durationMs: number = 100): Promise<void> {
        await test.step(`Action: Tap GAS Input [${tag}] for ${durationMs}ms`, async () => {
            await this.pressGasInput(tag);
            await new Promise(resolve => setTimeout(resolve, durationMs));
            await this.releaseGasInput(tag);
        });
    }

    // --- Non-GAS (Generic FKey) Input Simulators ---

    public async pressKeyInput(key: string): Promise<void> {
        await test.step(`Action: Press Key [${key}]`, async () => {
            await this.pressKey(key, 'Pressed');
        });
    }

    public async releaseKeyInput(key: string): Promise<void> {
        await test.step(`Action: Release Key [${key}]`, async () => {
            await this.pressKey(key, 'Released');
        });
    }

    public async tapKeyInput(key: string, durationMs: number = 100): Promise<void> {
        await test.step(`Action: Tap Key [${key}] for ${durationMs}ms`, async () => {
            await this.pressKeyInput(key);
            await new Promise(resolve => setTimeout(resolve, durationMs));
            await this.releaseKeyInput(key);
        });
    }

    // --- High-level Actions ---

    public async jump(durationMs: number = 100, useGas: boolean = true): Promise<void> {
        if (useGas) {
            await this.tapGasInput('Ability.Movement.Jump', durationMs);
        } else {
            await this.tapKeyInput('SpaceBar', durationMs);
        }
    }

    public async dash(durationMs: number = 100, useGas: boolean = true): Promise<void> {
        if (useGas) {
            await this.tapGasInput('Ability.Movement.Dash', durationMs);
        } else {
            await this.tapKeyInput('LeftShift', durationMs);
        }
    }
}
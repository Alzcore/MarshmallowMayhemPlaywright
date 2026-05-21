import { expect, SpecterWorld, SpecterLocator } from '@specter/test';

export class LyraMatch {
    private phaseSubsystem: SpecterLocator;

    constructor(private world: SpecterWorld) {
        this.phaseSubsystem = this.world.getSubsystem('LyraGamePhaseSubsystem');
    }


    public async getActivePhases(): Promise<string[]> {
        const response = await this.phaseSubsystem.getPropertyValue('ActivePhaseMap')
        console.log(response.data)
        return response.data

    }
    /**
     * Checks if the active match is in a specific phase.
     */
    public async isPhaseActive(phaseTag: string): Promise<boolean> {
        try {
            const response = await this.phaseSubsystem.callFunctionWithReturn('IsPhaseActive', {
                PhaseTag: phaseTag
            });

            // If it succeeds, return the actual boolean from Lyra
            return response ?? false;

        } catch (e) {
            // SDET SAFEGUARD: 
            // During map transitions, the World tears down and the Subsystem ceases to exist.
            // If C++ throws a "0 objects" error, we just tell the poll loop: "Not active yet!"
            return false;
        }
    }
    /**
     * SDET Helper: Waits for the match to transition to the Playing state.
     */
    public async waitForMatchToStart(timeout = 15000): Promise<void> {
        await expect.poll(async () => {
            return await this.isPhaseActive('ShooterGame.GamePhase.Playing');
        }, { timeout: timeout, message: 'Waiting for game phase playing to start' }).toBe(true);
    }
}
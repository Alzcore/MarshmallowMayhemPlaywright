import { test as baseTest, expect } from '@specter/test';
import { LyraApp } from '../../game-objects/lyra/lyra.app';

type LyraDef = {
    lyraApp: LyraApp
}

const test = baseTest.extend<LyraDef>({
    lyraApp: async ({ world }, use) => {
        await use(new LyraApp(world))
    }
})

test.describe.configure({ mode: 'serial' })

test('Start Quick Match via Main Menu', async ({ lyraApp: { mainMenu, experienceSelectionScreen, gamePhaseSubsystem, character, world } }) => {

    await world.loadLevel('L_LyraFrontEnd')
    await test.step('Start match', async () => {
        await expect(mainMenu.root).toBeVisible()
        await mainMenu.startButton.click({ strategy: 'broadcast' })
        await experienceSelectionScreen.quickPlayButton.click({ strategy: 'broadcast' })
    })

    await test.step('Validate game started', async () => {
        await gamePhaseSubsystem.waitForMatchToStart()

        await expect(character.local).toBeVisible({ timeout: 10_000 })
    })

});

test('Full Round Flow: Lobby -> Combat -> Elimination -> Scoreboard -> Reset', async ({ world }) => {
    // TODO: Write full match flow test
    // 1. Lobby Phase: Spawn 2 players, allow fighting, verify respawns work
    // 2. Start Match: Transition to round level
    // 3. Combat Phase: Apply damage, verify no respawns on death
    // 4. Elimination: Verify point awarded to survivor
    // 5. Reset: Verify level resets and players respawn with 0 Toast level
});


import { test as baseTest, expect } from '@specter/test';
import { GameAssets } from '../support/assets';
import { LyraMatch } from '../game-objects/lyra/lyra-match';
import { LyraApp } from '../game-objects/lyra/lyra.app';

// test.describe.configure({ mode: 'serial' })

// test('Verify all pickup exists', async ({ world }) => {

//     const weaponSpawner = await world.getByClass('B_WeaponSpawner').filter({}).asActor()
//     await expect(weaponSpawner).toBeVisible()
//     await weaponSpawner.highlight()

// });

type LyraDef = {
    lyraApp: LyraApp
}

const test = baseTest.extend<LyraDef>({
    lyraApp: async ({ world }, use) => {
        await use(new LyraApp(world))
    }
})



test('Start Quick Match via Main Menu', async ({ lyraApp: { mainMenu, experienceSelectionScreen, gamePhaseSubsystem, character } }) => {

    await test.step('Start match', async () => {
        await expect(mainMenu.root).toBeVisible()
        await mainMenu.startButton.click()
        await experienceSelectionScreen.quickPlayButton.click()
    })

    await test.step('Validate game started', async () => {
        await gamePhaseSubsystem.waitForMatchToStart()

        await expect(character.local).toBeVisible({ timeout: 10_000 })
    })

});

test('Navigate settings', async ({ lyraApp: { mainMenu, experienceSelectionScreen, gamePhaseSubsystem, character } }) => {
    await mainMenu.optionsButton.hardwareFocus();
    await mainMenu.optionsButton.hardwareAccept();
})
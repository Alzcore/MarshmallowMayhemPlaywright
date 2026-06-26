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

test('Verify ui navigation path', async ({ world }) => {
    const lastButton = world.widget('NavigationTestWidget').getChild('Button_7').first()
    await lastButton.hardwareFocus()
    await lastButton.hardwareAccept()
})

test('Navigate settings', async ({ lyraApp: { mainMenu } }) => {
    await mainMenu.optionsButton.hardwareFocus();
    await mainMenu.optionsButton.hardwareAccept();
})

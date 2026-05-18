
import { test, expect } from '@specter/test';
import { GameAssets } from '../support/assets';

test.describe.configure({ mode: 'serial' })

test('Verify all pickup exists', async ({ world }) => {

    const weaponSpawner = await world.getByClass('B_WeaponSpawner').filter({}).asActor()
    await expect(weaponSpawner).toBeVisible()
    await weaponSpawner.highlight()

});

test('Start Match via Main Menu', async ({ world }) => {
    // 1. Find the Main Menu widget
    const mainMenu = world.getWidgetByClass('W_LyraFrontEnd').asWidget();
    await expect(mainMenu).toBeVisible();

    // 2. Find a specific button inside that menu by filtering for its internal name
    const playButton = mainMenu.filter({ property: { name: 'Name', value: 'StartGameButton' } }).asWidget();

    // 3. Verify text and click
    const btnText = await playButton.getText();
    expect(btnText).toBe('Play Lyra');

    await playButton.click();
});
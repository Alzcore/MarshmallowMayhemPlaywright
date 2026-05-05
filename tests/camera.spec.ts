
import { Location } from '../engine/unreal-world';
import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { GameAssets } from '../support/assets';
import { expect } from '../support/custom-matchers';

test.describe.configure({ mode: "serial" })

test('Camera auto tracks players', async ({ world, page }) => {

    const spawnLocations: Location[] = [
        { X: 1000, Y: -1000, Z: 0 },
        { X: 1000, Y: 1000, Z: 0 },
        { X: -1000, Y: 1000, Z: 0 },
        { X: -1000, Y: -1000, Z: 0 },
    ]

    for (const location of spawnLocations) {
        const marshmallow = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { location })
        await expect(marshmallow).toBeVisibleOnScreen()
        await page.waitForTimeout(500);
    }
});

test('Players death removes camera tracking after three seconds', async ({ world, page }) => {

    const marshmallow1 = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { location: { X: 500, Y: 0, Z: 0 } })
    const marshmallow2 = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { location: { X: -500, Y: 0, Z: 0 } })

    await marshmallow2.applyEffect(GameAssets.Effects.Abyss)

    await expect(marshmallow1).toBeVisibleOnScreen()
    await expect(marshmallow2).not.toBeVisibleOnScreen()


});
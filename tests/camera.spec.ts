
import { Location } from '../engine/unreal-world';
import { test, expect } from '@specter/test'
import { GameAssets } from '../support/assets';

test.describe.configure({ mode: "serial" })

test('Camera auto tracks players', async ({ world, page }) => {

    const spawnLocations: Location[] = [
        { X: 1000, Y: -1000, Z: 0 },
        { X: 1000, Y: 1000, Z: 0 },
        { X: -1000, Y: 1000, Z: 0 },
        { X: -1000, Y: -1000, Z: 0 },
    ]

    for (const location of spawnLocations) {
        const marshmallow = await world.spawnActor(GameAssets.Characters.Marshmallow, { location })
        await expect(marshmallow).toBeVisible({ onScreen: true })
    }
});

test('Players death removes camera tracking after three seconds', async ({ world }) => {

    const marshmallow1 = await world.spawnActor(GameAssets.Characters.Marshmallow, { location: { X: 500, Y: 0, Z: 0 } })
    const marshmallow2 = await world.spawnActor(GameAssets.Characters.Marshmallow, { location: { X: -500, Y: 0, Z: 0 } })

    await marshmallow2.applyEffect(GameAssets.Effects.Abyss)

    await expect(marshmallow1).toBeVisible({ onScreen: true })
    await expect(marshmallow2).not.toBeVisible({ onScreen: true })


});
import { test, expect, Vector3 } from '@specter/test';
import { GameAssets } from '../../support/assets';

test.describe.configure({ mode: 'serial' })

test('Camera auto tracks players', async ({ world }) => {

    const spawnLocations: Vector3[] = [
        { x: 1000, y: -1000, z: 0 },
        { x: 1000, y: 1000, z: 0 },
        { x: -1000, y: 1000, z: 0 },
        { x: -1000, y: -1000, z: 0 },
    ]

    for (const location of spawnLocations) {
        const marshmallow = await world.spawnActor(GameAssets.Characters.Marshmallow, { location })
        await expect(marshmallow).toBeVisible({ onScreen: true })
    }
});

test('Players death removes camera tracking after three seconds', async ({ world }) => {

    const marshmallow1 = await world.spawnActor(GameAssets.Characters.Marshmallow, { location: { x: 500, y: 0, z: 0 } })
    const marshmallow2 = await world.spawnActor(GameAssets.Characters.Marshmallow, { location: { x: -500, y: 0, z: 0 } })

    await marshmallow2.applyGameplayEffect(GameAssets.Effects.Abyss)

    await expect(marshmallow1).toBeVisible({ onScreen: true })
    await expect(marshmallow2).not.toBeVisible({ onScreen: true })

});

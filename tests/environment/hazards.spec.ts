import { test, expect } from '@specter/test';
import { GameAssets } from '../../support/assets';
import { GameplayTags } from '../../support/tags';

test.describe.configure({ mode: 'serial' })

test('Marshmallow catches fire when standing near fire', async ({ world }) => {
    const marshmallow = await world.spawnActor(GameAssets.Characters.Marshmallow)

    const startLocation = await marshmallow.getLocation()
    await expect(marshmallow).not.toHaveGameplayTag(GameplayTags.Status.OnFire);
    await world.spawnActor(GameAssets.Hazards.Fire)

    await expect(marshmallow).toHaveGameplayTag(GameplayTags.Status.OnFire);

    await expect(marshmallow).toHaveMovedFurtherThan(startLocation, 1000)
});

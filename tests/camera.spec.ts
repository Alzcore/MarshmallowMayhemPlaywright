
import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { expect } from '../support/custom-matchers';

test('Camera auto tracks players', async ({ world, page }) => {

    const marshmallow1 = await world.spawnActor(MMCharacter, "/Game/Characters/Marshmallow/BP_Marshmallow_Character.BP_Marshmallow_Character_C", { X: 500, Y: 0, Z: 0 })
    const marshmallow2 = await world.spawnActor(MMCharacter, "/Game/Characters/Marshmallow/BP_Marshmallow_Character.BP_Marshmallow_Character_C", { X: -500, Y: 0, Z: 0 })

    await expect(marshmallow1).toBeVisibleOnScreen()
    await expect(marshmallow2).toBeVisibleOnScreen()

    await page.waitForTimeout(1000);

});
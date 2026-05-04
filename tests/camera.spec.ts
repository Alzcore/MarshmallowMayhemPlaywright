
import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { GameAssets } from '../support/assets';
import { expect } from '../support/custom-matchers';

test.describe.configure({ mode: "serial" })

test('Camera auto tracks players', async ({ world, page }) => {

    const marshmallow1 = await world.spawnActor(MMCharacter, "/Game/Characters/Marshmallow/BP_Marshmallow_Character.BP_Marshmallow_Character_C", { X: 500, Y: 500, Z: 0 })
    const marshmallow2 = await world.spawnActor(MMCharacter, "/Game/Characters/Marshmallow/BP_Marshmallow_Character.BP_Marshmallow_Character_C", { X: -500, Y: 0, Z: 0 })

    await expect(marshmallow1).toBeVisibleOnScreen()
    await expect(marshmallow2).toBeVisibleOnScreen()

    await page.waitForTimeout(1000);

    const marshmallow3 = await world.spawnActor(MMCharacter, "/Game/Characters/Marshmallow/BP_Marshmallow_Character.BP_Marshmallow_Character_C", { X: -1500, Y: 0, Z: 0 })
    await expect(marshmallow3).toBeVisibleOnScreen()

    await page.waitForTimeout(1000);

});

test('Players death removes camera tracking after three seconds', async ({ world, page }) => {

    const marshmallow1 = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { X: 500, Y: 0, Z: 0 })
    const marshmallow2 = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { X: -500, Y: 0, Z: 0 })
    const hazard = await world.spawnActor('', GameAssets.Hazards.Pinecone, { X: -500, Y: 100, Z: 0 })

    await marshmallow2.applyEffect(GameAssets.Effects.Abyss)

    await page.waitForTimeout(3000);

    await expect(marshmallow1).toBeVisibleOnScreen()
    await expect(hazard).not.toBeVisibleOnScreen()


    await page.waitForTimeout(1000);

});

import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { GameAssets } from '../support/assets';
import { expect } from '../support/custom-matchers';
import { GameplayTags } from '../support/tags';

test.describe.configure({ mode: 'serial' })

test('Melee Attack deals damage', async ({ world, page }) => {

    const attacker = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { tag: 'Attacker', location: { X: 0, Y: 400, Z: 66 }, rotation: { Yaw: 270, Pitch: 0, Roll: 0 } });
    const defender = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow, { tag: 'Defender', location: { X: 0, Y: 200, Z: 66 }, rotation: { Yaw: 90.0, Pitch: 0, Roll: 0 } });

    await page.waitForTimeout(2000);

    const attackerDamage = await attacker.getGasAttribute("MMAttributeSet", "Damage")

    const previousHealth = await defender.getGasAttribute("MMAttributeSet", "Health")

    await attacker.tapInput("Ability.Attack.Melee");

    await expect(defender).toHaveGasAttribute("MMAttributeSet", "Health", previousHealth - attackerDamage);
    await page.waitForTimeout(2000);

});

test('Marshmallow catches fire when standing near fire', async ({ world, page }) => {
    const marshmallow = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow)

    const startLocation = await marshmallow.getLocation()
    await expect(marshmallow).not.toHaveGameplayTag(GameplayTags.Status.OnFire);
    await world.spawnActor('Hazard', GameAssets.Hazards.Fire)

    await expect(marshmallow).toHaveGameplayTag(GameplayTags.Status.OnFire);

    await expect(marshmallow).toHaveMovedFurtherThan(startLocation, 1000)
})

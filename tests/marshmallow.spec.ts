
import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { GameAssets } from '../support/assets';
import { expect } from '../support/custom-matchers';
import { GameplayTags } from '../support/tags';

test('Melee Attack deals damage', async ({ world, page }) => {

    const attacker = await world.getByActor(MMCharacter, { tag: 'Attacker' });
    const defender = await world.getByActor(MMCharacter, { tag: 'Defender' });

    const attackerDamage = await attacker.getGasAttribute("MMAttributeSet", "Damage")

    const previousHealth = await defender.getGasAttribute("MMAttributeSet", "Health")

    await attacker.tapInput("Ability.Attack.Melee");

    await expect(defender).toHaveGasAttribute("MMAttributeSet", "Health", previousHealth - attackerDamage);

    await page.waitForTimeout(1000);

});

test('Marshmallow catches fire when standing near fire', async ({ world, page }) => {
    const marshmallow = await world.spawnActor(MMCharacter, GameAssets.Characters.Marshmallow)
    await expect(marshmallow).not.toHaveGameplayTag(GameplayTags.Status.OnFire);
    await world.spawnActor('Hazard', GameAssets.Hazards.Fire)

    await expect(marshmallow).toHaveGameplayTag(GameplayTags.Status.OnFire);
})

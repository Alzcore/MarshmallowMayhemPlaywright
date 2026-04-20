
import { test } from '../fixtures/unreal-test.fixture';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { expect } from '../support/custom-matchers';

test('Punching another marshmallow lowers there health', async ({ world, page }) => {

    const attacker = await world.getByActor(MMCharacter, { tag: 'Attacker' });
    const defender = await world.getByActor(MMCharacter, { tag: 'Defender' });

    const attackerDamage = await attacker.getGasAttribute("MMAttributeSet", "Damage")

    const previousHealth = await defender.getGasAttribute("MMAttributeSet", "Health")

    await attacker.tapInput("Ability.Attack.Melee");

    await expect(defender).toHaveGasAttribute("MMAttributeSet", "Health", previousHealth - attackerDamage);

    await page.waitForTimeout(1000);

});
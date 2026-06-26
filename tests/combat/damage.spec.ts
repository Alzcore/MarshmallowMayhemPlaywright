import { test, expect } from '@specter/test';
import { GameAssets } from '../../support/assets';
import { GameplayTags } from '../../support/tags';

test.describe.configure({ mode: 'serial' })

test('Melee Attack deals damage', async ({ world }) => {

    const { attacker, defender } = await test.step("Spawn Actors", async () => {
        const attacker = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Attacker', location: { x: 0, y: 400, z: 66 }, rotation: { yaw: 270, pitch: 0, roll: 0 } });
        // The attacker's melee range is 150 units (75 distance + 75 radius). Moving the defender closer (Y:300) guarantees a hit.
        const defender = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Defender', location: { x: 0, y: 300, z: 66 }, rotation: { yaw: 90.0, pitch: 0, roll: 0 } });

        return { attacker, defender }
    })

    const { attackerDamage, previousHealth } = await test.step("Get Attribute Values", async () => {
        const attackerDamage = await attacker.getAttributeValue("MMAttributeSet", "Damage");
        const previousHealth = await defender.getAttributeValue("MMAttributeSet", "Health");

        return { attackerDamage, previousHealth }
    })

    await attacker.triggerAbilityByTag("Ability.Attack.Melee");

    await expect(defender).toHaveAttributeChange("MMAttributeSet", "Health", {
        delta: -attackerDamage,
        instigator: attacker,
        ability: "Default__GA_Marshmallow_Punch_C"
    });
});

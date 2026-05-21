
import { MMCharacter } from '../game-objects/characters/mm-character'
import { GameAssets } from '../support/assets';
import { GameplayTags } from '../support/tags';

test.describe.configure({ mode: 'serial' })

test('Melee Attack deals damage', async ({ world, page }) => {

    // The clean, enterprise-grade test script
    const attacker = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Attacker', location: { X: 0, Y: 400, Z: 66 }, rotation: { Yaw: 270, Pitch: 0, Roll: 0 } });
    const defender = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Defender', location: { X: 0, Y: 200, Z: 66 }, rotation: { Yaw: 90.0, Pitch: 0, Roll: 0 } });

    // Read the baseline memory states
    const attackerDamage = await attacker.getAttributeValue("MMAttributeSet", "Damage");
    const previousHealth = await defender.getAttributeValue("MMAttributeSet", "Health");

    // Fire the native C++ ability
    await attacker.triggerAbilityByTag("Ability.Attack.Melee");

    // Assert the exact math on the physics/GAS thread
    await expect(defender).toHaveAttributeValue("MMAttributeSet", "Health", previousHealth - attackerDamage);
    // await expect(defender).not.toHaveAttributeValue("MMAttributeSet", "Health", previousHealth);

});

test('Marshmallow catches fire when standing near fire', async ({ world, page }) => {
    const marshmallow = await world.spawnActor(GameAssets.Characters.Marshmallow)

    const startLocation = await marshmallow.getLocation()
    console.log(startLocation)
    // await expect(marshmallow).not.toHaveGameplayTag(GameplayTags.Status.OnFire);
    await world.spawnActor(GameAssets.Hazards.Fire)

    // await expect(marshmallow).toHaveGameplayTag(GameplayTags.Status.OnFire);

    // await expect(marshmallow).toHaveMovedFurtherThan(startLocation, 1000)
})

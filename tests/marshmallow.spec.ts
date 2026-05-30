
import { test, expect } from '@specter/test'
import { GameAssets } from '../support/assets';
import { GameplayTags } from '../support/tags';

test.describe.configure({ mode: 'serial' })

test('Melee Attack deals damage', async ({ world }) => {

    const { attacker, defender } = await test.step("Spawn Actors", async () => {
        const attacker = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Attacker', location: { X: 0, Y: 400, Z: 66 }, rotation: { Yaw: 270, Pitch: 0, Roll: 0 } });
        const defender = await world.spawnActor(GameAssets.Characters.Marshmallow, { tag: 'Defender', location: { X: 0, Y: 200, Z: 66 }, rotation: { Yaw: 90.0, Pitch: 0, Roll: 0 } });

        return { attacker, defender }
    })

    const { attackerDamage, previousHealth } = await test.step("Get Attribute Values", async () => {
        const attackerDamage = await attacker.getAttributeValue("MMAttributeSet", "Damage");
        const previousHealth = await defender.getAttributeValue("MMAttributeSet", "Health");

        return { attackerDamage, previousHealth }
    })



    await attacker.triggerAbilityByTag("Ability.Attack.Melee");

    await expect(defender).toHaveAttributeValue("MMAttributeSet", "Health", previousHealth - attackerDamage);
});

test('Verify ui navigation path', async ({ world }) => {
    const lastButton = world.widget('NavigationTestWidget').getChild('Button_7').first()
    await lastButton.click({ strategy: 'hardware' })
    //await lastButton.hardwareAccept()
})

// test('Marshmallow catches fire when standing near fire', async ({ world, page }) => {
//     const marshmallow = await world.spawnActor(GameAssets.Characters.Marshmallow)

//     const startLocation = await marshmallow.getLocation()
//     await expect(marshmallow).not.toHaveGameplayTag(GameplayTags.Status.OnFire);
//     await world.spawnActor(GameAssets.Hazards.Fire)

//     await expect(marshmallow).toHaveGameplayTag(GameplayTags.Status.OnFire);

//     await expect(marshmallow).toHaveMovedFurtherThan(startLocation, 1000)
// })

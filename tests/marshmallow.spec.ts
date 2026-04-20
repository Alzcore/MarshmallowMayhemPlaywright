import { test } from '@playwright/test';
import { UnrealRCClient } from '../engine/unreal-rc-client';
import { UnrealWorld } from '../engine/unreal-world';
import { MMCharacter } from '../game-objects/characters/mm-character'
import { expect } from '../support/custom-matchers';

test('Marshmallow character spawns at the correct location', async ({ page, request }) => {
    const client = new UnrealRCClient(request);
    const world = new UnrealWorld(client);

    await page.goto('http://127.0.0.1');

    const attacker = await world.getByActor(MMCharacter, { tag: 'Attacker' });

    await attacker.tapInput("Ability.Attack.Melee");

    const defender = await world.getByActor(MMCharacter, { tag: 'Defender' });

    await expect(defender).toHaveGasAttribute("MMAttributeSet", "Health", 95);

});
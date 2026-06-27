import { test, expect } from '../../fixtures/multiplayer.fixture';
import { GameAssets } from '../../support/assets';
import { MMCharacter } from '../../game-objects/characters/mm-character';

test.describe.configure({ mode: 'serial' });

test('Multiplayer Host and Client connection and interaction', async ({ world, client2 }) => {
    // 1. Player 1 (Host) is already connected on port 8080 as 'world'
    const player1 = world;

    // 2. Player 2 (Client) is automatically connected on port 8081 as 'client2'
    const player2 = client2;

    // 3. Spawn a Marshmallow character on the Host (Server)
    const marshmallow1 = await player1.spawnActor(GameAssets.Characters.Marshmallow, {
        tag: 'Player1Char',
        location: { x: 500, y: 0, z: 100 }
    });

    // 4. Verify player1 can find the actor in player1's world
    await expect(marshmallow1).toBeVisible();

    // 5. Using the client() sharing helper, verify player2 (client) can query the same actor
    const marshmallow1OnClient = marshmallow1.client(player2);
    await expect(marshmallow1OnClient).toBeVisible();

    // 6. Spawn Player 2's character on the Host
    const marshmallow2 = await player1.spawnActor(GameAssets.Characters.Marshmallow, {
        tag: 'Player2Char',
        location: { x: -500, y: 0, z: 100 }
    });

    // Verify Player 2 can perform actions using the client connection
    const marshmallow2OnClient = marshmallow2.client(player2);
    
    // Cast it to MMCharacter using its transport and pipeline
    const mmChar2Client = new MMCharacter((marshmallow2OnClient as any).transport, (marshmallow2OnClient as any).pipeline);

    // Verify Player 2 can jump (using GAS input tag mode)
    await mmChar2Client.jump(100, true);

    // Verify Player 2 can dash (using key input mode)
    await mmChar2Client.dash(100, false);
});

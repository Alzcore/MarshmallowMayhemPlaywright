import { test as baseTest, SpecterWorld } from '@specter/test';

type MultiplayerFixtures = {
    client2: SpecterWorld;
};

export const test = baseTest.extend<MultiplayerFixtures>({
    client2: async ({ createWorld }, use) => {
        // Automatically spawn a client window and connect Player 2 on port 8081
        const player2 = await createWorld({ port: 8081, launchClient: true });
        await use(player2);
    }
});

export { expect } from '@specter/test';

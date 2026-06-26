import { test, expect } from '@specter/test';
import { GameAssets } from '../../support/assets';

test.describe.configure({ mode: 'serial' })

test.describe('Movement & Traversal', () => {

    test('Player can jump', async ({ world }) => {
        // TODO: Implement jump validation 
        // 1. Spawn character
        // 2. Call jump()
        // 3. Verify Z velocity or position increases
    });

    test('Player can dash', async ({ world }) => {
        // TODO: Implement dash validation
        // 1. Spawn character
        // 2. Call dash()
        // 3. Verify character moved quickly horizontally or has Dash status tag
    });

});

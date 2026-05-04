// fixtures/unreal-test.ts
import { test as base } from '@playwright/test';
import { UnrealRCClient } from '../engine/unreal-rc-client';
import { UnrealWorld } from '../engine/unreal-world';

// Extend Playwright's base test
export const test = base.extend<{ world: UnrealWorld }>({

    // 1. Initialize your custom Unreal World instance
    world: async ({ request }, use) => {
        const client = new UnrealRCClient(request);
        const world = new UnrealWorld(client);
        await use(world);
        await world.cleanup()
    },

    // 2. Override the default 'page' fixture to handle the stream loading
    page: async ({ page }, use) => {
        await page.goto('http://127.0.0.1/?AutoConnect=true');

        // Click the dead center to bypass the browser's autoplay block
        await page.mouse.click(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);

        // Wait for Epic's frontend to inject the video element
        const videoLocator = page.locator('video');
        await videoLocator.waitFor({ state: 'visible', timeout: 10000 });

        // THE MAGIC: Wait for the WebRTC stream to actually decode the game frames
        await page.waitForFunction(() => {
            const vid = document.querySelector('video');
            if (!vid) return false;

            // readyState 3 (HAVE_FUTURE_DATA) or 4 (HAVE_ENOUGH_DATA) means stream is active.
            // videoWidth > 0 ensures the WebRTC pipeline successfully connected to Unreal.
            return vid.readyState >= 3 && vid.videoWidth > 0;
        }, { timeout: 15000 });

        // Optional: Add a tiny 500ms buffer just to let the visual fade-in finish
        await page.waitForTimeout(500);

        // Hand the fully-loaded page off to the test
        await use(page);
    }
});
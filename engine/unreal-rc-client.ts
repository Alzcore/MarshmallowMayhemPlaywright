import test, { APIRequestContext } from '@playwright/test';

export class UnrealRCClient {
    private baseUrl: string;
    private request: APIRequestContext;

    constructor(request: APIRequestContext, port: number = 30010) {
        this.baseUrl = `http://127.0.0.1:${port}`;
        this.request = request;
    }

    async callFunction(objectPath: string, functionName: string, parameters: Record<string, any> = {}): Promise<any> {
        // Wrap the entire API call in a test.step!
        return await test.step(`${functionName}`, async () => {

            const response = await fetch(`${this.baseUrl}/remote/object/call`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objectPath, functionName, parameters })
            });

            if (!response.ok) {
                throw new Error(`Unreal API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.ReturnValue;
        });
    }
}
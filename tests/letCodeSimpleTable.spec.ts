import { test, expect } from "@playwright/test";

test.describe("Simple Table Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/table", { waitUntil: "domcontentloaded" });
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test("Add all the prices and check if the total is correct", async ({ page }) => {
        const tableRow = await page.locator("xpath=//table[@id='shopping' and @name='listtable']//tbody//tr");
        const totalRow = await page.locator("xpath=//table[@id='shopping' and @name='listtable']//tfoot//tr").last().textContent();
        
        const tableRowCount = await tableRow.count();
        console.log(`Number of Rows: ${tableRowCount}`);

        const prices: Array<number> = [];

        for (let i = 0; i < tableRowCount; i++) {
            const rowValue = await page.locator("xpath=//table[@id='shopping' and @name='listtable']//tbody//tr").nth(i).textContent();
            const price = Number(rowValue?.replace(/[a-zA-Z]/g, "").trim());

            if(!isNaN(price)) {
                prices.push(price);
            }
        }

        const total = prices.reduce((a, b) => a + b, 0);
        const expectTotal = Number(totalRow?.replace(/[a-zA-Z]/g, "").trim());

        console.log(`Actual Total: ${total}`);
        console.log(`Expected Total: ${expectTotal}`);

        await expect(total).toBe(expectTotal);
    });

    test("Mark Raj as present", async ({ page }) => {
        const tableRow = await page.locator("xpath=//table[@id='simpletable' and @name='table']//tbody//tr");
        const tableRowCount = await tableRow.count();

        const name = 'Raj';

        for (let i=0; i < tableRowCount; i++) {
            const cell = await page.locator("xpath=//table[@id='simpletable' and @name='table']//tbody//tr").nth(i).textContent();
            
            if(cell?.includes(name)) {
                const searchName = await page.locator("xpath=//table[@id='simpletable' and @name='table']//tbody//tr").nth(i).textContent();
                const stripName = searchName?.match(/Raj/gi)?.[0] ?? "";

                await page.locator(`xpath=//table[@id='simpletable' and @name='table']//tbody//tr//td//input[@class='qe' and @type='checkbox' and @id='second']`).check();

                console.log(`Marked ${stripName} as present`);
                break;
            }  
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
    })
});
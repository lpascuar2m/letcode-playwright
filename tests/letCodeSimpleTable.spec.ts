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
    });

    [
        { index: 0, expected: "Not sorted" },
        { index: 1, expected: "Sorted in ascending order" },
        { index: 2, expected: "Not sorted" },
        { index: 3, expected: "Not sorted" },
        { index: 4, expected: "Not sorted" },
        { index: 5, expected: "Not sorted" }
    ].forEach(({ index, expected }) => {
        test(`Check if the sorting is working properly for column ${index}`, async ({ page }) => {
            const tableCells = page.locator('table.mat-sort.table tbody tr');

            const getColumnValues = async (colIndex: number): Promise<string[]> => {
                const cellCount = await tableCells.count();
                const values: string[] = [];
                for (let i = 0; i < cellCount; i++) {
                    const text = await tableCells.nth(i).locator('td').nth(colIndex).textContent();
                    values.push(text?.trim() || "");
                }
                return values;
            }

            const originalValue = await getColumnValues(index);
            console.log(`Original Values: ${originalValue}`);

            // Determine if column is numeric
            const isNumeric = originalValue.every(val => !isNaN(Number(val)));

            let sortedAsc: string[];
            let sortedDesc: string[];

            if (isNumeric) {
                const numericOriginal = originalValue.map(Number);
                sortedAsc = [...numericOriginal].sort((a, b) => a - b).map(String);
                sortedDesc = [...numericOriginal].sort((a, b) => b - a).map(String);
            } else {
                sortedAsc = [...originalValue].sort((a, b) => a.localeCompare(b));
                sortedDesc = [...originalValue].sort((a, b) => b.localeCompare(a));
            }

            const isEqual = (a: string[], b: string[]) =>
                a.length === b.length && a.every((v, i) => v === b[i]);

            const sorting = 
                isEqual(originalValue, sortedAsc)
                    ? "Sorted in ascending order"
                    : isEqual(originalValue, sortedDesc)
                        ? "Sorted in descending order"
                        : "Not sorted";

            console.log(`Sorting: ${sorting}`);
            console.log('Ascending:', sortedAsc);
            console.log('Descending:', sortedDesc);

            await expect(sorting).toBe(expected);
        });
    });

});
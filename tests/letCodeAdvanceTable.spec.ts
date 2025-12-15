import { test, expect } from "@playwright/test";
import * as scenarios from '../scenario/scenarios.ts'

// test.use({ headless: true })
test.describe.configure({ mode: "default" });
test.describe("Simple Table Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/advancedtable", { waitUntil: "domcontentloaded" });
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    scenarios.pageEntriesScenario.forEach(item => {
        const { scenario, entries, expected } = item;
        const title = `Test for ${scenario} entries per page`;
        
        test(title, async ({ page }) => {
            const selectEntries = page.locator("xpath=//select[@class='dt-input']");
            await selectEntries.selectOption(entries.toString());

            const tableRow = page.locator("xpath=//table//tbody//tr");
            const tableRowCount = await tableRow.count();

            console.log(`Number of Rows: ${tableRowCount}`);
            await expect(tableRow).toHaveCount(expected);

            const numberOfPages = await page.locator("xpath=//div[@class='dt-info' and @role='status']").textContent();
            console.log(numberOfPages);
            await expect(numberOfPages).toContain(expected.toString());
        })
    });


    scenarios.paginationScenario.forEach(item => {
        const { scenario, entries, expectedPageNumber } = item;
        const title = `Test for ${scenario} - Page (${entries})`;
        
        test(title, async ({ page }) => {
            const nextPage = async (entries: number) => {
                const selectEntries = page.locator("xpath=//select[@class='dt-input']");    
                await selectEntries.selectOption(entries.toString());

                let pageCount = 0;
                while(true) {
                    const nextButton = await page.locator(`xpath=//button[@aria-label='Next']`);
                    const currentPageElement = await page.locator("xpath=//button[@aria-current='page']");
                    const currentPageText = await currentPageElement.textContent();
                    
                    if (currentPageText) {
                        pageCount = parseInt(currentPageText);
                    }

                    const isDisabledNext = await nextButton.isDisabled();
                        
                    if (isDisabledNext) {
                        console.log(`Page ${pageCount} - End Page`);
                        await expect(pageCount).toBe(expectedPageNumber);
                        break;
                    }

                    console.log(`Page ${pageCount}`);
                    await nextButton.click();
                    await page.waitForTimeout(100);
                }
            }
            await nextPage(entries!);
        })
    });

    scenarios.sortingScenario.forEach(item => {
        const { scenario, index, expected } = item;
        const title = `Test for ${scenario} - Column (${index})`;
        
        test(title, async ({ page }) => {
            
        })
    })
 
});
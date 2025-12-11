import { test, expect } from "@playwright/test";

// test.use({ headless: true })
test.describe.configure({ mode: "serial" });
test.describe("Simple Table Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/advancedtable", { waitUntil: "domcontentloaded" });
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });


    // Test for entries per page
    const pageEntries = [
        { number: 5, expected: 5 },
        { number: 10, expected: 10 },
        { number: 25, expected: 25 }
    ];
    
    pageEntries.forEach(({ number, expected }) => {
        test(`Test for ${number} entries per page`, async ({ page }) => {
            const selectEntries = page.locator("xpath=//select[@class='dt-input']");
            await selectEntries.selectOption(number.toString());

            const tableRow = page.locator("xpath=//table//tbody//tr");
            const tableRowCount = await tableRow.count();

            console.log(`Number of Rows: ${tableRowCount}`);
            await expect(tableRow).toHaveCount(expected);

            const numberOfPages = await page.locator("xpath=//div[@class='dt-info' and @role='status']").textContent();
            console.log(numberOfPages);
            await expect(numberOfPages).toContain(expected.toString());
        })
    });


    const paginationScenario = [
        {scenario: "Next", entries: 5, expectedPages: 10},
        {scenario: "Next", entries: 10, expectedPages: 5},
        {scenario: "Next", entries: 25, expectedPages: 2},

        {scenario: "Sorting", index: 0, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 1, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 2, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 3, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 4, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 5, expected: "Sorted in ascending order"}
    ];
    
    paginationScenario.forEach(item => {

        const { scenario, entries, expectedPages, index, expected } = item;
        const title = `Test for ${scenario} - ${scenario === 'Next' ? `Page (${entries})` : `Sorting (Column ${index})`}`;
        
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
                        await expect(pageCount).toBe(expectedPages);
                        break;
                    }

                    console.log(`Page ${pageCount}`);
                    await nextButton.click();
                    await page.waitForTimeout(100);
                }
            }

            if(scenario === "Next") {
                await nextPage(entries!);
            }

            
        })
    });
 
});
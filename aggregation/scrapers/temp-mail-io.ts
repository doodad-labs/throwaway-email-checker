import playwright from 'playwright';
import validateDomain from '../utils/validate-domain';
import { addToDisposableList } from '../utils/add-to-list';

const url = "https://temp-mail.io/";

export default async function() {

    console.log('Starting scraping for temp-mail.io...');

    const domains: Set<string> = new Set<string>();

    for (const browserType of ['chromium', 'firefox', 'webkit']) {

        console.log(`Launching browser: ${browserType}`);

        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.waitForTimeout(500);

        const changeEmailButton = await page.$('button[data-original-title="Change email"]');
        if (changeEmailButton) {
            await changeEmailButton.click();
            await page.waitForTimeout(500);
        } else {
            console.error(`Change email button not found on ${browserType}`);
            await browser.close();
            continue;
        }

        const changeSelector = await page.$('select[data-qa="selected-domain"]');
        if (changeSelector) {
            await changeSelector.click();
            await page.waitForTimeout(500);
        } else {
            console.error(`Change selector not found on ${browserType}`);
            await browser.close();
            continue;
        }

        const options = await page.$$('button[data-qa="domain-option"]');
        if (options.length === 0) {
            console.error(`No options found in the change selector on ${browserType}`);
            await browser.close();
            continue;
        }


        for (const option of options) {
            const domainText = await option.innerText();
            if (domainText) {
                const normalizedDomain = domainText.trim().toLowerCase().replace('\\n', '');
                if (await validateDomain(normalizedDomain)) {
                    domains.add(normalizedDomain);
                }
            }
        }

        await browser.close();
    }

    if (domains.size === 0) {
        console.error('No valid domains found.');
        return;
    }

    console.log(`Found ${[...domains].length} valid domains from temp-mail.io.`);
    addToDisposableList([...domains])
}
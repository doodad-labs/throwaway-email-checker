import playwright from 'playwright';
import validateDomain from '../utils/validate-domain';
import { addToDisposableList } from '../utils/add-to-list';
import extractDomain from '../utils/extract-domain';
import 'dotenv/config'

const url = "https://tempmailo.com/";
const changes: number = 30; // Number of times to change the email

export default async function main() {

    console.log('Starting scraping for tempmailo.com...');

    const domains: Set<string> = new Set<string>();

    for (const browserType of ['chromium', 'firefox', 'webkit']) {

        console.log(`Launching browser: ${browserType}`);

        const browser = await playwright[browserType].launch({
            proxy: {
                server: process.env.PROXY_SERVER,
                username: process.env.PROXY_USER,
                password: process.env.PROXY_PASS
            }
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.waitForTimeout(500);

        // consent

        const consentButton = await page.$('div.fc-consent-root button[aria-label="Consent"]');
        if (!consentButton) {
            console.error(`Consent button not found on ${browserType}`);
        } else {
            console.log(`Clicking consent button on ${browserType}`);
            await consentButton.click();
            await page.waitForTimeout(500);
        }

        const changeEmailButton = await page.$('div.primaryCommands div.prim-btn-wrap:last-child button.prim-btn');
        if (!changeEmailButton) {
            console.error(`Change email button not found on ${browserType}`);
            await browser.close();
            continue;
        }

        const email = await page.$('input#i-email[readonly="readonly"]');
        if (!email) {
            console.error(`Email input not found on ${browserType}`);
            await browser.close();
            continue;
        }

        for (let _ = 0; _ < changes; _++) {

            await page.waitForTimeout(1000);

            const email = await page.$('input#i-email[readonly="readonly"]');
            if (!email) {
                console.error(`Email input not found on ${browserType}`);
                break;
            }

            const emailText = await email.inputValue();
            console.log('Found email:', emailText);

            if (emailText || emailText.trim() !== '') {
                const domain = await extractDomain(emailText).catch(error => {
                    console.error(`Error extracting domain from email: ${emailText}`, error);
                    return null;
                })

                if (!domain) {
                    console.error(`Invalid email format: ${emailText}`);
                    continue;
                }

                if (emailText) {
                    const normalizedDomain = domain.trim().toLowerCase().replace('\\n', '');
                    if (validateDomain(normalizedDomain)) {
                        domains.add(normalizedDomain);
                    }
                }
            }

            const changeEmailButton = await page.$('div.primaryCommands div.prim-btn-wrap:last-child button.prim-btn');
            if (!changeEmailButton) {
                console.error(`Change email button not found on ${browserType}`);
                await browser.close();
                continue;
            }

            // Test if rate limit is reached
            if (await page.$('h3:has-text("Rate limit exceeded! Try again later.")')) {
                console.error(`Rate limit exceeded on ${browserType}. Stopping further changes.`);
                break;
            }

            await changeEmailButton.click();

            const confirmButton = await page.$('button.pure-button-primary:has-text("Ok")');
            if (confirmButton) {
                await confirmButton.click();
                await page.waitForTimeout(500);
            } else {
                console.error(`Confirm button not found after changing email on ${browserType}`);
                break;
            }

            // Test if rate limit is reached
            if (await page.$('h3:has-text("Rate limit exceeded! Try again later.")')) {
                console.error(`Rate limit exceeded on ${browserType}. Stopping further changes.`);
                break;
            }

        }

        await browser.close();
    }

    if (domains.size === 0) {
        console.error('No valid domains found.');
        return;
    }

    console.log(`Found ${[...domains].length} valid domains from tempmailo.com.`);
    console.log(`Domains: ${[...domains].join(', ')}`);
    addToDisposableList([...domains])
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error during scraping:', error);
    });
}
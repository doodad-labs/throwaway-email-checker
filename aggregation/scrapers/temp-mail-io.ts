import playwright from 'playwright';
import validateDomain from '../utils/validate-domain';
import { addToDisposableList } from '../utils/add-to-list';
import 'dotenv/config';

const URL = "https://temp-mail.io/";
const BROWSERS = ['chromium', 'firefox', 'webkit'] as const;
const WAIT_TIMEOUT = { navigation: 1000, interaction: 500, waitFor: 5000 };

export default async function scrapeTempMailDomains() {
    console.log('Starting parallel scraping for temp-mail.io...');
    const domains = new Set<string>();

    // Process all browsers in parallel
    const results = await Promise.allSettled(
        BROWSERS.map(browserType => processBrowser(browserType))
    );

    // Combine results from all browsers
    for (const result of results) {
        if (result.status === 'fulfilled') {
            result.value.forEach(domain => domains.add(domain));
        }
    }

    processDomainsResults(domains);
}

async function processBrowser(browserType: typeof BROWSERS[number]) {
    const browserDomains = new Set<string>();
    const browser = await launchBrowserWithProxy(browserType);
    if (!browser) return browserDomains;

    try {
        const page = await navigateToPage(browser, URL);
        if (!page) return browserDomains;

        const extractedDomains = await extractDomainsFromPage(page);
        extractedDomains.forEach(domain => browserDomains.add(domain));
    } catch (error) {
        console.error(`Error processing ${browserType}:`, error);
    } finally {
        await browser.close();
    }

    return browserDomains;
}

async function launchBrowserWithProxy(browserType: typeof BROWSERS[number]) {
    try {
        console.log(`Launching browser: ${browserType}`);
        return await playwright[browserType].launch({
            proxy: {
                server: process.env.PROXY_SERVER!,
                username: process.env.PROXY_USER,
                password: process.env.PROXY_PASS
            }
        });
    } catch (error) {
        console.error(`Failed to launch ${browserType}:`, error);
        return null;
    }
}

async function navigateToPage(browser: playwright.Browser, url: string) {
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(WAIT_TIMEOUT.navigation);
        return page;
    } catch (error) {
        console.error('Navigation failed:', error);
        return null;
    }
}

async function extractDomainsFromPage(page: playwright.Page) {
    const domains = new Set<string>();

    try {
        // Click change email button
        await page.waitForSelector('button[data-original-title="Change email"]', { timeout: WAIT_TIMEOUT.waitFor });
        const changeEmailButton = await page.$('button[data-original-title="Change email"]');
        if (!changeEmailButton) {
            console.error('Change email button not found');
            return domains;
        }
        await changeEmailButton.click();
        await page.waitForTimeout(WAIT_TIMEOUT.interaction);

        // Click domain selector
        await page.waitForSelector('select[data-qa="selected-domain"]', { timeout: WAIT_TIMEOUT.waitFor });
        const changeSelector = await page.$('select[data-qa="selected-domain"]');
        if (!changeSelector) {
            console.error('Domain selector not found');
            return domains;
        }
        await changeSelector.click();
        await page.waitForTimeout(WAIT_TIMEOUT.interaction);

        // Extract domain options
        const options = await page.$$('button[data-qa="domain-option"]');
        if (!options.length) {
            console.error('No domain options found');
            return domains;
        }

        // Process each domain option
        for (const option of options) {
            const domainText = await option.innerText();
            if (domainText) {
                const normalizedDomain = domainText.trim().toLowerCase().replace('\\n', '');
                if (validateDomain(normalizedDomain)) {
                    domains.add(normalizedDomain);
                }
            }
        }
    } catch (error) {
        console.error('Domain extraction failed:', error);
    }

    return domains;
}

function processDomainsResults(domains: Set<string>) {
    if (domains.size === 0) {
        console.error('No valid domains found.');
        return;
    }

    const domainList = [...domains];
    console.log(`Found ${domainList.length} valid domains from temp-mail.io.`);
    console.log(`Domains: ${domainList.join(', ')}`);
    addToDisposableList(domainList);
}

if (require.main === module) {
    scrapeTempMailDomains().catch(error => {
        console.error('Scraping process failed:', error);
        process.exit(1);
    });
}
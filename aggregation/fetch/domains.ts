import { allowlist_txt, blacklists_txt, blacklists_json, blacklists_csv } from './aggregate-domains';
import fs from 'fs';
import validateDomain from '../utils/validate-domain';
import { addToDisposableList, addToAllowlist } from '../utils/add-to-list';

const INPUT_ALLOWLIST_PATH = './data/allow_list.txt'; // Path to the allowlist file

let allowlistSet: Set<string> = new Set<string>();
let disposables: Set<string> = new Set<string>();

async function fetchData(url: string, key: string | null, col: number | null): Promise<string[]> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }

        let lines;
        if (key) {
            const json = await response.json();
            if (key === '.') {
                lines = json;
            } else {
                lines = json[key];
            }
            return lines;
        }

        if (col) {
            const data = await response.text();
            lines = data.split('\n')
                .map((line: string) => line.trim().toLowerCase())
                .filter((line: string) => line && !line.startsWith('#'))
                .map((line: string) => {
                    const parts = line.split(',');
                    return parts[col].trim().toLowerCase().replaceAll(/"/g, '');
                });
            return lines;
        }

        const data = await response.text();
        lines = data.split('\n')
            .map((line: string) => line.trim().toLowerCase())
            .filter((line: string) => line && !line.startsWith('#'));
        return lines;

    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
}

async function fetchDomains() {
    // Load allowlist from file if it exists
    if (fs.existsSync(INPUT_ALLOWLIST_PATH)) {
        const allowlistContent = fs.readFileSync(INPUT_ALLOWLIST_PATH, 'utf-8');
        const allowlistLines = allowlistContent.split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .map(line => line.trim().toLowerCase());
        allowlistSet = new Set(allowlistLines);
    }

    // Fetch domains from allowlist URLs
    await Promise.all(allowlist_txt.map(async (url) => {
        const domains = await fetchData(url, null, null);
        domains.forEach(domain => {
            if (validateDomain(domain)) {
                allowlistSet.add(domain);
            }
        });
        console.log(`Fetched ${domains.length} domains from ${url}`);
    }));

    console.log(`Allowlist contains ${allowlistSet.size} domains.`);

    // Process blacklists (txt)
    await Promise.all(blacklists_txt.map(async (url) => {
        const domains = await fetchData(url, null, null);
        domains.forEach(domain => {
            if (validateDomain(domain) && !allowlistSet.has(domain)) {
                disposables.add(domain);
            }
        });
        console.log(`Fetched ${domains.length} domains from ${url}`);
    }));

    // Process blacklists (json)
    await Promise.all(blacklists_json.map(async ({ url, key }) => {
        const domains = await fetchData(url, key, null);
        domains.forEach(domain => {
            if (validateDomain(domain) && !allowlistSet.has(domain)) {
                disposables.add(domain);
            }
        });
        console.log(`Fetched ${domains.length} domains from ${url}`);
    }));

    // Process blacklists (csv)
    await Promise.all(blacklists_csv.map(async ({ url, col }) => {
        const domains = await fetchData(url, null, col);
        domains.forEach(domain => {
            if (validateDomain(domain) && !allowlistSet.has(domain)) {
                disposables.add(domain);
            }
        });
        console.log(`Fetched ${domains.length} domains from ${url}`);
    }));
}

(async () => {
    try {
        await fetchDomains();
        
        console.log(`Final allowlist contains ${allowlistSet.size} domains.`);
        console.log(`Final disposables list contains ${disposables.size} domains.`);

        console.log('Writing to file...');
        await Promise.all([
            addToDisposableList([...disposables]),
            addToAllowlist([...allowlistSet])
        ]);
        
        console.log('Done!');
    } catch (error) {
        console.error('Error in main execution:', error);
    }
})();
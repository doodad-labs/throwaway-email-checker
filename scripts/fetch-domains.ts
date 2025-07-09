import { allowlist_txt, blacklists_txt, blacklists_json, blacklists_csv } from './aggregate-domains';
import fs from 'fs';
import validateDomain from '../utils/validate-domain';
import addToList from '../utils/add-to-list';

const OUTPUT_FILE_PATH = './src/data/domains.ts'; // Output path for the generated TypeScript file
const OUTPUT_LIST_PATH = './data/domains.txt'; // Output path for the generated plain text file
const INPUT_ALLOWLIST_PATH = './data/allow_list.txt'; // Path to the allowlist file
let current_list_size = 0; // Variable to track the current size of the disposable email list

let allowlistSet: Set<string> = new Set<string>();
let disposables: Set<string> = new Set<string>();

async function fetchData(url: string, key: string | null, col: number | null): Promise<string[]> {

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }

        let lines;
        if (key) {
            const json = await response.json();

            if (key === '.') {
                lines = json
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

            return lines
        }

        const data = await response.text();
        lines = data.split('\n').map((line: string) => line.trim().toLowerCase()).filter((line: string) => line && !line.startsWith('#'));
        return lines;

    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
}

async function updateDomainList() {

    // Load allowlist from file if it exists
    if (fs.existsSync(INPUT_ALLOWLIST_PATH)) {
        const allowlistContent = fs.readFileSync(INPUT_ALLOWLIST_PATH, 'utf-8');
        const allowlistLines = allowlistContent.split('\n').map(line => line.trim().toLowerCase()).filter(line => line);
        allowlistSet = new Set(allowlistLines);
    }

    // Load the predefined allowlist and blacklists
    if (fs.existsSync(OUTPUT_LIST_PATH)) {
        const disposablesListContent = fs.readFileSync(OUTPUT_LIST_PATH, 'utf-8');
        const disposablesListLines = disposablesListContent.split('\n').filter(line => line.trim() && !line.startsWith('#')).map(line => line.trim().toLowerCase());
        disposables = new Set(disposablesListLines);
        current_list_size = disposablesListLines.length;
    }

    console.log(`Starting with ${disposables.size} disposable domains.`);

    await Promise.all([
        new Promise(async (res) => {
            for (const url of allowlist_txt) {
                const domains = await fetchData(url, null, null);
                domains.forEach(async (domain, i) => {
                    if (await validateDomain(domain)) {
                        allowlistSet.add(domain);
                    }

                    if (i === domains.length - 1) {
                        console.log(`Fetched ${domains.length} domains from ${url}`);
                        res([...disposables]);
                    }
                });
            }
        }),

        new Promise(async (res) => {
            for (const url of blacklists_txt) {
                const domains = await fetchData(url, null, null);
                domains.forEach(async (domain, i) => {
                    if (await validateDomain(domain) && !allowlistSet.has(domain)) {
                        disposables.add(domain);
                    }

                    if (i === domains.length - 1) {
                        console.log(`Fetched ${domains.length} domains from ${url}`);
                        res([...disposables]);
                    }
                });
            }
        }),

        new Promise(async (res) => {
            for (const { url, key } of blacklists_json) {
                const domains = await fetchData(url, key, null);
                domains.forEach(async (domain, i) => {
                    if (await validateDomain(domain) && !allowlistSet.has(domain)) {
                        disposables.add(domain);
                    }

                    if (i === domains.length - 1) {
                        console.log(`Fetched ${domains.length} domains from ${url}`);
                        res([...disposables]);
                    }
                })
            }
        }),

        new Promise(async (res) => {
            for (const { url, col } of blacklists_csv) {
                const domains = await fetchData(url, null, col);
                domains.forEach(async (domain, i) => {
                    if (await validateDomain(domain) && !allowlistSet.has(domain)) {
                        disposables.add(domain);
                    }

                    if (i === domains.length - 1) {
                        console.log(`Fetched ${domains.length} domains from ${url}`);
                        res([...disposables]);
                    }
                })
            }
        })
    ]).then((disposables) => {
        const concatenatedDomains = new Set(disposables.flat());
        console.log(concatenatedDomains)
    })

    return [...disposables]
}

function updateReadme(domains: string[]) {
    const readmePath = './README.md';
    if (!fs.existsSync(readmePath)) {
        console.error(`README.md not found at ${readmePath}`);
        return;
    }

    let readmeContent = fs.readFileSync(readmePath, 'utf-8');
    const lines = readmeContent.split('\n');
    const disposableCount = domains.length;

    // Update the disposable email database size in the README
    const marker = '<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->';
    const markerIndex = lines.findIndex(line => line.includes(marker));
    if (markerIndex !== -1) {
        // simply replace the number between the backticks
        const regex = /`(\d+)`|`([\d,]+)`/g;

        if (lines[markerIndex + 1].match(regex)) {
            lines[markerIndex + 1] = lines[markerIndex + 1].replace(regex, `\`${disposableCount.toLocaleString()}\``);
        }
    }

    // Write the updated content back to the README file
    
    try {
        fs.writeFileSync(readmePath, lines.join('\n'), 'utf-8');
        console.log(`README.md updated with disposable email database size: ${disposableCount}`);
    } catch (error) {
        console.error(`Failed to update README.md:`, error);
        return;
    }
}

(async () => {
    const domains = await updateDomainList()

    console.log('Data fetched successfully');
    console.log(`Allowlist contains ${allowlistSet.size} domains.`);
    console.log('Writing to file...');
    addToList(domains)
    updateReadme(domains)
})()
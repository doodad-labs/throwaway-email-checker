import { tldSet } from '../src/data/tlds'
import fs from 'fs';

const OUTPUT_FILE_PATH = './src/data/domains.ts'; // Output path for the generated TypeScript file
const OUTPUT_LIST_PATH = './data/domains.txt'; // Output path for the generated plain text file
const INPUT_ALLOWLIST_PATH = './data/allow_list.txt'; // Path to the allowlist file

let current_list_size = 0; // Variable to track the current size of the disposable email list

const allowlist_txt = [
    'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/allowlist.conf'
]

const blacklists_txt = [
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/refs/heads/master/domains.txt',
    'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/disposable_email_blocklist.conf',
    'https://raw.githubusercontent.com/7c/fakefilter/refs/heads/main/txt/data.txt',
    'https://raw.githubusercontent.com/wesbos/burner-email-providers/refs/heads/master/emails.txt'
]

const blacklists_json = [
    {
        'url': 'https://deviceandbrowserinfo.com/api/emails/disposable',
        'key': '.' // The key '.' indicates that the JSON structure is a flat array of strings
    },
    {
        'url': 'https://raw.githubusercontent.com/Propaganistas/Laravel-Disposable-Email/refs/heads/master/domains.json',
        'key': '.'
    }
]

let allowlistSet: Set<string> = new Set<string>();
let disposables: Set<string> = new Set<string>();

async function validateDomain(domain: string): Promise<boolean> {
    if (!domain || domain.length > 253) {
        return false;
    }

    // Check for leading/trailing dots or whitespace
    if (domain.startsWith('.') || domain.endsWith('.') || domain.trim() !== domain) {
        return false;
    }

    // Split domain into labels
    const labels = domain.split('.');
    if (labels.length < 2) {
        return false; // At least one subdomain and TLD required
    }

    // Validate TLD (last label)
    const tld = labels[labels.length - 1].toLowerCase();
    if (!tldSet.has(tld)) {
        return false;
    }

    // Validate each label
    const labelRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    for (const label of labels) {
        if (label.length > 63 || !labelRegex.test(label)) {
            return false;
        }
    }

    // Check for consecutive dots
    if (domain.includes('..')) {
        return false;
    }

    // Check for invalid characters
    if (/[^a-z0-9.-]/i.test(domain)) {
        return false;
    }

    return true;
}

async function fetchData(url: string, key: string | null): Promise<string[]> {

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

        } else {
            const data = await response.text();
            lines = data.split('\n').map((line: string) => line.trim().toLowerCase()).filter((line: string) => line && !line.startsWith('#'));
        }

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

    for (const url of allowlist_txt) {
        const domains = await fetchData(url, null);
        domains.forEach(async (domain) => {
            if (await validateDomain(domain)) {
                allowlistSet.add(domain);
            }
        });
    }

    for (const url of blacklists_txt) {
        const domains = await fetchData(url, null);
        domains.forEach(async (domain) => {
            if (await validateDomain(domain) && !allowlistSet.has(domain)) {
                disposables.add(domain);
            }
        });
    }

    for (const { url, key } of blacklists_json) {
        const domains = await fetchData(url, key);
        domains.forEach(async (domain) => {
            if (await validateDomain(domain) && !allowlistSet.has(domain)) {
                disposables.add(domain);
            }
        })
    }

    return [...disposables]
}

async function parseAndGenerateDomainFile(domains: string[]): Promise<void> {

    // Generate the TypeScript file content
    const fileContent = `
// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Data sourced from various disposable email domain lists
${allowlist_txt.map(url => `// - ${url}`).join('\n')}
${blacklists_txt.map(url => `// - ${url}`).join('\n')}
${blacklists_json.map(url => `// - ${url.url}`).join('\n')}
// Last updated: ${new Date().toISOString()}

/**
 * Array of disposable email domains.
 * @type {string[]}
 * @constant
 */
export const domainArray: string[] = [
${domains.map(domain => `\t"${domain}"`).join(',\n')}
];

/** 
 * Set of all disposable email domains.
 * This is used for quick O(1) lookups.
 * @type {Set<string>}
 * @constant
 */
export const domainSet: Set<string> = new Set(domainArray);
    `.trim();

    try {
        // Ensure the directory exists before writing
        await fs.promises.mkdir('./src/data', { recursive: true });
        // Write the generated content to file
        await fs.promises.writeFile(OUTPUT_FILE_PATH, fileContent);
        console.log(`Successfully generated Domain file at ${OUTPUT_FILE_PATH}`);
    } catch (error) {
        console.error('Failed to write Domain file:', error);
        throw error;
    }

    const txtContent = `# AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
# Data sourced from various disposable email domain lists
${allowlist_txt.map(url => `# - ${url}`).join('\n')}
${blacklists_txt.map(url => `# - ${url}`).join('\n')}
${blacklists_json.map(url => `# - ${url.url}`).join('\n')}
# Last updated: ${new Date().toISOString()}

${domains.join('\n')}`;

    try {
        // Ensure the directory exists before writing
        await fs.promises.mkdir('./data', { recursive: true });
        // Write the generated content to file
        await fs.promises.writeFile(OUTPUT_LIST_PATH, txtContent);
        console.log(`Successfully generated Domain file at ${OUTPUT_LIST_PATH}`);
    } catch (error) {
        console.error('Failed to write Domain file:', error);
        throw error;
    }
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

    console.log(lines)

    // Update the disposable email database size in the README
    const marker = '<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->';
    const markerIndex = lines.findIndex(line => line.includes(marker));
    if (markerIndex !== -1) {
        // simply replace the number between the backticks
        const regex = /`(\d+)`|`([\d,]+)`/g;

        console.log(lines[markerIndex + 1].match(regex))

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

updateDomainList().then((data) => {
    console.log('Data fetched successfully');
    console.log(`Allowlist contains ${allowlistSet.size} domains.`);
    console.log(`Disposables contains ${data.length} domains.`);
    console.log(`${data.length - current_list_size} new disposable domains added since last run.`);
    console.log('Writing to file...');
    parseAndGenerateDomainFile(data)
    updateReadme(data)
}).catch(err => {
    console.error('Error fetching data:', err);
});
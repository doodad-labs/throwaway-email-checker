import fs from 'fs';
import validateDomain from './validate-domain';
import { allowlist_txt, blacklists_txt, blacklists_json, blacklists_csv } from '../scripts/aggregate-domains';

const OUTPUT_FILE_PATH = './src/data/domains.ts'; // Output path for the generated TypeScript file
const OUTPUT_LIST_PATH = './data/domains.txt'; // Output path for the generated plain text file
const INPUT_ALLOWLIST_PATH = './data/allow_list.txt'; // Path to the allowlist file

let allowlistSet: Set<string> = new Set<string>();
let disposables: Set<string> = new Set<string>();
let current_list_size = 0; // Variable to track the current size of the disposable email list

export default async function(domains: string[]) {

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

    // Add new domains to the disposables set
    for (const domain of domains) {
        const normalizedDomain = domain.trim().toLowerCase();
        if (await validateDomain(normalizedDomain) && !allowlistSet.has(normalizedDomain)) {
            disposables.add(normalizedDomain);
        }
    }

    domains = [...disposables].sort((a, b) => a.localeCompare(b));

    console.log(`${domains.length - current_list_size} disposable email domains added.`);

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
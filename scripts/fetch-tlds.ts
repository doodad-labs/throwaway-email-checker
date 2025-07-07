import fs from 'fs';

const ICAAN_TLDS_URL = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'; // IANA's official TLD list URL
const OUTPUT_FILE_PATH = './src/data/tlds.ts'; // Output path for the generated TypeScript file
const TLD_VALIDATION_REGEX = /^[a-zA-Z0-9-]+$/; // Regular expression to validate TLD patterns (letters, numbers, and hyphens)

/**
 * Validates and processes TLDs, then generates a TypeScript file with validation functions.
 * @param tlds - Array of TLD strings to process
 * @throws Error if potential security issue is detected or file writing fails
 */
async function parseAndGenerateTldFile(tlds: string[]): Promise<void> {
    // Validate all TLDs match the expected pattern
    const validTlds = tlds.filter(tld => TLD_VALIDATION_REGEX.test(tld));

    // Security check: ensure no invalid TLDs slipped through
    if (validTlds.length !== tlds.length) {
        throw new Error(
        'Potential supply chain attack detected: Some TLDs contain invalid characters'
        );
    }

    // Generate the TypeScript file content
    const fileContent = `
// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// This file is regenerated whenever the TLD list is updated
// Last updated: ${new Date().toISOString()}

/**
 * Array of all valid top-level domains (TLDs).
 * Sourced from IANA's official list.
 */
export const tldArray: string[] = [
    ${tlds.map(tld => `"${tld}"`).join(',\n')}
];

/** 
 * Set of all valid top-level domains (TLDs).
 * This is used for quick O(1) lookups.
 * @type {Set<string>}
 * @constant
 */
export const tldSet: Set<string> = new Set(tldArray);
    `.trim();

    try {
        // Ensure the directory exists before writing
        await fs.promises.mkdir('./src/data', { recursive: true });
        // Write the generated content to file
        await fs.promises.writeFile(OUTPUT_FILE_PATH, fileContent);
        console.log(`Successfully generated TLD file at ${OUTPUT_FILE_PATH}`);
    } catch (error) {
        console.error('Failed to write TLD file:', error);
        throw error;
    }
}

/**
 * Fetches the latest TLD list from IANA's official source.
 * @returns Promise that resolves with the array of valid TLDs
 * @throws Error if the fetch fails or no TLDs are found
 */
async function fetchTldList(): Promise<string[]> {
    try {
        const response = await fetch(ICAAN_TLDS_URL);
        
        if (!response.ok) {
        throw new Error(`Failed to fetch TLDs: HTTP ${response.status}`);
        }

        const data = await response.text();
        const tlds = data
        .split('\n')
        .filter(tld => tld && !tld.startsWith('#')) // Remove empty lines and comments
        .map(tld => tld.trim().toLowerCase());     // Normalize to lowercase

        if (tlds.length === 0) {
        throw new Error('No valid TLDs found in the response');
        }

        console.log(`Successfully fetched ${tlds.length} TLDs from IANA`);
        return tlds;
    } catch (error) {
        console.error('Error fetching TLD list:', error);
        throw error;
    }
}

/**
 * Main execution function that orchestrates the TLD update process.
 */
async function updateTldList(): Promise<void> {
    try {
        console.log('Starting TLD list update...');
        const tlds = await fetchTldList();
        await parseAndGenerateTldFile(tlds);
        console.log('TLD list update completed successfully');
    } catch (error) {
        console.error('TLD list update failed:', error);
        process.exit(1); // Exit with error code for script usage
    }
}

// Execute the update process
updateTldList();
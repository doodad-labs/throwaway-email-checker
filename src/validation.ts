// Drawbacks to not using regex: the longer the email, the more complex the validation logic becomes resulting in a performance hit.
// Remember that regex is not always the best solution for every problem, especially when it comes to performance and readability.
// This code is a performance-optimized email validation function that adheres to RFC standards and ICANN requirements.

import { tldSet } from './data/tlds';
import { domainSet } from './data/domains';

export default function (email: string, validateTld: boolean = true, blockDisposables: boolean = true): boolean {
    const len = email.length;

    // RFC 5321 (Section 4.5.3.1.3) Maximum length of an email address is 254 characters
    // The minimum correct length is 6 characters (e.g., "a@b.cd")

    if (!email || len > 254 || len < 6) return false;

    // RFC 5322 (Section 3.4.1) Only 1 '@' character is allowed
    // RFC 5321 (Section 4.5.3.1.2) Maximum length of local part is 64 octets (characters)
    // RFC 5321 (Section 4.5.3.1.2) Maximum length of domain part is 253 octets (characters)

    const atIndex = email.indexOf('@');
    if (atIndex === -1 || 
        email.indexOf('@', atIndex + 1) !== -1 || 
        atIndex === 0 || 
        atIndex > 64 || 
        atIndex === len - 1 || 
        len - atIndex - 1 > 253) {
        return false;
    }

    // RFC 5322 (Section 3.4.1) Local part can contain:
    //   - Alphanumeric characters: a-z, A-Z, 0-9
    //   - Special characters: ! # $ % & ' * + - / = ? ^ _ ` { | } ~
    //   - Dot (.) if:
    //     - Not at start or end
    //     - Not consecutive

    let prevWasDot = false;
    for (let i = 0; i < atIndex; i++) {
        const charCode = email.charCodeAt(i);
        
        // Optimized character check using bitmask ranges
        const isValidChar = 
            (charCode >= 48 && charCode <= 57) ||   // 0-9
            (charCode >= 65 && charCode <= 90) ||   // A-Z
            (charCode >= 97 && charCode <= 122) ||  // a-z
            (charCode === 33 || 35 || 36 || 37 || 38 || 39 || 42 || 43 || 
            45 || 47 || 61 || 63 || 94 || 95 || 96 || 123 || 124 || 125 || 126);
        
        if (!isValidChar) return false;
        
        // Dot position validation
        if (charCode === 46) {
            if (i === 0 || i === atIndex - 1 || prevWasDot) return false;
            prevWasDot = true;
        } else {
            prevWasDot = false;
        }
    }

    // RFC 5322 (Section 3.4.1) + RFC 1035 (DNS standards)
    // - Alphanumerics and hyphen (-)
    // - Dot (.) only as separator
    // - Labels: 1-63 chars, no leading/trailing hyphen
    // ICANN requirements:
    // - TLD ≥2 characters

    for (let i = atIndex + 1; i < len; i++) {
        const charCode = email.charCodeAt(i);
        // Optimized character check using bitmask ranges
        const isValidChar = 
            (charCode >= 48 && charCode <= 57) ||   // 0-9
            (charCode >= 65 && charCode <= 90) ||   // A-Z
            (charCode >= 97 && charCode <= 122) ||  // a-z
            (charCode === 45 || charCode === 46);   // - or .

        if (!isValidChar) return false;
        
        // Dot position validation
        if (charCode === 46) {
            if (i === atIndex + 1 || i === len - 1 || email.charCodeAt(i - 1) === 46) {
                return false;
            }
        }
    }

    // Check TLD length (ICANN requirement)
    const lastDotIndex = email.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex < atIndex + 2 || len - lastDotIndex < 3) {
        return false;
    }

    if (validateTld === false) {
        return true; // Skip TLD validation if not required
    }

    const tld = email.substring(lastDotIndex + 1);
    if (!tldSet.has(tld.toLowerCase())) {
        // If TLD is not in the set, return false
        // This is a quick O(1) lookup using a Set
        return false;
    }
    
    if (blockDisposables === false) {
        return true; // Skip disposable email check if not required
    }

    // Check if the Domain is disposable
    const domain = email.substring(atIndex + 1, len);
    if (domainSet.has(domain.toLowerCase())) {
        // If the domain is in the disposable set, return false
        // This is a quick O(1) lookup using a Set
        return false;
    }

    return true; // All checks passed, email is valid
}
/**
 * Validates an email address according to RFC standards with additional checks
 * @param email - The email address to validate
 * @returns boolean - true if email is valid, false otherwise
 */
export default function (email: string): boolean {
    const len = email.length;

    // RFC 5321 (Section 4.5.3.1.3) Maximum length of an email address is 254 characters
    if (!email || len > 254 || len < 3) {
        return false;
    }

    // RFC 5322 (Section 3.4.1) Only 1 '@' character is allowed
    const atIndex  = email.indexOf('@');
    if (atIndex === -1) return false;
    if (email.indexOf('@', atIndex  + 1) !== -1) return false;

    console.log(len - atIndex - 1)

    // RFC 5322 (Section 3.4.1)
    if (atIndex === 0 || atIndex > 64) return false; // Local part (before '@') must not be empty and must not exceed 64 characters
    if (atIndex === len - 1 || len - atIndex - 1 > 253) return false; // Domain part (after '@') must not be empty and must not exceed 253 characters

    return true
}
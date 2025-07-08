import { performance } from 'perf_hooks';
import validation from 'throwaway-email';
import { isValidEmail } from '@shelf/is-valid-email-address'
import validator from 'email-validator';

function convertMs(ms: number): string {
    // Ensure input is a number and non-negative
    if (typeof ms !== 'number' || ms < 0) {
        return "Invalid input: Please provide a non-negative number";
    }

    // Define thresholds for each unit
    const min = 60 * 1000; // 60,000 ms
    const s = 1000; // 1,000 ms
    const msThreshold = 1; // 1 ms
    const µs = 0.001; // 1 ms = 1,000 microseconds
    const ns = 0.000001; // 1 ms = 1,000,000 nanoseconds

    // Convert and format based on magnitude
    if (ms >= min) {
        const minutes = (ms / min).toFixed(2);
        return `${minutes}min`;
    } else if (ms >= s) {
        const seconds = (ms / s).toFixed(2);
        return `${seconds}s`;
    } else if (ms >= msThreshold) {
        const milliseconds = ms.toFixed(2);
        return `${milliseconds}ms`;
    } else if (ms >= µs) {
        const microseconds = (ms / µs).toFixed(2);
        return `${microseconds}µs`;
    } else {
        const nanoseconds = (ms / ns).toFixed(2);
        return `${nanoseconds}ns`;
    }
}

const testEmails = [
    "local@domain.com",
    "local@domain.co.uk",
    "local@subdomain.domain.co.uk",
    `${"a".repeat(64)}@domain.com`,
    `a@${"b".repeat(253-5)}.com`,
    ".local@domain.com",
    "local.@domain.com",
    "$local@domain.com",
    "lo..cal@domain.com",
    "lo.cal@domain.com",
    "local@domain..com",
    "local@domain.c",
    "email@example.com",
    "firstname.lastname@example.com",
    "email@subdomain.example.com",
    "firstname+lastname@example.com",
    "email@123.123.123.123",
    "\"email\"@example.com",
    "1234567890@example.com",
    "email@example-one.com",
    "_______@example.com",
    "email@example.name",
    "email@example.museum",
    "email@example.co.jp",
    "firstname-lastname@example.com",
    "much.”more\\ unusual”@example.com",
    "very.unusual.”@”.unusual.com@example.com",
];

const runs = 10_000_000
let ourValidation = 0
let emailValidator = 0
let shelfValidator = 0;

console.log(`\nBenchmarking ${runs.toLocaleString()} runs...`);

for (let i = 0; i < runs; i++) {
    const email = testEmails[i++ % testEmails.length]

    let start = performance.now();
    validation(email);
    ourValidation += performance.now() - start;

    start = performance.now();
    validator.validate(email);
    emailValidator += performance.now() - start;

    start = performance.now();
    isValidEmail(email);
    shelfValidator += performance.now() - start;
}

console.log(`Our Email Validator: \t\t\t\tavg: ${convertMs(ourValidation / runs)}`);
console.log(`npmjs.com/email-validator: \t\t\tavg: ${convertMs(emailValidator / runs)}`);
console.log(`npmjs.com/@shelf/is-valid-email-address: \tavg: ${convertMs(shelfValidator / runs)}`);
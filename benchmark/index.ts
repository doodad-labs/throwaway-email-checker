import { performance } from 'perf_hooks';
import validation from '../src/validation';

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

const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const twoDotsRegex = /\.{2,}/g;
const domainRegex = /([\da-z.-]+)(\.)((?!.*\.$)[a-z.]{2,6})/g;
const localPartRegex = /.+(?=@)/;
const dotsOnEdgesRegex = /^[.]|[.]$/g;
const quotedRegEx = /^"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"$/g;
const quotedElementsRegEx = /"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"/g;
const unquotedRegex = /^[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+|^(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+/g;

function npmjs_com_email_validator(email: string): boolean {
    if (!email)

        return false;



    if (email.length > 254)

        return false;



    var valid = tester.test(email);

    if (!valid)

        return false;



    // Further checking of some things regex can't handle

    var parts = email.split("@");

    if (parts[0].length > 64)

        return false;



    var domainParts = parts[1].split(".");

    if (domainParts.some(function (part) { return part.length > 63; }))

        return false;

    return true;
}

function npmjs_com_shelf_is_valid_email_address(email: string): boolean {
    if (email.match(twoDotsRegex)) {

        return false;

    }

    const domainPart = email.replace(localPartRegex, '');

    if (!domainPart.match(domainRegex)) {

        return false;

    }

    const localPartMatch = email.match(localPartRegex);

    if (!localPartMatch) {

        return false;

    }

    const localPart = localPartMatch[0];

    if (localPart.match(dotsOnEdgesRegex)) {

        return false;

    }

    const quotedParts = email.match(/".+?"/g);

    if (quotedParts && !quotedParts.every(item => item.match(quotedRegEx)?.length)) {

        return false;

    }

    const unquotedPart = quotedParts ? localPart.replaceAll(quotedElementsRegEx, '') : localPart;

    if (unquotedPart === '') {

        return true;

    }

    const unquotedPartMatch = unquotedPart && unquotedPart.match(unquotedRegex);

    if (unquotedPartMatch === null ||

        unquotedPartMatch?.reduce((acc, item) => acc.replace(item, ''), unquotedPart)

            .length) {

        return false;

    }

    return true;
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

const runs = 1_000_000
let ourValidation = 0
let emailValidator = 0
let shelfValidator = 0;

for (let i = 0; i < runs; i++) {
    const email = testEmails[i++ % testEmails.length]

    let start = performance.now();
    validation(email);
    ourValidation += performance.now() - start;

    start = performance.now();
    npmjs_com_email_validator(email);
    emailValidator += performance.now() - start;

    start = performance.now();
    npmjs_com_shelf_is_valid_email_address(email);
    shelfValidator += performance.now() - start;
}

console.log(`\nBenchmarking ${runs.toLocaleString()} runs...`);
console.log(`Our Email Validator: \t\t\t\ttotal: ${convertMs(ourValidation)}, avg: ${convertMs(ourValidation / runs)}`);
console.log(`npmjs.com/email-validator: \t\t\ttotal: ${convertMs(emailValidator)}, avg: ${convertMs(emailValidator / runs)}`);
console.log(`npmjs.com/@shelf/is-valid-email-address: \ttotal: ${convertMs(shelfValidator)}, avg: ${convertMs(shelfValidator / runs)}`);
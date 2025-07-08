import { domainArray, domainSet } from "throwaway-email";

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

export function isValidDomain(domain: string): boolean {
    return domainSet.has(domain);
}

const oneHundredRandomDomains = Array.from({ length: 100 }, () => {
    const randomIndex = Math.floor(Math.random() * domainArray.length);
    return domainArray[randomIndex];
});

const runs = 10_000_000
let ourValidation = 0

console.log(`\nBenchmarking ${runs.toLocaleString()} runs...`);

for (let i = 0; i < runs; i++) {
    const domain = oneHundredRandomDomains[i++ % oneHundredRandomDomains.length]

    let start = performance.now();
    domainSet.has(domain);
    ourValidation += performance.now() - start;
}

console.log(`Our Email Validator: \t\t\t\tavg: ${convertMs(ourValidation / runs)}`);
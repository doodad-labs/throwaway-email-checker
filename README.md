# Throwaway - The Fastest Email Validator & Disposable Email Checker

A high-performance email validation library featuring real-time disposable email detection. Our database is continuously updated through automated aggregation of disposable domains from trusted community sources.

<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->
**`72,144`** known disposable domains detected.

## Usage

While this is primarily a Node.js package, you can also access the raw disposable domain list directly at: 📁 [data/domains.txt](data/domains.txt)

### Installation
```bash
npm install throwaway
```

### Basic Validation
```ts
import validEmail from 'throwaway';

// Standard validation (TLD + Disposable check)
validEmail("johndoe@gmail.com")    // true
validEmail("johndoe@gmail.con")    // false (invalid TLD)
validEmail("johndoe@dispose.it")   // false (disposable domain)
validEmail("john..doe@gmail.com")  // false (invalid local part per RFC 5322)
```

### Advanced Options
```ts
// Disable ICANN TLD validation (still requires ≥2 character TLD)
validEmail("johndoe@gmail.con", false)  // true
validEmail("johndoe@gmail.c", false)    // false (TLD too short)

// Disable disposable domain check
validEmail("johndoe@dispose.it", true, false)    // true
validEmail("john..doe@dispose.it", true, false)  // false (invalid local part)
```

### Parameter Reference
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `checkTld` | boolean | `true` | Verify ICANN-approved TLDs |
| `checkDisposable` | boolean | `true` | Check against disposable domains |

## Benchmarking

All benchmarks were measured over 10 million runs (averaged), executing each package according to its official documentation. Tests were conducted from an imported state to reflect real-world usage. All runs used the same inputs. You can verify these results by running the benchmarking script: [`benchmark/index.ts`](https://github.com/doodad-labs/throwaway-email-checker/blob/main/benchmark/index.ts).

| Package | Avg. Time (per validation) | Validation Logic |
|---------|----------------------------|------------------|
| **[throwaway](https://github.com/doodad-labs/throwaway-email-checker)** | **155.73 ns** | • Local part validation<br>• Domain validation<br>• RFC compliance checks<br>• TLD validation<br>• ICANN verification<br>• 70,000+ domain blacklist check |
| [email-validator](https://npmjs.com/email-validator) | 180.47 ns | • Regex pattern matching<br>• Length verification |
| [@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address) | 404.70 ns | • Local part regex<br>• Domain regex<br>• Quoted string check |

### Key Findings:
1. **throwaway** demonstrates superior performance (13.7% faster than [email-validator](https://npmjs.com/email-validator), 61.5% faster than [@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address))
2. **throwaway** provides more comprehensive validation features while maintaining better performance
3. The benchmark reflects real-world usage patterns by testing from imported module state

## Reporting Incorrectly Flagged Domains

If you believe a legitimate domain has been mistakenly identified as disposable, you can help improve the validator by contributing to our allow list.

**How to contribute:**
1. Verify the domain is truly non-disposable (permanent email service)
2. Add the domain to [`allow_list.txt`](./data/allow_list.txt)
3. Submit a pull request with your addition

We welcome community contributions to help maintain the accuracy of our validation system.

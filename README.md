## Throwaway - Fastest email validation and disposable checker

A lightning fast email validation and disposable email checker. powered by automated aggregation of disposable emails from actively contributed lists.

<br>

<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->
**Current Disposable Email Domain List Size: `72,144`** \
<sub>This value is automatically updated.</sub>

<br>

## Usage

```
npm i throwaway
```

```ts

import validEmail from 'throwaway'

// Full Email validation (TLD + Disposable)
validEmail("johndoe@gmail.com")   // true
validEmail("johndoe@gmail.con")   // false - the TLD is'nt ICANN valid
validEmail("johndoe@dispose.it")  // false - the domain is disposable
validEmail("john..doe@gmail.com") // false - the local part isnt RFC 5322 compliant

// Disable ICANN TLD (top level domain) validation
validEmail("johndoe@gmail.con", false)  // true - disable ICANN TLD validation
validEmail("johndoe@gmail.c", false)    // false - the TLD is'nt valid since TLDS must be >= 2

// Disable Disposable Domain Filter
validEmail("johndoe@dispose.it", true, false)    // true
validEmail("john..doe@dispose.it", true, false)  // false - the local part isnt RFC 5322 compliant

```

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


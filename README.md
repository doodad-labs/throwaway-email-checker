# Throwaway - The Fastest Email Validator & Disposable Email Checker

A high-performance email validation library featuring real-time disposable email detection. Our database is continuously updated through automated aggregation of disposable domains from trusted community sources.

<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->
Currently **`183,483`** known disposable domains detected, this updates every week.

*This project automatically maintains its disposable email domain list through workflows and scraping, but relies on open-source contributions to keep scrapers and filters up-to-date—[learn how to help](#contributions).*

## Usage

While this is primarily a Node.js package, you can also access the raw disposable domain list directly at: 📁 [data/domains.txt]([data/domains.txt](https://raw.githubusercontent.com/doodad-labs/throwaway-email-checker/refs/heads/main/data/domains.txt))

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


## License and Ethical Usage

```
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
```  
[Full License Text](https://github.com/doodad-labs/throwaway-email-checker/blob/main/LICENSE)

### Open-Source Commitment
This project is released under the **GPL-3.0 license**, which grants you the freedom to:
- Use commercially  
- Modify and distribute  
- Apply for patent integration  

**With the critical requirement that you:**  
1. Disclose all modifications to the source code.  
2. Keep derivative works equally open under GPL-3.0.  

### Ethical Request
While the license permits commercial use, I strongly believe:  
🔓 **Data about disposable email domains should remain a public good**—free to access, analyze, and redistribute. If you profit from this work:  
- **Publicly credit** this project (`doodad-labs/throwaway-email-checker`).  
- **Never paywall** the core dataset or derived lists.  

This ensures transparency and helps protect the internet from abuse.  

## Contributions  

This project is **automatically maintained** through web scraping and data aggregation, but our sources may become outdated, and some domains might be incorrectly flagged. **We need your help** to improve accuracy and keep this resource reliable!  

### 🚀 First-Time Contributors Welcome!  
We intentionally keep this project **beginner-friendly** to help newcomers start their open-source journey. No experience needed—just a willingness to learn!  

### How You Can Help:  

#### 🌍 **Translations**  
Help make this project accessible globally by translating documentation or UI elements.  

#### ✅ **Fix False Flags** (`allow_list.txt`)  
If you spot a legitimate domain mistakenly flagged as disposable, submit a correction.  

#### 📊 **Improve Data Sources**  
- **Aggregate lists**: Contribute new sources of disposable email domains.  
- **Scrapers**: Help maintain or improve our scrapers for temporary email providers.  

#### 🐛 **Report Bugs & Suggest Enhancements**  
Found an issue? Open a ticket or submit a fix!  

### Getting Started:  
1. Check the [Good First Issues](https://github.com/doodad-labs/throwaway-email-checker/contribute) label.  
2. Follow our [Contribution Guidelines](LINK_TO_GUIDELINES).  

**Every contribution—big or small—helps keep the internet safer and more transparent!**  


![](https://contrib.nn.ci/api?repo=doodad-labs/throwaway-email-checker)

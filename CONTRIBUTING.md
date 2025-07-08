# Introduction  

**Thank you for helping keep disposable email data open and accurate!** This project automatically tracks throwaway domains through scraping and workflows, but we rely on contributors like you to:  
- Fix false positives in `allow_list.txt`  
- Maintain scrapers as email providers change  
- Expand coverage of new disposable services  

[Learn how to contribute →](#your-first-contribution)  

### Why Guidelines Matter  
Following these standards helps us efficiently review your contributions while keeping the dataset reliable for everyone.  

---

# Ground Rules  
- **Test changes** – Verify scrapers still work and domains are correctly classified  
- **Keep it focused** – One issue/pull request per problem or feature  
- **Document updates** – Comment code changes and update docs if needed  
- **Be respectful** – We follow the [Contributor Covenant](https://www.contributor-covenant.org/)  

---

# Your First Contribution  
New to open source? Start with:  
- **Beginner-friendly tasks**: Fixing typos, adding test cases, or improving docs  
- **Help wanted**: Updating scrapers or reviewing `allow_list.txt` entries  

*First-time guide*: [How to Contribute on GitHub](https://opensource.guide/how-to-contribute/)  

---

# How to Report Issues  
**Security vulnerabilities**: Email `security@yourdomain.com` (do not open an issue).  

For bugs:  
1. Check if the domain is already in `allow_list.txt`  
2. Include:  
   ```  
   - Domain causing the issue  
   - Expected behavior vs actual result  
   - Scraper/logs showing the problem  
   ```  

---

# Suggesting Improvements  
We prioritize:  
- Scraper reliability fixes  
- Efficiency improvements for bulk validation  
- Documentation/tutorials  

*Before proposing features*:  
1. Search existing issues  
2. Explain the use case and impact  

---

# Code Review Process  
1. Automated checks (tests/linting) run immediately  
2. Core team reviews weekly  
3. Expect feedback within 7 days  
4. Approved PRs are merged and deployed automatically  

---

# Technical Standards  
- **Code**: TypeScript with strict linting ([eslint-config](link))  
- **Commits**: Conventional commits (`fix:`, `feat:`, etc.)  
- **Labels**: `bug`, `scraper`, `false-positive`, `good-first-issue`  

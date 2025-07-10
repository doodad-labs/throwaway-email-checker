# Throwaway - 最快的邮箱验证器 & 临时邮箱检测工具

[Translation](../README.md) | [traducción](./README.es-ES.md)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/scrape-domains.yml?style=flat-square&label=域名抓取)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/fetch-domains.yml?style=flat-square&label=域名获取)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/fetch-tlds.yml?style=flat-square&label=TLD获取)
![GitHub License](https://img.shields.io/github/license/doodad-labs/throwaway-email-checker?style=flat-square)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/throwaway-email?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/throwaway-email?style=flat-square)

一个高性能的邮箱验证库，具有实时检测临时邮箱的功能。我们的数据库通过自动化收集来自可信社区来源的临时邮箱域名持续更新。

<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->
目前已检测到 **`183,515`** 个已知临时邮箱域名，定期更新。

*本项目通过自动化工作流和抓取维护临时邮箱域名列表，但依赖开源贡献来保持抓取器和过滤器的更新——[了解如何帮助](#contributions)。*

## 安装 & 使用

虽然这主要是一个Node.js包，你也可以直接访问原始临时邮箱域名列表：📁 [data/domains.txt](https://raw.githubusercontent.com/doodad-labs/throwaway-email-checker/refs/heads/main/data/domains.txt)

### 安装
```bash
# 请确保使用@latest，因为这个包每周都会更新
npm install throwaway-email@latest
```

### 基础验证
```ts
import validEmail from 'throwaway-email';

// 标准验证（TLD + 临时邮箱检查）
validEmail("johndoe@gmail.com")    // true
validEmail("johndoe@gmail.con")    // false (无效TLD)
validEmail("johndoe@dispose.it")   // false (临时邮箱域名)
validEmail("john..doe@gmail.com")  // false (根据RFC 5322无效的本地部分)
```

### 高级选项
```ts
// 禁用ICANN TLD验证（仍需要≥2个字符的TLD）
validEmail("johndoe@gmail.con", false)  // true
validEmail("johndoe@gmail.c", false)    // false (TLD太短)

// 禁用临时邮箱检查
validEmail("johndoe@dispose.it", true, false)    // true
validEmail("john..doe@dispose.it", true, false)  // false (无效的本地部分)
```

### 参数参考
| 参数 | 类型 | 默认值 | 描述 |
|-----------|------|---------|-------------|
| `checkTld` | boolean | `true` | 验证ICANN批准的TLD |
| `checkDisposable` | boolean | `true` | 检查临时邮箱域名 |

## 性能测试

所有基准测试均通过1000万次运行（取平均值）测量，按照各包的官方文档执行。测试从导入状态开始以反映实际使用情况。所有运行使用相同的输入。你可以通过运行基准测试脚本验证这些结果：[`benchmark/index.ts`](https://github.com/doodad-labs/throwaway-email-checker/blob/main/benchmark/index.ts)。

| 包 | 平均时间（每次验证） | 验证逻辑 |
|---------|----------------------------|------------------|
| **[throwaway](https://github.com/doodad-labs/throwaway-email-checker)** | **155.73 ns** | • 本地部分验证<br>• 域名验证<br>• RFC合规检查<br>• TLD验证<br>• ICANN验证<br>• 180,000+域名黑名单检查 |
| [email-validator](https://npmjs.com/email-validator) | 180.47 ns | • 正则表达式匹配<br>• 长度验证 |
| [@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address) | 404.70 ns | • 本地部分正则<br>• 域名正则<br>• 引号字符串检查 |

### 主要发现：
1. **throwaway** 展现出卓越的性能（比[email-validator](https://npmjs.com/email-validator)快13.7%，比[@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address)快61.5%）
2. **throwaway** 提供更全面的验证功能同时保持更好的性能
3. 基准测试通过从导入模块状态测试来反映实际使用模式

## 报告错误标记的域名

如果你认为一个合法域名被错误地识别为临时邮箱，你可以通过贡献到我们的允许列表来帮助改进验证器。

**如何贡献：**
1. 确认该域名确实是永久邮箱服务
2. 将域名添加到[`allow_list.txt`](./data/allow_list.txt)
3. 提交一个包含你添加内容的pull request

我们欢迎社区贡献来帮助维护我们验证系统的准确性。

## 许可证和道德使用

```
GNU通用公共许可证
版本3，2007年6月29日
```  
[完整许可证文本](https://github.com/doodad-labs/throwaway-email-checker/blob/main/LICENSE)

### 开源承诺
本项目采用**GPL-3.0许可证**发布，授予您以下自由：
- 商业使用  
- 修改和分发  
- 专利集成  

**但关键要求您：**  
1. 公开所有对源代码的修改。  
2. 保持衍生作品同样以GPL-3.0开放。  

### 道德请求
虽然许可证允许商业用途，但我强烈认为：  
🔓 **关于临时邮箱域名的数据应该保持为公共资源**——可自由访问、分析和重新分发。如果您从本作品中获利：  
- **公开致谢**本项目(`doodad-labs/throwaway-email-checker`)。  
- **绝不对核心数据集或衍生列表设置付费墙**。  

这确保了透明度，并有助于保护互联网免受滥用。  

## 贡献  

本项目通过网页抓取和数据聚合**自动维护**，但我们的来源可能会过时，某些域名可能会被错误标记。**我们需要您的帮助**来提高准确性并保持这一资源的可靠性！  

### 🚀 欢迎首次贡献者！  
我们特意保持本项目**对新手友好**，以帮助开源新手开始他们的旅程。无需经验——只需学习的意愿！  

### 您可以帮助的方式：  

#### 🌍 **翻译**  
通过翻译文档或UI元素帮助使本项目全球化。  

#### ✅ **修复错误标记** (`allow_list.txt`)  
如果您发现一个合法域名被错误标记为临时邮箱，请提交更正。  

#### 📊 **改进数据源**  
- **聚合列表**：贡献新的临时邮箱域名来源。  
- **抓取器**：帮助维护或改进临时邮箱提供商的抓取器。  

#### 🐛 **报告错误和建议改进**  
发现问题？提交工单或修复！  

### 如何开始：  
1. 查看[Good First Issues](https://github.com/doodad-labs/throwaway-email-checker/contribute)标签。  
2. 遵循我们的[贡献指南](CONTRIBUTING.md)。  

**每一个贡献——无论大小——都有助于保持互联网更安全、更透明！**  

![](https://contrib.nn.ci/api?repo=doodad-labs/throwaway-email-checker)

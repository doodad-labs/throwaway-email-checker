> [!WARNING]  
> Este paquete se encuentra actualmente en sus primeras etapas y algunos dominios pueden ser marcados incorrectamente. **Necesitamos urgentemente colaboradores** para ayudar a mejorar la lista de permitidos.

# Throwaway - El Validador de Emails Más Rápido y Detector de Correos Desechables

[简体中文版](./README.zh-CN.md) | [Translation](../README.md)

![Estado de GitHub Actions](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/scrape-domains.yml?style=flat-square&label=Extracción%20de%20Dominios)
![Estado de GitHub Actions](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/fetch-domains.yml?style=flat-square&label=Obtención%20de%20Dominios)
![Estado de GitHub Actions](https://img.shields.io/github/actions/workflow/status/doodad-labs/throwaway-email-checker/fetch-tlds.yml?style=flat-square&label=Obtención%20de%20TLDs)
![Licencia GitHub](https://img.shields.io/github/license/doodad-labs/throwaway-email-checker?style=flat-square)
![Tamaño NPM](https://img.shields.io/npm/unpacked-size/throwaway-email?style=flat-square)
![Versión NPM](https://img.shields.io/npm/v/throwaway-email?style=flat-square)

Una biblioteca de validación de correos electrónicos de alto rendimiento con detección en tiempo real de correos desechables. Nuestra base de datos se actualiza continuamente mediante la agregación automatizada de dominios desechables de fuentes comunitarias confiables.

<!-- disposable database size: the number between the backticks on the next line will be automatically updated -->
Actualmente se detectan **`183,515`** dominios desechables conocidos, esto se actualiza regularmente.

*Este proyecto mantiene automáticamente su lista de dominios de correo desechable mediante flujos de trabajo y scraping, pero depende de contribuciones de código abierto para mantener actualizados los scrapers y filtros—[aprende cómo ayudar](#contributions).*

## Instalación y Uso

Aunque es principalmente un paquete de Node.js, también puedes acceder directamente a la lista de dominios desechables en: 📁 [data/domains.txt](https://raw.githubusercontent.com/doodad-labs/throwaway-email-checker/refs/heads/main/data/domains.txt)

### Instalación
```bash
# asegúrate de usar @latest ya que este paquete se actualiza semanalmente
npm install throwaway-email@latest
```

### Validación Básica
```ts
import validEmail from 'throwaway-email';

// Validación estándar (TLD + verificación de desechable)
validEmail("johndoe@gmail.com")    // true
validEmail("johndoe@gmail.con")    // false (TLD inválido)
validEmail("johndoe@dispose.it")   // false (dominio desechable)
validEmail("john..doe@gmail.com")  // false (parte local inválida según RFC 5322)
```

### Opciones Avanzadas
```ts
// Desactivar validación de TLD ICANN (aún requiere TLD de ≥2 caracteres)
validEmail("johndoe@gmail.con", false)  // true
validEmail("johndoe@gmail.c", false)    // false (TLD demasiado corto)

// Desactivar verificación de dominios desechables
validEmail("johndoe@dispose.it", true, false)    // true
validEmail("john..doe@dispose.it", true, false)  // false (parte local inválida)
```

### Referencia de Parámetros
| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|---------|-------------|
| `checkTld` | boolean | `true` | Verifica TLDs aprobados por ICANN |
| `checkDisposable` | boolean | `true` | Verifica contra dominios desechables |

## Pruebas de Rendimiento

Todos los benchmarks se midieron en 10 millones de ejecuciones (promediadas), ejecutando cada paquete según su documentación oficial. Las pruebas se realizaron desde un estado importado para reflejar el uso en el mundo real. Todas las ejecuciones usaron las mismas entradas. Puedes verificar estos resultados ejecutando el script de benchmark: [`benchmark/index.ts`](https://github.com/doodad-labs/throwaway-email-checker/blob/main/benchmark/index.ts).

| Paquete | Tiempo Promedio (por validación) | Lógica de Validación |
|---------|----------------------------|------------------|
| **[throwaway](https://github.com/doodad-labs/throwaway-email-checker)** | **155.73 ns** | • Validación de parte local<br>• Validación de dominio<br>• Comprobaciones de conformidad RFC<br>• Validación de TLD<br>• Verificación ICANN<br>• Verificación de lista negra con 180,000+ dominios |
| [email-validator](https://npmjs.com/email-validator) | 180.47 ns | • Coincidencia de patrones Regex<br>• Verificación de longitud |
| [@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address) | 404.70 ns | • Regex para parte local<br>• Regex para dominio<br>• Comprobación de cadenas entre comillas |

### Hallazgos Clave:
1. **throwaway** demuestra un rendimiento superior (13.7% más rápido que [email-validator](https://npmjs.com/email-validator), 61.5% más rápido que [@shelf/is-valid-email-address](https://npmjs.com/@shelf/is-valid-email-address))
2. **throwaway** proporciona funciones de validación más completas manteniendo un mejor rendimiento
3. El benchmark refleja patrones de uso real probando desde el estado del módulo importado

## Reportar Dominios Marcados Incorrectamente

Si crees que un dominio legítimo ha sido identificado erróneamente como desechable, puedes ayudar a mejorar el validador contribuyendo a nuestra lista de permitidos.

**Cómo contribuir:**
1. Verifica que el dominio sea realmente un servicio de correo permanente
2. Añade el dominio a [`allow_list.txt`](./data/allow_list.txt)
3. Envía un pull request con tu adición

Agradecemos las contribuciones de la comunidad para ayudar a mantener la precisión de nuestro sistema de validación.

## Licencia y Uso Ético

```
LICENCIA PÚBLICA GENERAL GNU
Versión 3, 29 de junio de 2007
```  
[Texto Completo de la Licencia](https://github.com/doodad-labs/throwaway-email-checker/blob/main/LICENSE)

### Compromiso de Código Abierto
Este proyecto se publica bajo la **licencia GPL-3.0**, que te otorga la libertad de:
- Usar comercialmente  
- Modificar y distribuir  
- Solicitar integración de patentes  

**Con el requisito crítico de que:**  
1. Divulgues todas las modificaciones al código fuente.  
2. Mantengas los trabajos derivados igualmente abiertos bajo GPL-3.0.  

### Solicitud Ética
Aunque la licencia permite uso comercial, creo firmemente que:  
🔓 **Los datos sobre dominios de correo desechable deben seguir siendo un bien público**—libres para acceder, analizar y redistribuir. Si obtienes beneficios de este trabajo:  
- **Reconoce públicamente** este proyecto (`doodad-labs/throwaway-email-checker`).  
- **Nunca pongas detrás de un muro de pago** el conjunto de datos principal o listas derivadas.  

Esto asegura transparencia y ayuda a proteger internet del abuso.  

## Contribuciones  

Este proyecto se **mantiene automáticamente** mediante web scraping y agregación de datos, pero nuestras fuentes pueden quedar obsoletas y algunos dominios podrían marcarse incorrectamente. **¡Necesitamos tu ayuda** para mejorar la precisión y mantener este recurso confiable!  

### 🚀 ¡Contribuidores Primerizos Bienvenidos!  
Mantenemos este proyecto **accesible para principiantes** para ayudar a los recién llegados a comenzar su viaje en el código abierto. No se necesita experiencia—¡solo voluntad para aprender!  

### Cómo Puedes Ayudar:  

#### 🌍 **Traducciones**  
Ayuda a hacer este proyecto accesible globalmente traduciendo documentación o elementos de UI.  

#### ✅ **Corregir Marcaciones Erróneas** (`allow_list.txt`)  
Si ves un dominio legítimo marcado erróneamente como desechable, envía una corrección.  

#### 📊 **Mejorar Fuentes de Datos**  
- **Agregar listas**: Contribuye con nuevas fuentes de dominios de correo desechable.  
- **Scrapers**: Ayuda a mantener o mejorar nuestros scrapers para proveedores de correo temporal.  

#### 🐛 **Reportar Errores y Sugerir Mejoras**  
¿Encontraste un problema? Abre un ticket o envía una corrección.  

### Cómo Empezar:  
1. Revisa la etiqueta [Good First Issues](https://github.com/doodad-labs/throwaway-email-checker/contribute).  
2. Sigue nuestras [Guías de Contribución](CONTRIBUTING.md).  

**¡Cada contribución—grande o pequeña—ayuda a mantener internet más seguro y transparente!**  

![](https://contrib.nn.ci/api?repo=doodad-labs/throwaway-email-checker)

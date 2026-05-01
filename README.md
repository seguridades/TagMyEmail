# TagMyEmail

**TagMyEmail** es una extensión de navegador de código abierto diseñada para mejorar tu **higiene digital**. Facilita el uso de _sub-addressing_ (también conocido como _plus addressing_) para que puedas identificar quién filtra tus datos y controlar el spam de manera efectiva.

![TagMyEmail Icon](src/assets/icon128.png)

## Características Principales

- **Detección Automática**: Identifica campos de email en cualquier sitio web.
- **Generación de Etiquetas Inteligente**: Extrae el nombre del dominio (SLD) para crear etiquetas coherentes (ej. `tu+netflix@gmail.com`).
- **Multi-Cuenta**: Gestiona múltiples correos base y elige cuál usar en cada momento.
- **Privacidad Total**: Todos los datos se guardan localmente en tu navegador. Cero telemetría.
- **Auditoría de Fugas**: Enlace directo a HaveIBeenPwned para verificar si una etiqueta específica ha sido comprometida.
- **Estética Premium**: Interfaz moderna en modo oscuro con diseño _glassmorphism_.

## Compilación y Desarrollo

Si deseas realizar cambios en el código o compilar la extensión desde el código fuente, sigue estos pasos:

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/seguridades/TagMyEmail
   cd tagmyemail
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Compilar para producción**:
   Este comando generará la carpeta `dist` con todos los archivos optimizados y empaquetados (incluyendo el _content script_ especial):

   ```bash
   npm run build
   ```

4. **Modo Desarrollo**:
   Para ver cambios en tiempo real durante el desarrollo (solo para popup y opciones):
   ```bash
   npm run dev
   ```

## Instalación (Cargar en el navegador)

### Chrome / Brave / Edge

1. Descarga el repositorio o el archivo ZIP.
2. Ve a `chrome://extensions/`.
3. Activa el **Modo de desarrollador**.
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta `dist`.

> [!TIP]
> **Próximamente en Chrome Web Store:** [Enlace Demo](https://chrome.google.com/webstore/detail/tagmyemail-demo)

### Firefox

1. Ve a `about:debugging#/runtime/this-firefox`.
2. Haz clic en **Cargar complemento temporal**.
3. Selecciona el archivo `manifest.json` en la carpeta `dist`.

> [!TIP]
> **Próximamente en Firefox Add-ons:** [Enlace Demo](https://addons.mozilla.org/firefox/addon/tagmyemail-demo)

## Privacidad y Seguridad

TagMyEmail nació bajo el principio de **Soberanía de Datos**.

- No tenemos servidores.
- No recopilamos estadísticas de uso.
- Tus correos e historial nunca salen de tu dispositivo.

## Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de abrir un _Issue_ o enviar un _Pull Request_.

Hecho con amor por [seguridades.org](https://seguridades.org)

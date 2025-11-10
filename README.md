# React Tiny Editor Word

Editor WYSIWYG tipo Word para React - Sin dependencias externas ni API keys.

## 🚀 Características

- ✍️ **Editor tipo Word** - WYSIWYG (What You See Is What You Get)
- 🖼️ **Insertar imágenes** - Desde tu dispositivo con redimensionamiento
- 🎨 **Formato completo** - Negrita, cursiva, subrayado, colores
- 📏 **Zoom controlado** - 75% a 150% sin salirse del contenedor
- 📱 **Responsive** - Se adapta a diferentes tamaños de pantalla
- 🔧 **Sin dependencias** - No requiere API keys ni librerías externas
- 🎯 **Fácil de usar** - Interface intuitiva tipo Microsoft Word

⚙️ Props
Prop	Tipo	Por Defecto	Descripción
value	string	''	Contenido HTML actual del editor
handleChange	function	requerido	Función que recibe el HTML actualizado
🖼️ Manejo de Imágenes
Tamaño máximo: 1078 × 607 px

Formato: JPG, PNG, GIF, WebP

Redimensionamiento: Click en imagen para ajustar tamaño

Base64: Las imágenes se convierten a base64 automáticamente

🎨 Formatos Soportados
Texto: Negrita, cursiva, subrayado, tachado

Encabezados: H1, H2, H3, párrafo normal

Alineación: Izquierda, centro, derecha, justificado

Listas: Con viñetas y numeradas

Enlaces: Hipervínculos

Colores: Color de texto personalizable

❓ Preguntas Frecuentes
¿Necesito API keys?
No, funciona completamente offline.

¿Qué navegadores soporta?
Todos los navegadores modernos que soporten contentEditable.

¿Puedo usar imágenes?
Sí, se insertan como base64 en el HTML.

📄 Licencia
MIT - Libre para uso personal y comercial.

## 📦 Instalación

```bash
npm install react-tiny-editor-word
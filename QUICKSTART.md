# 🚀 Guía de Inicio Rápido

¡Pon tu chatbot funcionando en menos de 5 minutos!

## ⚡ Instalación Express (Windows)

```powershell
# 1. Clonar o descargar el proyecto
cd jupyTerminator

# 2. Ejecutar script de instalación automática
.\install.ps1
```

## ⚡ Instalación Express (Linux/Mac)

```bash
# 1. Clonar o descargar el proyecto
cd jupyTerminator

# 2. Dar permisos y ejecutar script de instalación
chmod +x install.sh
./install.sh
```

## 📝 Configuración Rápida

1. **Abre el archivo `.env` que se creó automáticamente**

2. **Edita estas dos líneas con tus credenciales:**
   ```env
   OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXX  # ← Pon tu API key aquí
   ASSISTANT_ID=asst_XXXXXXXXXXXXXXXXXX     # ← Pon tu Assistant ID aquí
   ```

3. **¿No tienes estas credenciales?**
   - 🔑 API Key: https://platform.openai.com/api-keys
   - 🤖 Assistant ID: https://platform.openai.com/assistants

## 🎯 Ejecutar el Proyecto

```bash
npm run dev
```

Esto iniciará:
- ✅ Backend en http://localhost:3001
- ✅ Frontend en http://localhost:5173

## 🎨 ¡Listo! Pruébalo

Abre tu navegador en: **http://localhost:5173**

¡Deberías ver tu chatbot funcionando! 🎉

---

## 🔧 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecutar en desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Preview del build |

---

## 🆘 ¿Problemas?

Si algo no funciona, consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📖 Más Información

- Ver [README.md](./README.md) para documentación completa
- Ver [examples/embed-examples.html](./examples/embed-examples.html) para ejemplos de integración

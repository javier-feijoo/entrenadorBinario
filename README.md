# 🕹️ Entrenador Binario

**Entrenador Binario** es una SPA educativa en HTML, CSS y JavaScript para practicar conversiones entre números decimales y binarios (8 bits). Diseñada para alumnado de ciclos de informática y secundaria, con foco en **accesibilidad**, **usabilidad en tablets** y **gamificación**.

![Captura de pantalla](docs/screenshot.png)

## ✨ Características
- Modo **Decimal → Binario** y **Binario → Decimal**.
- HUD compacto fijo con nivel, progreso, puntos y racha.
- **Niveles de dificultad**: Bronce → Plata → Oro → Platino → Diamante.
- **Intentos limitados** (3 por número). Al agotarse, se genera un nuevo número.
- **Sistema de puntuación**: +10 puntos por acierto, −5 por fallo.
- **Opción de puntuar x2** cuando se juega **sin la ayuda visual** de los pesos (128…1).
- **Ajustes** de sonido (volumen, mute, sonidos personalizados) y preferencias de ayuda.
- **Persistencia** en `localStorage` (perfil de usuario, estadísticas y ajustes).
- **Accesible**: contraste alto, controles grandes (≥48px), navegación por teclado, avisos con `aria-live`.

## 📂 Estructura del proyecto
```
/entrenadorBinario
├── index.html
├── assets/
│   ├── css/styles.css      # Estilos globales y de juego
│   ├── img/                # Insignias de niveles, logos…
│   └── sounds/             # Sonidos por defecto
├── js/
│   ├── app.js              # Bootstrap SPA + router
│   ├── router.js           # Sistema de navegación por hash
│   ├── store.js            # Estado global en localStorage
│   ├── game.js             # Lógica de puntuación, intentos, niveles
│   ├── ui.js               # HUD y utilidades UI
│   ├── views/
│   │   ├── menu.js         # Menú principal (usuario, partida)
│   │   ├── dec2bin.js      # Vista Decimal → Binario
│   │   ├── bin2dec.js      # Vista Binario → Decimal
│   │   ├── stats.js        # Estadísticas
│   │   └── settings.js     # Ajustes (sonido, ayuda, puntuación)
│   └── components/bits.js  # Componente interactivo de bits
└── README.md
```

## 🚀 Uso
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/javier-feijoo/entrenadorBinario.git
   cd entrenadorBinario
   ```
2. Abrir `index.html` en el navegador.

No requiere servidor: funciona directamente como SPA estática.

## 🧑‍🏫 Pensado para docencia
- **Clases de Redes Locales / Sistemas**: practicar direcciones IP (binario/decimal).
- **FP de Informática**: refuerzo de numeración binaria.
- **Accesible** para alumnado con dificultades de visión o motricidad.

## 🔧 Personalización
- Cambiar imágenes de niveles en `assets/img/` (bronce.png, plata.png…)
- Editar sonidos en `assets/sounds/`.
- Ajustar reglas de puntuación en `js/game.js`.

## 📜 Licencia
Este proyecto se distribuye bajo licencia MIT. Ver [LICENSE](LICENSE).

---
👨‍💻 Desarrollado por [Javier Feijóo](https://github.com/javier-feijoo) — Docente de Informática, Redes Locales 2025.
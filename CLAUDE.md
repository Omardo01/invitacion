# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Invitación de boda digital construida con Next.js 16 App Router, React 19, TypeScript y Tailwind CSS v4. Es un sitio estático/mayormente estático sin base de datos ni autenticación.

## Comandos

```bash
npm run dev      # Servidor de desarrollo con Turbopack
npm run build    # Build de producción
npm run start    # Servidor de producción (requiere build previo)
```

No hay linter ni tests configurados aún.

## Arquitectura

- **`app/`** — App Router de Next.js. Todo es Server Component por defecto; agregar `'use client'` solo cuando se necesite interactividad.
- **`app/layout.tsx`** — Root layout con fuentes Geist (via `next/font/google`) y CSS global.
- **`app/globals.css`** — Tailwind v4 via `@import "tailwindcss"`. Los tokens de color (`--background`, `--foreground`) se definen aquí con `@theme inline`. No usar `tailwind.config.js` — Tailwind v4 usa CSS nativo.
- **`app/page.tsx`** — Página principal (`/`). Aquí vive el contenido de la invitación.
- **`public/`** — Assets estáticos servidos directamente.
- **`next.config.ts`** — Configuración de Next.js en TypeScript.

## Notas importantes

- **Tailwind v4**: La sintaxis cambió. Se configura en CSS con `@theme`, no con `tailwind.config.js`. Las clases utilitarias siguen igual.
- **Next.js 16**: Usar `proxy.ts` en lugar de `middleware.ts` si se necesita lógica de intercepción. Preferir Cache Components y `next/image` sobre soluciones custom.
- **React 19**: Hooks y APIs pueden diferir de versiones anteriores. Revisar docs si algo se comporta distinto.
- **Sin ESLint**: No hay configuración de linting. Si se agrega, usar `next lint`.

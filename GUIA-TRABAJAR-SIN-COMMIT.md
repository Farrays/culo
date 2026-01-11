# 🧪 Guía: Trabajar sin Commitear

> **Todas las formas de crear páginas de test sin hacer commit**
> Fecha: Enero 2026

---

## 📋 Resumen de Opciones

| Opción               | Uso                                   | Ventajas                              | Desventajas                              |
| -------------------- | ------------------------------------- | ------------------------------------- | ---------------------------------------- |
| **1. .gitignore** ⭐ | Archivos/carpetas permanentes de test | Simple, no aparece en git status      | Debes recordar qué ignoraste             |
| **2. Git Stash**     | Cambios temporales                    | Guardas sin commit, recuperas después | No es para archivos nuevos no trackeados |
| **3. Branch Local**  | Experimentos grandes                  | Puedes commitear localmente           | Ocupa espacio, puede acumularse          |
| **4. WIP Commit**    | Work in Progress                      | Historial local completo              | Puede acabar en remote por error         |

---

## ✅ Opción 1: .gitignore (RECOMENDADA)

### **Ya está configurado en tu .gitignore:**

```bash
# Test pages (no commit)
src/pages/test/          ← Toda esta carpeta ignorada
src/components/test/     ← Toda esta carpeta ignorada
*.test-page.tsx          ← Cualquier archivo con este patrón
*.playground.tsx         ← Cualquier archivo con este patrón
```

### **Cómo usar:**

#### **Opción A: Carpeta de Test**

```bash
# Crear página de test
src/pages/test/MiPaginaTest.tsx

# Crear componente de test
src/components/test/MiComponenteTest.tsx
```

**Estos archivos NUNCA aparecerán en Git.**

#### **Opción B: Sufijo de archivo**

```bash
# En cualquier carpeta:
src/pages/ReservaWidget.playground.tsx  ← Ignorado
src/components/Hero.test-page.tsx       ← Ignorado
```

### **Verificar que funciona:**

```bash
# Ver qué archivos NO están trackeados
git status

# Si NO aparece tu archivo de test = ✅ Funcionando
```

### **Añadir ruta en App.tsx (solo para desarrollo):**

```tsx
// src/App.tsx

import { lazy } from 'react';

// Importar página de test (solo existe localmente)
const WidgetReservaTest = lazy(() => import('./pages/test/WidgetReservaTest'));

<Routes>
  {/* Tus rutas normales... */}

  {/* RUTA DE TEST (no commitear) */}
  <Route path="/test/widget-reserva" element={<WidgetReservaTest />} />
</Routes>;
```

**IMPORTANTE:** Al hacer commit, Git te avisará que App.tsx cambió, pero puedes:

- Commitear App.tsx (la ruta apuntará a archivo que no existe en producción → 404, no problema)
- O revertir el cambio en App.tsx antes de commit

### **Ventajas:**

✅ Simple - Solo crear archivo en carpeta correcta
✅ Permanente - Puedes dejar archivos de test indefinidamente
✅ No contamina git status
✅ Funciona para archivos nuevos y existentes

### **Desventajas:**

⚠️ No se sincroniza entre máquinas (si trabajas en varios PCs)
⚠️ Se puede perder si borras carpeta por error
⚠️ Tienes que recordar qué has ignorado

---

## 🗄️ Opción 2: Git Stash

### **Para cambios temporales (NO archivos nuevos)**

```bash
# Guardar cambios actuales sin commit
git stash push -m "Test: Widget de reserva"

# Ver lista de stashes
git stash list

# Recuperar cambios
git stash pop

# O aplicar sin borrar del stash
git stash apply stash@{0}
```

### **Ventajas:**

✅ Rápido para guardar trabajo en progreso
✅ Puedes tener múltiples stashes
✅ Se sincroniza si haces pull/push del stash

### **Desventajas:**

⚠️ **NO funciona con archivos nuevos** (untracked)
⚠️ Se puede perder si haces `git stash drop` por error
⚠️ Incómodo para guardar test permanentes

### **Solución para archivos nuevos:**

```bash
# Stash incluyendo archivos NO trackeados
git stash push -u -m "Test con archivos nuevos"
```

---

## 🌿 Opción 3: Branch Local (sin push)

### **Para experimentos más grandes**

```bash
# Crear branch local
git checkout -b test/widget-reserva

# Trabajar normalmente, hacer commits
git add .
git commit -m "WIP: Testing widget de reserva"

# Volver a main sin hacer push
git checkout main

# Tu branch test/widget-reserva queda local
# Puedes volver cuando quieras:
git checkout test/widget-reserva
```

### **Ver branches locales:**

```bash
git branch
```

### **Borrar branch local cuando termines:**

```bash
git branch -D test/widget-reserva
```

### **Ventajas:**

✅ Puedes commitear normalmente (historial completo)
✅ Experimentar sin miedo
✅ Fácil cambiar entre main y test

### **Desventajas:**

⚠️ Puede acumularse basura (branches viejos)
⚠️ Se puede hacer push por error
⚠️ Más complejo que .gitignore

---

## 📝 Opción 4: WIP Commit Local (no recomendado)

### **Commit que nunca haces push**

```bash
# Hacer commit normal
git add .
git commit -m "WIP: Testing reserva widget - DO NOT PUSH"

# NUNCA hacer push
# git push  ← ❌ NO HACER

# Cuando termines, deshacer commit
git reset HEAD~1

# O hacer squash antes de push real
```

### **Ventajas:**

✅ Historial completo local
✅ Puedes hacer múltiples commits

### **Desventajas:**

⚠️ Fácil hacer push por error
⚠️ Contamina historial local
⚠️ Requiere disciplina

---

## 🎯 Recomendación por Caso de Uso

### **Caso 1: Página de test para widget (tu caso)**

**Mejor opción:** `.gitignore` ✅

```bash
# Crear:
src/pages/test/WidgetReservaTest.tsx

# Ya está ignorado automáticamente
```

**Por qué:**

- Archivo permanente que usarás repetidamente
- No necesitas commitearlo nunca
- Simple y seguro

---

### **Caso 2: Cambios experimentales en archivo existente**

**Mejor opción:** `git stash` o `branch local`

```bash
# Stash si son cambios pequeños
git stash push -m "Experimento: cambio de colores"

# Branch si es experimento grande
git checkout -b experiment/new-design
```

**Por qué:**

- Archivo ya existe en Git
- Quieres probar y quizá descartar
- Fácil volver atrás

---

### **Caso 3: Feature completa que no sabes si vas a usar**

**Mejor opción:** `branch local`

```bash
git checkout -b feature/sistema-puntos
# Desarrollar todo
git commit -am "Sistema de puntos completo"

# Si decides usarlo:
git checkout main
git merge feature/sistema-puntos

# Si decides descartarlo:
git checkout main
git branch -D feature/sistema-puntos
```

---

### **Caso 4: Debug rápido / console.logs**

**Mejor opción:** `.gitignore` con archivo temporal

```bash
# Crear:
src/debug.playground.tsx

# Usar para cualquier debug rápido
# Ya está ignorado por el patrón *.playground.tsx
```

---

## 🔍 Verificar qué está ignorado

### **Ver archivos ignorados:**

```bash
# Ver todos los archivos ignorados
git status --ignored

# Verificar si un archivo específico está ignorado
git check-ignore -v src/pages/test/MiPagina.tsx
```

**Respuesta:**

```
.gitignore:51:src/pages/test/  src/pages/test/MiPagina.tsx
```

✅ Significa: está ignorado por la línea 51 del .gitignore

---

## 📂 Estructura Recomendada para Tests

```
src/
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   └── test/                    ← Carpeta ignorada
│       ├── WidgetReservaTest.tsx
│       ├── FormularioTest.tsx
│       └── IntegracionesTest.tsx
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── test/                    ← Carpeta ignorada
│       ├── WidgetPlayground.tsx
│       └── ComponentShowcase.tsx
│
└── utils/
    └── debug.playground.ts      ← Archivo ignorado
```

---

## ⚠️ Errores Comunes

### **Error 1: Archivo en .gitignore pero Git lo sigue trackeando**

**Problema:** Añadiste archivo a .gitignore DESPUÉS de commitearlo

**Solución:**

```bash
# Dejar de trackear el archivo (pero no borrarlo)
git rm --cached src/pages/test/MiPagina.tsx

# Commit
git commit -m "Stop tracking test file"
```

---

### **Error 2: Push accidental de branch de test**

**Problema:** Hiciste push de branch que era solo para test local

**Solución:**

```bash
# Borrar branch del remote
git push origin --delete test/mi-branch

# Borrar branch local
git branch -D test/mi-branch
```

---

### **Error 3: Perdí archivos de test**

**Problema:** Borraste carpeta `src/pages/test/` por error

**Solución:**

```bash
# Si no hiciste commit, recuperar del stash:
git stash list
git stash apply stash@{0}

# Si no hay stash, no hay forma de recuperar
# (porque estaban en .gitignore y nunca se commitearon)
```

**Prevención:** Hacer backup ocasional de carpeta test:

```bash
# Crear backup manual
cp -r src/pages/test/ src/pages/test.backup/

# O usar Git LFS para archivos grandes de test (avanzado)
```

---

## 🎨 Ejemplo Práctico: Tu Caso

### **Crear página de test para Widget de Reserva:**

```bash
# 1. Ya hicimos esto - .gitignore configurado ✅

# 2. Crear archivo de test
# Ya creado: src/pages/test/WidgetReservaTest.tsx ✅

# 3. Añadir ruta en App.tsx (temporal)
```

```tsx
// src/App.tsx (cambio temporal, puedes commitear o no)

import WidgetReservaTest from './pages/test/WidgetReservaTest';

<Route path="/test/widget-reserva" element={<WidgetReservaTest />} />;
```

```bash
# 4. Arrancar dev server
npm run dev

# 5. Abrir navegador
# http://localhost:5173/test/widget-reserva

# 6. Testear todas las variantes del widget

# 7. Verificar que NO aparece en Git
git status
# ❌ NO debe aparecer src/pages/test/WidgetReservaTest.tsx
```

### **Antes de commit:**

**Opción A:** Commitear App.tsx con la ruta (no pasa nada en producción, dará 404)

```bash
git add src/App.tsx
git commit -m "Add test route for widget (test file gitignored)"
```

**Opción B:** Revertir cambios en App.tsx

```bash
git checkout src/App.tsx
```

---

## 📊 Comparación Final

| Necesidad                 | Solución     | Comando                        |
| ------------------------- | ------------ | ------------------------------ |
| Página de test permanente | .gitignore   | `src/pages/test/MiTest.tsx`    |
| Cambios temporales        | git stash    | `git stash push -m "WIP"`      |
| Experimento grande        | branch local | `git checkout -b test/feature` |
| Debug rápido              | .gitignore   | `debug.playground.tsx`         |

---

## ✅ Checklist

- [x] .gitignore actualizado con carpetas de test
- [x] Carpeta `src/pages/test/` creada
- [x] Archivo de ejemplo `WidgetReservaTest.tsx` creado
- [ ] Añadir ruta en App.tsx (opcional)
- [ ] Testear en navegador
- [ ] Verificar con `git status` que no aparece

---

## 🚀 Resumen

**Para tu caso (página de test):**

1. ✅ Crea archivos en `src/pages/test/`
2. ✅ Ya están en .gitignore
3. ✅ Git los ignora automáticamente
4. ✅ Puedes testear localmente
5. ✅ NUNCA se commitean

**Eso es todo.** Simple y seguro. 💪

---

¿Quieres que te ayude a crear más páginas de test o configurar algo específico? 🎨

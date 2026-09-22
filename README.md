# PSC-I Girder Mid-Section

A React + TypeScript + Electron + Tailwind CSS + Vite studio for drawing the **mid-span cross-section** of a prestressed concrete I-girder. (`define_girder_points`), rendered as an interactive SVG engineering sheet instead of driving AutoCAD.

## What it does

- Enter flange, web and haunch dimensions **a–i** (mm)
- Live SVG drawing with ISO-style linear dimensions, concrete hatch and centreline
- Section properties: area, centroid / NA, Ixx, Iyy, section moduli, self-weight
- Export **SVG**, **PNG**, **DXF** (opens in AutoCAD / LibreCAD) and parameter **JSON**
- Desktop shell via Electron, or run as a plain web app

## Parameters

| Key | Description |
| --- | --- |
| a | Top flange width |
| b | Overall height (should equal e+g+h+i+f) |
| c | Bottom flange width |
| d | Web thickness |
| e | Top flange thickness |
| f | Bottom flange thickness |
| g | Depth of web below top flange (top haunch) |
| h | Straight web height |
| i | Depth of web above bottom flange (bottom haunch) |

Default values match the original GUI: `a=900, b=1500, c=700, d=500, e=150, f=250, g=75, h=875, i=150`.

## Scripts

```bash
npm install
npm run dev              # Vite web app at http://localhost:5173
npm run build
npm run preview
npm run electron:dev     # Vite + Electron window
npm run electron:build
```

The dev server binds `0.0.0.0:5173` so it can be previewed remotely.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Electron (optional desktop wrapper)
- SVG drawing (no CAD runtime required)

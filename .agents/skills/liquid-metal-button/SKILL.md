---
name: liquid-metal-button
description: Guide and reusable patterns for integrating and styling dynamic WebGL Shader Liquid Metal Buttons with 3D perspective layers, ripple effects, and @paper-design/shaders.
---

# Liquid Metal Button Component Skill

This skill provides full instructions and reference patterns for integrating, customizing, and styling the **Liquid Metal Button** (`@paper-design/shaders` + WebGL fragment shaders + 3D CSS perspective + interactive ripple effects).

## Dependencies

Ensure the following packages are installed:
```bash
npm install @paper-design/shaders lucide-react clsx tailwind-merge
```

## Component Location & Structure

Place the component in `src/components/ui/liquid-metal-button.tsx`:

```tsx
"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  icon?: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  icon,
  className = "",
  width: customWidth,
  height: customHeight,
}: LiquidMetalButtonProps) {
  // ... WebGL ShaderMount lifecycle, 3D perspective layers, and ripple animations
}
```

## Features & Customization
- **WebGL Liquid Metal Shaders**: Mounts `liquidMetalFragmentShader` onto a dedicated canvas with repetition, softness, distortion, shiftRed, shiftBlue, and angle parameters.
- **Dynamic Speed**: Accelerates shader animation speed on hover (1.0x) and click burst (2.4x) before settling back to idle (0.6x).
- **3D Multi-Layer Perspective**: Utilizes `perspective: 1000px` with `translateZ` layers (background plate, shader layer, floating text/icon, interaction overlay).
- **Interactive Radial Ripples**: Disperses expanding radial gradients on click with auto-cleanup.
- **View Modes**:
  - `viewMode="text"`: Full pill button with customizable label and optional icons.
  - `viewMode="icon"`: Compact square/circle button with icon display.

## Usage Example

```tsx
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <LiquidMetalButton label="Register Now" onClick={() => console.log("clicked")} />
      <LiquidMetalButton viewMode="icon" />
    </div>
  );
}
```

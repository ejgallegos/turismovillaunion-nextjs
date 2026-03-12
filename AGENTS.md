# AGENTS.md - Development Guide for Tourism Villa Union

This file provides guidelines and reference information for agents working on this codebase.

## Project Overview

This is a Next.js 15 application (App Router) for a tourism website for Villa Union. It uses:
- **Framework**: Next.js 15.3.4 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Forms/Validation**: React Hook Form + Zod
- **AI**: Google Genkit for AI features
- **Database**: Firebase + local JSON files for data storage

---

## Build Commands

```bash
# Development
npm run dev              # Start Next.js dev server on port 9002

# Production
npm run build            # Build Next.js application
npm run start            # Start production server

# Linting & Type Checking
npm run lint             # Run Next.js lint
npm run typecheck        # Run TypeScript type checking (tsc --noEmit)

# AI Development
npm run genkit:dev       # Start Genkit AI dev server
npm run genkit:watch     # Start Genkit AI with watch mode
```

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** in `tsconfig.json` - do not disable strict checks
- Use explicit types for function parameters and return types when not obvious
- Use `interface` for public APIs and data shapes, `type` for unions/utilities

### Imports

- Use path aliases: `@/*` maps to `./src/*`
- Example: `import { Button } from '@/components/ui/button'`
- Order imports: React → external libs → internal components/lib → types

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { SomeType } from "@/types"
```

### Components

- Use `React.forwardRef` for components that accept refs
- Define `displayName` for forwarded ref components
- Use CVA (class-variance-authority) for component variants

```typescript
const buttonVariants = cva("...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Naming Conventions

- **Files**: kebab-case for pages/routes (`novedades/page.tsx`), kebab-case for components
- **Components**: PascalCase (`Button`, `NovedadForm`)
- **Functions**: camelCase (`getNovedades`, `saveNovedades`)
- **Interfaces/Types**: PascalCase with descriptive names (`Attraction`, `Novedad`)
- **Server Actions**: camelCase, verb-first (`upsertNovedad`, `deleteNovedad`)

### Server Actions

- Add `'use server'` at the top of files containing server actions
- Use Zod for form validation
- Return structured responses: `{ success: boolean; errors?: ...; error?: string }`
- Use `revalidatePath()` to refresh cached data after mutations

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({ title: z.string().min(3) })

export async function actionName(formData: FormData) {
  const rawData = { title: formData.get('title')?.toString() }
  const validated = schema.safeParse(rawData)
  
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors }
  }
  
  // ... perform action
  revalidatePath('/path')
  return { success: true }
}
```

### Error Handling

- Use try/catch in async operations, especially file system and external API calls
- Return user-friendly error messages in Spanish (project language)
- Log errors with `console.error()` for debugging

```typescript
try {
  await fs.writeFile(filePath, data)
} catch (error) {
  console.error('Error saving data:', error)
  throw new Error('No se pudieron guardar los datos.')
}
```

### Data Layer

- Data stored in JSON files under `src/data/` and synced to Firebase
- Services in `src/lib/*.service.ts` handle data operations
- Always validate data with Zod before saving

### UI Components

- Use existing UI components from `@/components/ui/` (built on Radix UI)
- Use Tailwind CSS for styling - follow existing color/spacing patterns
- Colors defined in `tailwind.config.ts` - use semantic tokens (primary, secondary, destructive)
- Fonts: PT Sans for body/headlines (configured in tailwind.config.ts)

### Routes & Pages

- Public pages in `src/app/` (e.g., `src/app/novedades/page.tsx`)
- Admin pages in `src/app/admin/`
- Dynamic routes use folder naming: `src/app/atractivos/[id]/page.tsx`

---

## Project Structure

```
src/
├── ai/                    # Genkit AI flows
├── app/                   # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── (public pages)     # Website pages
├── components/
│   └── ui/                # Reusable UI components
├── data/                  # JSON data files
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
└── types/                 # TypeScript type definitions
```

---

## Important Configuration

- `next.config.ts`: Server actions body limit 10MB, ignores TypeScript errors in build
- `tsconfig.json`: Strict mode enabled, path alias `@/*` → `./src/*`
- `tailwind.config.ts`: Custom colors, dark mode support, typography plugin

---

## Testing

Currently there are **no tests** configured in this project. If adding tests:
- Use Vitest or Jest with React Testing Library
- Place tests alongside components with `.test.tsx` extension
- Run tests with `npm run test` (add to package.json)

---

## Common Tasks

### Adding a new data type
1. Create JSON file in `src/data/`
2. Create service in `src/lib/<name>.service.ts`
3. Create types in service file
4. Add server actions in `src/app/admin/<name>/actions.ts`

### Adding a new admin page
1. Create folder in `src/app/admin/<name>/`
2. Create `page.tsx` for listing and forms
3. Create `actions.ts` with server actions for CRUD

### Adding a new public page
1. Create folder in `src/app/<name>/`
2. Use existing data services to fetch content
3. Follow Tailwind styling conventions

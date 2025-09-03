# Etapa 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependencias nativas necesarias
RUN apk add --no-cache libc6-compat

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci && npm cache clean --force

# Etapa 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias desde etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación
RUN npm run build

# Etapa 3: Runner (imagen final)
FROM node:20-alpine AS runner
WORKDIR /app

# Configurar usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER nextjs

# Comando de inicio
CMD ["node", "server.js"]
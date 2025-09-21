# ---------- Build ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app

# ---- Public build-time args (OK to be public; needed for client bundle) ----
# Pass values at build time with --build-arg
ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_API_KEY=""   # anon/public
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
ARG NEXT_PUBLIC_MAP_API_KEY=""
ARG GOOGLE_CLIENT_ID=""
ARG GOOGLE_REDIRECT_URI=""

# Make them visible to `next build`
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_API_KEY=$NEXT_PUBLIC_SUPABASE_API_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MAP_API_KEY=$NEXT_PUBLIC_MAP_API_KEY
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI

# Install deps & build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Run as non-root
RUN useradd --user-group --system --no-log-init --create-home nextjs
USER nextjs

ENV NODE_ENV=production
# App Runner will inject PORT; default to 3000 for local runs
ENV PORT=3000

# Copy Next standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Expose the same port you'll configure in App Runner
EXPOSE 3000

# Next standalone server.js binds to process.env.PORT and 0.0.0.0
CMD ["node", "server.js"]

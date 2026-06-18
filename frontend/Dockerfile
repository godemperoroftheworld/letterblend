FROM node:22-alpine AS builder
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
ARG BFF_URL
ENV NUXT_BFF_URL=${BFF_URL}
ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

EXPOSE ${PORT}

CMD ["node", ".output/server/index.mjs"]
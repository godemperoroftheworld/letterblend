FROM node:22-alpine AS builder
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
ARG BFF_URL
ENV NUXT_BFF_URL=${BFF_URL}

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable
RUN yarn install --immutable

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
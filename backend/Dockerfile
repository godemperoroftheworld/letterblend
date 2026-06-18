FROM node:20-alpine

ARG PORT

ENV PORT=${PORT}

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE $PORT

# Start the Express server
CMD ["node", "dist/index.js", "--env", "production"]
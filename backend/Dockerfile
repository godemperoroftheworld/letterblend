FROM node:20-alpine

ARG SCRAPE_SERVICE
ARG MOVIE_API
ARG POSTER_API
ARG MONGO_PATH
ARG PORT

ENV PORT=${PORT}
ENV SCRAPE_SERVICE=${SCRAPE_SERVICE}
ENV MOVIE_API=${MOVIE_API}
ENV POSTER_API=${POSTER_API}
ENV MONGO_PATH=${MONGO_PATH}

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE $PORT

# Start the Express server
CMD ["node", "dist/index.js", "--env", "production"]
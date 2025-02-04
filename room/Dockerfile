FROM node:18-alpine AS deploy-stage
ARG PORT
ENV NODE_ENV production
ENV PORT ${PORT}
COPY . .
RUN npm install -g yarn --force
RUN yarn install --production=false
RUN yarn build
EXPOSE $PORT
CMD ["yarn","start"]
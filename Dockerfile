FROM node:16-alpine as base

WORKDIR /app
EXPOSE 3000

FROM base as builder
COPY ["package.json", "package-lock.json*", ".babelrc", "./"]
RUN npm ci
COPY ./src ./src
RUN npm run build
RUN npm prune --production

FROM base as release
USER node
COPY --chown=node:node --from=builder /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/build /app/build
COPY --chown=node:node . /app
CMD ["npm", "start"]

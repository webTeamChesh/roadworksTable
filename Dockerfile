ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim as base
LABEL org.opencontainers.image.source="https://github.com/webTeamChesh/roadworksnuxt"

ENV NODE_ENV=production

ENV TZ="Europe/London"
WORKDIR /src

# Build
FROM base as build

COPY package*.json ./
RUN npm install --production \
    && npm cache clean --force \
    && rm -rf /tmp/*

COPY  . .
RUN npm run build

# Run
FROM base
ENV PORT=3001
EXPOSE 3001

COPY --from=build /src/.output /src/.output
COPY ./manifest.json /manifest.json
CMD [ "node", ".output/server/index.mjs" ]

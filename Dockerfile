   
FROM node:18-alpine
LABEL org.opencontainers.image.source="https://github.com/<webTeamChesh>/<roadworksTable>"
RUN --mount=type=secret,id=ON_PWD export ON_PWD=$(cat /run/secrets/ON_PWD)
COPY . .
WORKDIR /app
EXPOSE 3001
RUN yarn install --production
CMD ["node", "index.js"]

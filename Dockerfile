   
FROM node:18-alpine
LABEL org.opencontainers.image.source="https://github.com/webTeamChesh/roadworksTable"
ARG ON_PWD
ENV ON_PWD ${ON_PWD}
COPY . .
WORKDIR /app
EXPOSE 3001
RUN yarn install --production
CMD ["node", "index.js"]

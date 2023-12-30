   
FROM node:18-alpine
LABEL org.opencontainers.image.source="https://github.com/<your-github-username>/<roadworksTable>"
COPY . .
WORKDIR /app
EXPOSE 3001
RUN yarn install --production
CMD ["node", "index.js"]

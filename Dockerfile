   
FROM node:18-alpine
RUN pip install pipenv && pipenv sync
RUN --mount=type=secret,id=ON_PWD export ON_PWD=$(cat /run/secrets/ON_PWD) && python genenv.py
LABEL org.opencontainers.image.source="https://github.com/<webTeamChesh>/<roadworksTable>"
COPY . .
WORKDIR /app
EXPOSE 3001
RUN yarn install --production
CMD ["node", "index.js"]

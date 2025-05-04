FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm ci && npm run build

RUN npm install -g vite

EXPOSE 4173

CMD ["vite", "preview", "--host"]

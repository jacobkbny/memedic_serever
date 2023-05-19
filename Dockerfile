FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY entrypoint.sh /app/#

RUN npm run build

EXPOSE 3000

#"/app/entrypoint.sh"
CMD ["/app/entrypoint.sh","npm", "run", "start:prod"]

ENV DATABASE_URL=mysql://backend:memedic2023@127.0.0.1:3306/memedic
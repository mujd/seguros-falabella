FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV DATABASE_HOST mongo

CMD ["npm", "run", "dev"]

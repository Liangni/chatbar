FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install --only=production

RUN npx sequelize db:drop --env production

RUN npx sequelize db:create --env production

RUN npx sequelize db:migrate --env production

RUN npx sequelize db:seed:all --env production

USER node

CMD ["npm", "start"]

EXPOSE 3000
FROM node:lts-alpine

WORKDIR /app

# copy current directory to WORKDIR
COPY . .

# RUN is for image build steps
RUN npm install --only=production

# IF USING 'docker-compose', BELOW 'RUN' STEPS(CREATE TABLES, MIGRATE, ADD SEEDS) SHOULD BE SKIPPED.

# RUN npx sequelize db:drop --env production

# RUN npx sequelize db:create --env production

# RUN npx sequelize db:migrate --env production

# RUN npx sequelize db:seed:all --env production

USER node

CMD ["npm", "start"]

EXPOSE 3000
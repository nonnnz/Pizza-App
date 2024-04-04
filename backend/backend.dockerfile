FROM node:alpine

ENV DATABASE_URL="postgresql://postgres:password@db:5432/postgres?schema=public"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

# RUN npx prisma db push

# RUN npx prisma migrate dev --name init

COPY . .

EXPOSE 4000

# CMD ["node", "index-new.js"]
CMD ["npm", "run", "deploy"]
FROM node:20

WORKDIR /app

COPY ./ ./

RUN npm install

ENV NODE_ENV=${NODE_ENV:-development}

EXPOSE 5000

CMD ["npm", "run", "dev"]
FROM node:18.19.0

WORKDIR /rust-db-manager-_front

COPY . .

RUN npm i -g @angular/cli

RUN npm i

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
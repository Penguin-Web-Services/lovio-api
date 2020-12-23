FROM node:fermium as dev
WORKDIR /workspace/app
RUN mkdir app

FROM node:fermium-alpine as node
WORKDIR /app
RUN mkdir app

FROM node as build_image
WORKDIR /app
COPY ./app /app
RUN npm install
RUN npm run build
RUN npx prisma generate


FROM node:fermium-alpine as prod_deps
WORKDIR /app
COPY ./app/package.json ./app/package-lock.json ./app/prisma /app/
RUN npm install --production
COPY --from=build_image /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build_image /app/node_modules/@generated /app/node_modules/@generated


FROM node:fermium-alpine as production
WORKDIR /app
COPY --from=build_image /app/dist /app/dist
COPY --from=prod_deps /app/node_modules /app/node_modules
COPY ./app/package.json /app/
RUN ls node_modules/
CMD npm run start:prod

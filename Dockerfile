FROM node:lts-alpine as builder

WORKDIR /
COPY / /
RUN yarn
RUN yarn build

FROM nginx:latest

COPY --from=builder /dist /usr/share/nginx/html/

EXPOSE 80

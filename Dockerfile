##### FRONTEND BUILDER
FROM node:16.13.1-alpine3.15 AS frontend_builder
WORKDIR /app

# Setup fake ./whos_on_my_network/static for the frontend postbuild to move into
RUN mkdir -p ./whos_on_my_network/static

COPY ./webapp ./webapp
RUN cd ./webapp && npm ci && npm run build


##### RUNNER
FROM python:3.9.18-alpine3.18 AS runner
WORKDIR /app

RUN apk update
RUN apk add libpcap-dev libpcap gcc

COPY . .
COPY --from=frontend_builder /app/whos_on_my_network/static ./whos_on_my_network/static

RUN pip install -r requirements.txt

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["python", "-m", "whos_on_my_network"]
CMD ["start"]

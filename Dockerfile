FROM node:10.13.0-alpine

WORKDIR /app

# 캐시를 위해 package 파일만 먼저 복사하여 설치한다
COPY package.json yarn.lock ./
RUN set -ex; yarn install --prod; yarn cache clean

COPY . .

CMD ["node", "src/index.js"]

# Hangouts Chat Bot Sample

## 개요

이 프로젝트는 Google Hangouts Chat API 및 Google Cloud Pub/Sub 을 이용해 사용자가 직접 Bot을 만들어 운영할 수 있도록 하는 예제입니다.

예제에 사용된 소스는 모두 NodeJS 10.13.0 기준으로 작성되어 있습니다.

## 준비

### GCP

- Hangout Chat API 사용 설정
- PubSub Topic/Subscription 생성
- PubSub 권한 설정
- Service Account 설정.
- [참고 링크](https://developers.google.com/hangouts/chat/how-tos/pub-sub)

### Tools

- [NodeJS](https://nodejs.org/ko/download/package-manager)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [PM2](https://pm2.keymetrics.io/docs/usage/quick-start)
- [docker](https://docs.docker.com)
- make tool

## 소스 디렉터리 설명

```text
├── Dockerfile              : 도커 빌드 설정 파일
├── Makefile                : 로컬 개발용 make 설정 파일
├── README.md               : 설명 파일
├── ecosystem.config.js     : PM2 설정파일
├── misc                    : 기타 도구.
│   └── message_sample      : Hangouts Chat 메시지 샘플
├── package.json            : NodeJS 패키지 파일
├── src                     : 소스 코드 디렉터리
│   ├── cmds                : 명령어 디렉터리
│   ├── config              : 설정 파일 디렉터리
│   ├── index.js            : 서버 메인
│   └── lib                 : 유틸리티/라이브러리
└── yarn.lock               : yarn 패키지 lock 파일
```

## 서버 실행하기

### 소스 가져오기

```sh
git clone git@github.com:MZCloudnoa/hangout-chat-bot-sample.git
```

### PM2를 이용해 실행하기

- 소스 폴더로 이동

```sh
cd hangout-chat-bot-sample
```

- 패키지 설치

```sh
yarn install
```

- 서버 실행

```sh
make start
```

### docker를 이용해 실행하기

- 소스 폴더로 이동

```sh
cd hangout-chat-bot-sample
```

- docker 이미지 생성

```sh
make build
```

- 서버 실행

```sh
make run
```

## 참고

- 예제에서는 pubsub 및 hangouts chat api연결에 기본 인증 파일을 사용합니다.
- GOOGLE_APPLICATION_CREDENTIALS 환경변수를 이용해 인증 파일을 지정할 수 있습니다.

# Spring Authorization Server + PKCE Example

이 프로젝트는 Spring Authorization Server를 이용해 OAuth 2.0 Authorization Code + PKCE 흐름을 직접 구현하고 검증하기 위한 데모 프로젝트입니다.

* Authorization Server는 Spring Boot (9000 포트) 로 구성
* Client는 정적 HTML + JavaScript (8080 포트) 로 구성하여
* 클라이언트에서 code_verifier 및 code_challenge를 생성하고,
* 서버가 이를 검증하는 역할을 수행합니다.

### Client 실행 (8080 포트)

client 디렉토리에서 실행합니다.

```
npx serve . -l 8080
```

브라우저에서 접속:
```
http://localhost:8080
```
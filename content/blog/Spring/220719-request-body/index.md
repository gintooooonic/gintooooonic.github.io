---
title: 요청의 바디 조회하기
date: '2022-07-19 00:00:04'
category: Spring
draft: false
---

앞 포스트에서 URL과 Form 데이터를 통해 전달되는 파라미터를 조회했지만,
JSON처럼 바디를 통해 전달되는 데이터도 많습니다. (사실 Form 데이터도 바디에 저장되는 데이터지만, Spring에선 특별히 URL 쿼리 파라미터와 같은 방법으로 조회할 수 있는 기능을 제공합니다.)

## 바디 조회 유형

### 1. HttpServletRequest를 통해 조회하기

메서드에서 HttpServletRequest 타입의 파라미터를 받아 바디를 조회합니다. HttpServletRequest에서 InputStream을 가져와 바디의 내용을 읽습니다.

```java
@PostMapping("/request-body-string-v1")
public void requestBodyString(HttpServletRequest request, HttpServletResponse response) throws IOException {
	ServletInputStream inputStream = request.getInputStream();
	String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

	log.info("messageBody={}", messageBody);

	response.getWriter().write("ok");
}
```

### 2. InputStream을 통해 조회하기

HttpServletRequest에서 InputStream을 가져오는 대신, InputStream을 직접 메서드의 파라미터로 받는 방법도 있습니다. 방법은 비슷합니다.

```java
@PostMapping("/request-body-string-v2")
public void requestBodyStringV2(InputStream inputStream, Writer responseWriter) throws IOException {
	String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
	log.info("messageBody={}", messageBody);
	responseWriter.write("ok");
}
```

### 3. HttpEntity를 통해 조회하기

메서드에서 HttpEntity 타입의 파라미터를 받아 조회할 수 있습니다.
HttpEntity는 HTTP 요청 또는 응답의 헤더와 바디를 담는 클래스입니다.

또는 HttpEntity의 자식인 RequestEntity를 받는 방법도 있습니다.

```java
@PostMapping("/request-body-string-v3")
public HttpEntity<String> requestBodyStringV3(HttpEntity<String> httpEntity) {
	String messageBody = httpEntity.getBody();
	log.info("messageBody={}", messageBody);

	return new HttpEntity<>("ok");
}
```

### 4. RequestBody를 통해 조회하기

`@RequstBody` 애노테이션을 통해 조회하는 방법입니다. 눈으로 보기에는 가장 간단한 방법처럼 보이는데, 헤더에 대한 정보는 포함하지 않습니다. 메서드에 헤더 타입의 파라미터를 추가하거나, HttpEntity를 사용하면 헤더를 같이 조회할 수 있습니다.

```java
@ResponseBody
@PostMapping("/request-body-string-v4")
public String requestBodyStringV4(@RequestBody String messageBody) {
	log.info("messageBody={}", messageBody);
	return "ok";
}
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

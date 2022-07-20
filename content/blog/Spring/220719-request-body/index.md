---
title: 요청의 바디 조회하기
date: '2022-07-19 00:00:04'
category: Spring
draft: false
---

앞 포스트에서 URL과 Form 데이터를 통해 전달되는 파라미터를 조회했지만,
JSON처럼 바디를 통해 전달되는 데이터도 많습니다. (사실 Form 데이터도 바디에 저장되는 데이터지만, Spring에선 특별히 URL 쿼리 파라미터와 같은 방법으로 조회할 수 있는 기능을 제공합니다.)

## 바디에 있는 텍스트를 조회하는 경우

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

### 4. @RequestBody를 통해 조회하기

`@RequstBody` 애노테이션을 통해 조회하는 방법입니다. 눈으로 보기에는 가장 간단한 방법처럼 보이는데, 헤더에 대한 정보는 포함하지 않습니다. 메서드에 헤더 타입의 파라미터를 추가하거나, HttpEntity를 사용하면 헤더를 같이 조회할 수 있습니다.

```java
@ResponseBody
@PostMapping("/request-body-string-v4")
public String requestBodyStringV4(@RequestBody String messageBody) {
	log.info("messageBody={}", messageBody);
	return "ok";
}
```

## 바디에 있는 JSON 데이터를 조회하는 경우

바디에 있는 텍스트 데이터를 가져오는 것은 같지만 객체로 변환하는 과정이 추가되기도 하고,
아예 처음부터 객체를 파라미터로 받기도 합니다.

### 1. HttpServletRequest를 통해 조회하기

앞의 예제에서도 HttpServletRequest를 통해 바디의 데이터를 조회했습니다.
단 대상이 JSON 데이터인만큼, 텍스트 데이터를 파싱하여 객체로 변환해주는 작업이 추가되었습니다.

객체 변환에 사용되는 라이브러리에는 여러 가지가 있지만, 해당 예제에서는 Jackson을 사용합니다.
Jackson의 ObjectMapper를 통해 바디에서 읽은 데이터를 HelloData 객체로 변환합니다.

```java
package hello.springmvc.basic.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import hello.springmvc.basic.HelloData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Controller
public class RequestBodyJsonController {

	private ObjectMapper objectMapper = new ObjectMapper();

	@PostMapping("/request-body-json-v1")
	public void requestBodyJsonV1(HttpServletRequest request, HttpServletResponse response) throws IOException {
		ServletInputStream inputStream = request.getInputStream();
		String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

		log.info("messageBody={}", messageBody);
		HelloData data = objectMapper.readValue(messageBody, HelloData.class);
		log.info("username={}, age={}", data.getUsername(), data.getAge());

		response.getWriter().write("ok");
	}
```

### 2. @RequestBody를 통해 조회하기

`@RequestBody`를 사용해 문자열 데이터를 파라미터로 받았습니다.
역시나 ObjectMapper를 통해 문자열 데이터를 HelloData 객체로 변환합니다.

```java
@ResponseBody
@PostMapping("/request-body-json-v2")
public String requestBodyJsonV2(@RequestBody String messageBody) throws IOException {
	HelloData data = objectMapper.readValue(messageBody, HelloData.class);
	log.info("username={}, age={}", data.getUsername(), data.getAge());
	return "ok";
}
```

하지만 객체로 변환하는 작업을 꼭 직접 해야 할까요?
`@RequestBody`를 통해 HelloData 타입의 파라미터를 받는 것도 가능합니다.

```java
@ResponseBody
@PostMapping("/request-body-json-v3")
public String requestBodyJsonV3(@RequestBody HelloData data) {
	log.info("username={}, age={}", data.getUsername(), data.getAge());
	return "ok";
}
```

### 3. HttpEntity를 통해 조회하기

HttpEntity를 통해 객체를 받아오는 것도 가능합니다.

```java
@ResponseBody
@PostMapping("/request-body-json-v4")
public String requestBodyJsonV4(HttpEntity<HelloData> httpEntity) {
	HelloData data = httpEntity.getBody();
	log.info("username={}, age={}", data.getUsername(), data.getAge());
	return "ok";
}
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

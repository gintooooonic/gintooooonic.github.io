---
title: 요청의 헤더 조회하기
date: '2022-07-19 00:00:02'
category: Spring
draft: false
---

## 헤더 조회하기

기본적으로 메서드의 파라미터를 통해 HTTP 헤더 값을 조회할 수 있습니다. 아래 소스 코드를 참고해주세요.

```java
package hello.springmvc.basic.request;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

@Slf4j
@RestController
public class RequestHeaderController {

	@RequestMapping("/headers")
	public String headers(HttpServletRequest request,
		HttpServletResponse response,
		HttpMethod httpMethod,
		Locale locale,
		@RequestHeader MultiValueMap<String, String> headerMap,
		@RequestHeader("host") String host,
		@CookieValue(value = "myCookie", required = false) String cookie
	) {
		log.info("request={}", request);
		log.info("response={}", response);
		log.info("httpMethod={}", httpMethod);
		log.info("locale={}", locale);
		log.info("headerMap={}", headerMap);
		log.info("header host={}", host);
		log.info("myCookie={}", cookie);

		return "ok";
	}
}
```

실행 결과는 다음과 같습니다.

```
request=org.apache.catalina.connector.RequestFacade@455add64
response=org.apache.catalina.connector.ResponseFacade@4701e8ff
httpMethod=GET
locale=ko_KR
headerMap={host=[localhost:8080], connection=[keep-alive], ...
header host=localhost:8080
myCookie=null
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

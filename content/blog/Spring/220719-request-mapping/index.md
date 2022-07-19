---
title: Spring MVC의 요청 매핑
date: '2022-07-19 00:00:01'
category: Spring
draft: false
---

클라이언트의 요청을 알맞은 메서드에서 받아 처리할 수 있도록
다양한 방법을 통해 요청과 메서드를 매핑해보겠습니다.

## 요청 매핑의 유형

### 1. @RequestMapping 애노테이션

기본적으로 `@RequestMapping` 애노테이션을 사용해 요청 매핑이 가능합니다.

```java
package hello.springmvc.basic.requestmapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
public class MappingController {

	private Logger log = LoggerFactory.getLogger(getClass()); // 로거

	// @GetMapping 같은 애노테이션과 달리, 모든 메서드의 요청과 매핑됨
	// 끝에 슬래시가 붙은 /hello-basic/과도 매핑됨
	@RequestMapping("/hello-basic")
	public String helloBasic() {
		log.info("helloBasic");
		return "ok";
	}
}
```

HTTP 메서드와 상관 없이 `/hello-basic` URL로 들어오는 모든 요청이 매핑됩니다.

```java
// method를 지정해주면 해당 메서드와 매핑됨
@RequestMapping(value = "/mapping-get-v1", method = RequestMethod.GET)
public String mappingGetV1() {
  log.info("mappingGetV1");
  return "ok";
}
```

HTTP 메서드를 지정해주면 해당 메서드의 요청과 매핑됩니다.

### 2. 축약 애노테이션

`@GetMapping`, `@PostMapping` 등의 축약 애노테이션을 사용해 요청 매핑합니다.
이름에서 예상할 수 있듯이 특정 HTTP 메서드와 매핑되는 애노테이션입니다.

```java
// @PostMapping, @PutMapping, @DeleteMapping 등등
@GetMapping(value = "/mapping-get-v2")
public String mappingGetV2() {
  log.info("mapping-get-v2");
  return "ok";
}
```

### 3. @PathVariable을 통해 파라미터 받기

`@PathVariable` 애노테이션을 사용하면 URL에 포함된 파라미터를 가져올 수 있습니다.

```java
// URL 파라미터 받기
@GetMapping("/mapping/{userId}")
public String mappingPath(@PathVariable("userId") String data) {
  log.info("mappingPath useerId={}", data);
  return "ok";
}

// 여러 개의 파라미터 받기
@GetMapping("/mapping/users/{userId}/orders/{orderId}")
public String mappingPath(@PathVariable String userId, @PathVariable Long orderId) {
  log.info("mappingPath userId={}, orderId={}", userId, orderId);
  return "ok";
}
```

받고자 하는 파라미터의 이름을 URL 패턴에서 중괄호 처리하고,
메서드의 파라미터에서 `@PathVariable` 애노테이션을 사용해 받아오는 것을 알 수 있습니다.

파라미터가 여러 개인 경우에도 가능하며, 만약 URL 패턴에서의 파라미터 이름과 메서드의 파라미터 이름이 같다면 `@PathVariable`의 인자를 생략할 수 있습니다.

### 4. 특정 쿼리 파라미터가 있는 경우에만 매핑

`params` 인자를 설정하면 URL의 쿼리스트링에 해당 파라미터가 있는 경우에만 매핑됩니다.

```java
@GetMapping(value = "/mapping-param", params = "mode=debug")
public String mappingParam() {
  log.info("mappingParam");
  return "ok";
}
```

예를 들어, `/mapping-param?mode=debug`로 요청한 경우에 매핑됩니다.

### 5. 특정 요청 헤더가 있는 경우에만 매핑

`headers` 인자를 설정하면, 요청 헤더에 해당 값이 있는 경우에만 매핑됩니다.

```java
// 특정 요청 헤더가 있는 경우에만 매핑됨
@GetMapping(value = "/mapping-header", headers = "mode=debug")
public String mappingHeader() {
  log.info("mappingHeader");
  return "ok";
}
```

예를 들어, 다음과 같은 요청을 받는 경우에 매핑됩니다.

```http
GET http://localhost:8080/mapping-header
mode: debug
```

### 6. 특정 미디어 타입인 경우에만 매핑

`consumes` 인자를 설정하면, `Content-Type` 미디어 타입이 맞는 경우에만 매핑됩니다.

```java
// Content-Type 미디어 타입이 맞으면 매핑됨
@PostMapping(value = "/mapping-consume", consumes = "application/json")
public String mappingConsumes() {
  log.info("mappingConsumes");
  return "ok";
}
```

`produces` 인자를 설정하면, `Accept` 미디어 타입이 맞는 경우에만 매핑됩니다.

```java
// Accept 미디어 타입이 맞으면 매핑됨
@PostMapping(value = "/mapping-produce", produces = "text/html")
public String mappingProduces() {
  log.info("mappingProduces");
  return "ok";
}
```

> **Content-Type과 Accept 미디어 타입의 차이**
>
> Content-Type의 경우 요청과 응답에 대한 미디어 타입을 정의합니다.
> 반면 Accept의 경우 클라이언트가 받을 응답에 대한 미디어 타입을 정의합니다.

## 예제: 유저 컨트롤러

유저에 대한 컨트롤러라고 가정하고 요청 매핑만을 작성한 소스 코드입니다.

```java
package hello.springmvc.basic.requestmapping;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mapping/users")
public class MappingClassController {

	@GetMapping
	public String users() {
		return "get users";
	}

	@PostMapping
	public String addUser() {
		return "post user";
	}

	@GetMapping("/{userId}")
	public String findUser(@PathVariable String userId) {
		return "get userId=" + userId;
	}

  // PUT 메서드 : 리소스의 모든 것을 업데이트
  // PATCH 메서드 : 리소스의 일부를 업데이트
	@PatchMapping("/{userId}")
	public String updateUser(@PathVariable String userId) {
		return "update userId=" + userId;
	}

	@DeleteMapping("/{userId}")
	public String deleteUser(@PathVariable String userId) {
		return "delete userId=" + userId;
	}
}
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

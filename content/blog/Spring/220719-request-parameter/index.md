---
title: 요청의 파라미터 조회하기
date: '2022-07-19 00:00:03'
category: Spring
draft: false
---

요청에 담긴 파라미터를 조회하는 방법에 대해 알아보겠습니다.
URL에 들어간 쿼리 파라미터와 HTML Form으로 전달된 파라미터를 조회합니다.

## 파라미터 조회 유형

### 1. HttpServletRequest로 조회하기

메서드의 파라미터를 HttpServletRequest로 받아 파라미터를 조회할 수 있습니다.

```java
package hello.springmvc.basic.request;

import hello.springmvc.basic.HelloData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Slf4j
@Controller
public class RequestParamController {

	@RequestMapping("/request-param-v1")
	public void requestParamV1(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String username = request.getParameter("username");
		int age = Integer.parseInt(request.getParameter("age"));
		log.info("username={}, age={}", username, age);

		response.getWriter().write("ok");
	}
}
```

### 2. @RequestParam으로 조회하기

메서드의 파라미터에 `@RequestParam` 애노테이션을 사용하여 파라미터를 받을 수 있습니다.

```java
@ResponseBody
@RequestMapping("/request-param-v2")
public String requestParamV2(
		@RequestParam("username") String memberName,
		@RequestParam("age") int memberAge
) {
	log.info("username={}, age={}", memberName, memberAge);
	return "ok";
}
```

파라미터 `username`는 변수 `memberName`로, 파라미터 `age`는 변수 `memberAge`로 조회할 수 있습니다.

#### 파라미터 이름 생략

파라미터의 이름과 변수의 이름이 같은 경우, `@RequestParam`의 인자를 생략할 수 있습니다.

```java
@ResponseBody
@RequestMapping("/request-param-v3")
public String requestParamV3(
		@RequestParam String username,
		@RequestParam int age
) {
	log.info("username={}, age={}", username, age);
	return "ok";
}
```

#### @RequestParam 생략

만약 파라미터를 받는 변수의 타입이 String, int, Integer 등 단순 타입이라면
`@RequestParam` 애노테이션을 생략할 수 있습니다.

```java
@ResponseBody
@RequestMapping("/request-param-v4")
public String requestParamV4(String username, int age) {
	log.info("username={}, age={}", username, age);
	return "ok";
}
```

하지만 생략 시 해당 파라미터의 `required` 옵션 값은 `false`가 된다는 점은 유의해야 하며, `@RequestParam` 애노테이션까지 생략하는 것은 조금 과하다는 의견 또한 존재합니다.

#### required 옵션

`required` 옵션은 해당 파라미터가 필수적으로 입력되어야 하는지, 아니면 옵셔널한지를 설정합니다.

```java
@ResponseBody
@RequestMapping("/request-param-required")
public String requestParamRequired(
		@RequestParam(required = true) String username,
		@RequestParam(required = false) Integer age // null 들어올 수 있으니까
) {
	log.info("username={}, age={}", username, age);
	return "ok";
}
```

이 경우 username은 꼭 입력 받아야 하는 파라미터가 되고, age는 입력이 없으면 null로 설정됩니다. nullable하므로 int 대신 Integer 타입을 사용했습니다.

시행착오를 방지하기 위해 적어놓자면, `required`를 `true`로 설정해도 빈 문자열이 들어오는 경우는 있습니다. 요청 시 파라미터에 값이 없이 이름만 있는 경우, 해당 파라미터에는 빈 문자열이 입력됩니다.

#### defaultValue 옵션

파라미터에 값이 없을 때 `defaultValue`로 설정된 값이 자동으로 채워집니다.

```java
@ResponseBody
@RequestMapping("/request-param-default")
public String requestParamDefault(
		@RequestParam(required = true, defaultValue = "guest") String username,
		@RequestParam(required = false, defaultValue = "-1") int age
) {
	log.info("username={}, age={}", username, age);
	return "ok";
}
```

위 소스 코드에서는 `defaultValue`와 함께 `required` 옵션도 설정했지만, 사실 `defaultValue`가 설정된 경우 파라미터는 항상 값을 가지게 되므로 `required` 옵션은 무의미합니다.

### 3. Map으로 파라미터 조회하기

여전히 `@RequestParam` 애노테이션을 사용하지만, 타입을 Map으로 받는 경우입니다.
단 파라미터의 경우 하나의 Key에 여러 개의 Value가 입력되기도 하는데, 이때는 Map 대신 MultiValueMap을 사용하면 모든 Value를 조회할 수 있습니다.

```java
@ResponseBody
@RequestMapping("/request-param-map")
public String requestParamMap(@RequestParam Map<String, Object> paramMap) {
	log.info("username={}, age={}", paramMap.get("username"), paramMap.get("age"));
	return "ok";
}
```

### 4. @ModelAttribute로 조회하기

위에서 줄곧 `@RequestParam`으로 파라미터를 조회했지만,
`@ModelAttribute` 애노테이션을 사용하면 객체 통째로 파라미터를 입력 받을 수 있습니다.

```java
@ResponseBody
@RequestMapping("/model-attribute-v1")
public String modelAttributeV1(@ModelAttribute HelloData helloData) {
	log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());
	return "ok";
}
```

Spring은 먼저 HelloData 타입의 객체를 생성합니다. 그리고 들어온 요청 파라미터의 이름으로 HelloData 객체의 Setter 메서드를 찾아 호출합니다. 이를 바인딩한다고 표현합니다.

`@ModelAttribute`를 생략하는 것도 가능합니다.

```java
@ResponseBody
@RequestMapping("/model-attribute-v2")
public String modelAttributeV2(HelloData helloData) {
	log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());
	return "ok";
}
```

앞에서 사용한 `@RequestParam`도 생략이 가능하다고 했는데, 그럼 애노테이션이 생략되어 있는 소스 코드를 보고 `@RequestParam`인지 `@ModelAttribute`인지 어떻게 알 수 있을까요?

Spring에선 기본적으로 이런 규칙을 사용합니다.

- String, int, Integer 같은 단순 타입이면 `@RequestParam`
- 나머지 타입은 `@ModelAttribute` (단, argument resolver로 지정한 타입 외)

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

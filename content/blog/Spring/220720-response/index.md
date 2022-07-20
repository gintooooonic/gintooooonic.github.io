---
title: HTTP API에서 응답하기
date: '2022-07-20 00:00:00'
category: Spring
draft: false
---

HTTP 응답을 위한 방법들이 정리된 예제 소스 코드입니다.
편하게 참고하기 위해 올리는 것으로, 설명은 주석으로 대체합니다.

```java
package hello.springmvc.basic.response;

import hello.springmvc.basic.HelloData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Controller
// @RestController // 모든 메서드에 @ResponseBody가 적용되는 효과
public class ResponseBodyController {

	// HttpServletResponse 사용
	// OutputStream을 통해 직접 작성
	@GetMapping("/response-body-string-v1")
	public void responseBodyV1(HttpServletResponse response) throws IOException {
		response.getWriter().write("ok");
	}

	// HttpEntity의 자식인 ResponseEntity 사용
	// 상태코드를 응답에 추가
	@GetMapping("/response-body-string-v2")
	public ResponseEntity<String> responseBodyV2() {
		return new ResponseEntity<>("ok", HttpStatus.OK);
	}

	// @ResponseBody를 사용하는 방법
	@ResponseBody
	@GetMapping("/response-body-string-v3")
	public String responseBodyV3() {
		return "ok";
	}

	// HttpEntity의 자식인 ResponseEntity를 사용
	// HelloData 객체를 담아 반환 -> JSON
	@GetMapping("/response-body-json-v1")
	public ResponseEntity<HelloData> responseBodyJsonV1() {
		HelloData helloData = new HelloData();
		helloData.setUsername("userA");
		helloData.setAge(20);

		return new ResponseEntity<>(helloData, HttpStatus.OK);
	}

	// @ResponseBody 사용
	// HelloData 객체를 반환
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	@GetMapping("/response-body-json-v2")
	public HelloData responseBodyJsonV2() {
		HelloData helloData = new HelloData();
		helloData.setUsername("userA");
		helloData.setAge(20);

		return helloData;
	}
}
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

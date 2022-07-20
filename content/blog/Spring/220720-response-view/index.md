---
title: 뷰 응답하기
date: '2022-07-20 00:00:00'
category: Spring
draft: false
---

## 정적 리소스

정적 리소스는 컨트롤러가 별도로 넘겨주도록 하지 않아도
특정 경로의 URL을 통해 접근할 수 있습니다.
주로 정적 리소스에 해당하는 파일 유형은 HTML, CSS, JS 파일 등이 있습니다.

Spring Boot에서 정적 리소스의 경로는 기본적으로
`src/main/resources/static`입니다.
만약 `static` 디렉터리 아래에 `basic/hello.html` 리소스 파일이 있다면,
`/basic/hello.html` URL 경로로 접근할 수 있습니다.

## 뷰 템플릿

Thymeleaf와 같은 템플릿 엔진을 사용해 뷰를 보여주는 방법이 있는데,
뷰 템플릿과 함께 컨트롤러에서 전달한 데이터가 더해져 화면이 구성되곤 합니다.

`src/main/resources/templates` 경로에 뷰 템플릿을 작성하면
뷰 이름을 통해 접근할 수 있습니다.

아래는 뷰를 생성해 반환하기 위한 컨트롤러 예제 소스 코드입니다.

### 1. ModelAndView 사용하기

ModelAndView 객체를 생성해 뷰의 이름과 전달 데이터를 넘겨 반환하는 방법이 있습니다.

```java
@RequestMapping("/response-view-1")
public ModelAndView responseViewV1() {
	ModelAndView mav = new ModelAndView("response/hello")
			.addObject("data", "hello!");
	return mav;
}
```

### 2. Model 파라미터와 뷰 이름 반환

ModelAndView를 사용하는 대신, 모델과 뷰를 따로 처리하는 방법입니다.
파라미터로 전달받은 Model 객체에 뷰에 전달할 데이터를 넘깁니다.
이와 별개로 뷰는 뷰의 이름을 문자열로 반환함으로써 사용할 수 있습니다.

```java
@RequestMapping("/response-view-2")
public String responseViewV2(Model model) {
	model.addAttribute("data", "hello!!");
	return "response/hello";
}
```

메서드의 반환 타입을 `void`로 설정하고 뷰의 이름을 반환하지 않을 수도 있습니다.
이럴 때는 요청 매핑 URL이 뷰 이름으로 사용됩니다.

하지만 일반적으로 요청 매핑 URL이 항상 뷰의 이름과 일치할 것이라 기대하기 어렵고,
어떤 뷰를 띄울 것인지에 대한 명시성이 떨어져 추천하지 않는 방법입니다.

```java
@RequestMapping("/response/hello")
public void responseViewV3(Model model) {
	model.addAttribute("data", "hello!!");
}
```

## Reference

- [김영한, 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1)

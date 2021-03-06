---
title: 싱글톤 패턴
date: '2022-02-10 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. 싱글톤 패턴

- 서버 어플리케이션은 다수의 사용자들에게 요청을 받음
- 만약 요청을 받을 때마다 Service 객체가 새로 생성된다면, 메모리 자원의 낭비
- 이미 만들어둔 객체를 공유해 여러번 사용하는 효율적인 방법
- 단점도 존재하며, 안티 패턴으로 보는 시각도 있음
- Spring의 싱글톤 컨테이너는 싱글톤 패턴의 단점들을 해결했다고 함

> #### 싱글톤 패턴의 단점
>
> - 싱글톤 패턴 구현을 위해 늘어나는 코드의 양
> - 클라이언트가 구체 클래스에 의존하는 경우가 발생할 수 있음 (DIP 위반)
> - DIP 위반에 따라 OCP도 위반할 가능성
> - 테스트가 어려움
> - 내부 속성의 변경과 초기화가 어려움
> - private 생성자로 자식 클래스를 만들기 어려움
> - 유연성이 떨어짐

```java
public class SingletonClass {
    private static final SingletonClass instance = new SingletonClass();

    private SingletonClass() { /* new를 통한 객체 생성 방지 */ }

    public static SingletonClass getInstance() {
        return instance;
    }
}
```

## 2. 싱글톤 컨테이너

- Spring의 IoC 컨테이너는 기본적으로 싱글톤 패턴을 통해 객체를 관리
- 한 번 생성해둔 객체를 가져다 쓸 수 있도록 보장

### 싱글톤 컨테이너가 아닌 경우

```java
public class AppConfig {
  public MemberService memberService() {
    System.out.println("call AppConfig.memberService");
    return new MemberServiceImpl(memberRepository());
  }

  public MemberRepository memberRepository() {
    System.out.println("call AppConfig.memberRepository");
    return new MemoryMemberRepository();
  }

  public OrderService orderService() {
    System.out.println("call AppConfig.orderService");
    return new OrderServiceImpl(memberRepository());
  }
}
```

```java
AppConfig appConfig = new AppConfig();
MemberService memberService = appConfig.memberService();
MemberRepository memberRepository = appConfig.memberRepository();
OrderService orderService = appConfig.orderService();
```

```
[출력]
call AppConfig.memberService
call AppConfig.memberRepository
call AppConfig.memberRepository
call AppConfig.orderService
call AppConfig.memberRepository
```

- memberRepository 객체가 여러번 생성됨
- 당연히 서로 주소가 다른 객체

### 싱글톤 컨테이너인 경우

```java
@Configuration
public class AppConfig {
  @Bean
  public MemberService memberService() {
    System.out.println("call AppConfig.memberService");
    return new MemberServiceImpl(memberRepository());
  }

  @Bean
  public MemberRepository memberRepository() {
    System.out.println("call AppConfig.memberRepository");
    return new MemoryMemberRepository();
  }

  @Bean
  public OrderService orderService() {
    System.out.println("call AppConfig.orderService");
    return new OrderServiceImpl(memberRepository());
  }
}
```

```
[출력]
call AppConfig.memberService
call AppConfig.memberRepository
call AppConfig.orderService
```

- 싱글톤 패턴이 적용되어 memberRepository가 한번만 생성됨
- 이미 만들어진 하나의 객체를 쭉 사용

## 3. 싱글톤 패턴에 따른 주의 사항

- 컨테이너에 올라갈 객체는 항상 Stateless하게 설계하자
  - 특정 클라이언트에 의존적이지 않도록
  - 가급적 읽기만 가능하도록
- 싱글톤 패턴에 의해, 객체의 필드가 여러 클라이언트에게 공유되기 때문
- 심각한 서비스 장애를 야기할 수 있음

## 4. Spring은 어떻게 싱글톤 패턴을 지원할까

- 위 [Spring 컨테이너](#spring-컨테이너인-경우)의 AppConfig 코드를 보면,
  결국 `memberRepository()`가 여러번 실행되므로 `new` 연산도 여러번 실행되어야할 것 같음
- Spring은 어떻게 싱글톤 패턴을 적용하는 걸까?
- CGLIB을 통한 바이트 코드 단위의 조작 발생
  - AppConfig 클래스를 사용하는 것이 아니라, AppConfig를 상속하는 임의의 클래스를 생성함
  - 바이트 코드의 조작을 통해, 이미 객체가 생성되어 있다면 있는 객체를 반환하는 로직이 작성되어 있을 것

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)
- [Core Technologies - Spring](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)

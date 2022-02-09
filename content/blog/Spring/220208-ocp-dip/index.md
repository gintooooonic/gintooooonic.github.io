---
title: OCP와 DIP 위반 문제
date: '2022-02-08 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. OCP와 DIP

- 객체 지향의 다섯 가지 원칙인 SOLID에 속함.
- OCP (Open/Closed Principle) : 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.
- DIP (Dependency Inversion Principle) : 구체화에 의존하지 말고 추상화에 의존해야 한다.
- 객체 지향 언어인 Java를 통해 Spring 어플리케이션을 개발하는 만큼, 이러한 객체 지향 원칙들을 따르는 것이 도움이 됨.

## 2. OCP와 DIP의 위반 문제

- 실제 어플리케이션 구현시 OCP와 DIP를 지키는 것이 쉽지 않음.
- 다음은 Service와 Repository의 관계를 표현한 예시 코드. MemberService가 MemberRepository를 의존하는 상황이며, 전자는 클라이언트고 후자는 서버가 됨.

```java
public class MemberService {
  private MemberRepository memberRepository = new MemoryMemberRepository();
  // or
  // private MemberRepository memberRepository = new JdbcMemberRepository();
}
```

- 시나리오 : 메모리에 데이터를 저장하는 MemoryMemberRepository 대신에 DB를 사용하도록 JdbcMemberRepository를 사용하도록 기능을 변경해야 한다.
  - OCP 위반 : JdbcMemberRepository를 사용하기 위해 클라이언트 코드인 MemberService의 변경이 불가피함.
  - DIP 위반 : MemberService는 MemberRepository뿐만 아니라 그 구현체인 MemoryMemberRepository도 의존하고 있음.

## 3. 문제 해결

### 문제가 왜 발생했을까?

- 의존하는 객체의 사용과 구성, 두 가지의 책임을 모두 클라이언트에서 담당하고 있음.
- MemberService는 MemberRepository를 가져다 사용하는 동시에, MemoryMemberRepository를 생성해 MemberRepository를 구성하는 작업도 같이 수행함.
- 객체를 구성하는 작업은 클라이언트에서 수행하지 않는 것이 좋겠다.

### 사용 영역과 구성 영역의 분리

- 사용 영역 : 객체를 사용하는 코드. MemberService가 될 것임.
- 구성 영역 : 사용할 객체를 구성하는 코드. (Configuration) 아래 AppConfig에서 담당.

#### AppConfig

- 객체를 구성하는 코드를 여기에 모아 놓자.
- AppConfig는 구현체를 생성하여 클라이언트에게 생성자를 통해 주입해준다.
  - 클라이언트 클래스에는 구현 객체를 받을 생성자가 필요.
  - AppConfig에서는 생성자의 인자로 구현 객체를 넘겨 줌.
- 앞으로 구현체의 변경이 발생하면, 클라이언트 코드를 변경하지 않고 AppConfig만 변경하면 됨.

```java
public class MemberService {
  private MemberRepository memberRepository;

  public MemberService(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
}
```

```java
public class AppConfig {
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }

  public MemberService memberService() {
    return new MemberService(memberRepository());
  }
}
```

```java
public class App {
  public static void main(String[] args) {
    AppConfig appConfig = new AppConfig();
    MemberService memberService = appConfig.memberService();
    ...
  }
}
```

#### 문제가 해결되었나?

- OCP : MemoryMemberRepository 대신 JdbcMemberRepository로 변경시, 클라이언트인 MemberService에는 변경 사항이 발생하지 않고 AppConfig만 변경해주면 됨.
- DIP : MemberService가 MemberRepository에만 의존하고 있음.
- 문제가 해결됨.

## 3. Dependency Injection

- MemberService는 MemberRepository에 의존하고 있음.
- 하지만 MemberService 입장에서는 실제로 어떤 구현 객체를 사용하게 될지 실행 전에는 알 수 없음.
- 실행 시점에 AppConfig가 구현 객체를 생성해 MemberService에게 전달해주어야 실제 의존 관계가 연결이 됨.
- 런타임에 서버의 실제 구현체가 클라이언트에 전달되어 의존 관계가 연결되는 것을 Dependency Injection, 줄여서 DI라고 표현.

## 4. Inversion of Control

- AppConfig를 통한 문제 해결 전에는, 클라이언트인 MemberService가 직접 MemberRepository 구현체를 생성해 사용함. 프로그램의 제어 흐름이 MemberService 본인에게 있었음.
- AppConfig 사용 후, 프로그램의 제어권은 AppConfig로 이전됨. 어떤 구현 객체를 사용할지 AppConfig가 결정하고 생성함.
- 프로그램의 제어 흐름을 직접 제어하지 않고 외부에서 담당하는 형태를 Inversion of Control, 줄여서 IoC라고 표현.

## 5. Spring에서는..

- Spring 컨테이너를 통해 DI와 IoC와 같은 기능들을 제공.
- `@Configuration`, `@Bean`, `ApplicationContext` 등

```java
@Configuration
public class AppConfig {
  @Bean
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }

  @Bean
  public MemberService memberService() {
    return new MemberService(memberRepository());
  }
}
```

```java
public class App {
  public static void main(String[] args) {
    ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
    MemberService memberService = applicationContext.getBean("memberService", MemberService.class);
    ...
  }
}
```

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)

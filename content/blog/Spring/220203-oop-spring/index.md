---
title: 객체 지향과 Spring 프레임워크
date: '2022-02-03 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. Spring을 왜 사용할까

### Spring이 등장한 배경

- 과거 EJB(Enterprise Java Beans)가 많이 사용되었음 (Java EE의 핵심 기술. 즉, 표준이었기 때문에)
- EJB가 갖고 있던 문제점
  - 굉장히 비쌈
  - 실무에서 너무 복잡하고 느려서 불편함
- Rod Johnson, "Expert One-on-One J2EE Design and Development"에서
  EJB를 지적하면서 훨씬 더 단순한 예제 코드를 수록하였음
  - EJB 없어도 충분히 훌륭한 어플리케이션 개발 가능
  - BeanFactory, ApplicationContext, POJO, IoC, DI 등
    현재 스프링의 핵심 기술들이 모두 들어있음
  - Juergen Hoeller, Yann Caroff와 함께 Spring 프레임워크로 발전시켜 2003년애 1.0 버전을 릴리즈

### Spring의 특장점 - 좋은 객체 지향 프로그래밍

- Spring의 장점은 여러 가지가 있지만..
- Spring은 좋은 객체 지향 프로그래밍을 할 수 있도록 도와줌
  - 객체 지향 언어인 Java의 특징을 적극적으로 활용
  - 객체 지향의 원칙을 살리기 위한 기술들을 내포

### 잠깐, 용어 정리!

- Spring이 뭔가요?
  - Spring 생태계 전반 (Spring Framework, Spring Boot 등)
  - Spring Framework
  - Spring의 DI 컨테이너 기술
- Spring Boot : 설정을 간편화하고 Tomcat 웹 서버를 내장하는 등
  Spring Framework를 더 편하게 사용할 수 있도록 지원
- Spring Data, Spring Security와 같은 다양한 프로젝트에 대해서는
  [Spring 공식 페이지](https://spring.io/projects)를 참고

## 2. 객체 지향 프로그래밍과 Spring

### 객체 지향 프로그래밍의 특징

- 추상화
- 캡슐화
- 상속
- ⭐ **다형성** ⭐

### 다형성

> In programming languages and type theory, polymorphism(다형성) is the provision of a single interface to entities of different types or the use of a single symbol to represent multiple different types. (Wikipedia)

- 역할과 구현의 구분
  - 자동차와 아반떼의 구분
  - 배역과 배우의 구분
  - 인터페이스와 구현 클래스의 구분
- 클라이언트 코드는 서버 코드의 구현에 대해서 알 필요 없이,
  역할에 대해서만 알고 있으면서 동작해야 함
- 유연하고 변경이 용이한 프로그램 (변경해야하는 코드가 적다! 컴퓨터 부품 갈아끼우듯이)

### 객체 지향 프로그래밍의 다섯 가지 원칙

- a.k.a. SOLID 원칙
- by Robert Martin

#### Single Responsibility Principle (SRP, 단일 책임 원칙)

- 한 클래스는 하나의 책임만을 가져야 한다.
- 클래스 변경시 파급 효과가 적으면 SRP를 잘 지킨 것

#### Open/Closed Principle (OCP, 개방-폐쇄 원칙)

- 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.
- 코드를 변경하지 않고 새로운 기능을 구현
- 다형성을 활용 (ex. 인터페이스를 구현하는 새로운 클래스를 생성해 갈아끼우기)
- 구현 객체를 변경하고자 하니 클라이언트 코드의 변경이 불가피한데?
  스프링에서 이 문제를 어떻게 해결할까?

```java
// 클라이언트인 MemberService는 서버인 MemberRepository에 의존
// MemberRepository의 구현체를 변경하려면 MemberService의 코드를 변경해야 함
// 이는 OCP에 위배됨

public class MemberService {
  // private MemberRepository memberRepository = new MemoryMemberRepository();
  private MemberRepository memberRepository = new JdbcMemberRepository();
}
```

#### Liskov Substitution Principle (LSP, 리스코프 치환 원칙)

- 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 변경 가능해야 한다.
- 컴파일에 성공하는 것을 넘어서, 하위 클래스는 인터페이스의 규약을 모두 지켜주어야
  믿고 사용할 수 있음

```
상위 클래스인 Car가 있다고 생각해보자.
Car는 주유를 위한 메서드와 남은 기름의 양을 나타내는 변수를 가지고 있다.

어느 날 기술의 발전으로 전기차가 등장하였다.
전기차는 기름을 사용하지 않으며 주유를 하지도 않는다.
전기차는 전기를 충전하여 동작한다.

주유 메서드에서 전기를 충전하도록 오버라이딩 해도 동작에는 이상이 없을 것이다.
하지만 이 메서드는 남은 기름의 양을 관리하지 않는다.

만약 Car에 차량 계기판을 위해 남은 기름의 양을 계산해주는 메서드가 있다면?
```

#### Interface Segregation Principle (ISP, 인터페이스 분리 원칙)

- 범용 인터페이스 하나보다는 특정 클라이언트를 위한 인터페이스 여러 개로 분리하는 것이 낫다.
- 운전자 클라이언트와 정비사 클라이언트를 위해
  자동차 인터페이스를 운전 인터페이스와 정비 인터페이스로 분리하자.
- 정비 인터페이스가 변해도 운전자에게 영향을 주지 않는다.

#### Dependency Inversion Principle (DIP, 의존관계 역전 원칙)

- 구체화에 의존하지 말고 추상화에 의존해야 한다.
- 구현 클래스에 의존하지 말고 인터페이스에 의존해야 한다.
- 구현에 의존하지 않고 역할에 의존해야 한다.
- 다형성!

```java
// 클라이언트인 MemberService가 인터페이스인 MemberRepository 뿐만 아니라
// 구현체인 JdbcMemberRepository에도 의존하고 있다!
// 이는 DIP에 위배됨

public class MemberService {
  private MemberRepository memberRepository = new JdbcMemberRepository();
}
```

### Spring에서의 객체 지향 프로그래밍

- 앞의 코드처럼 다형성만으로는 OCP와 DIP를 지킬 수 없었다.
- Spring은 DI(Dependency Injection) 컨테이너를 제공하여 이 문제를 해결
- 클라이언트 코드의 변경 없이 기능 확장이 가능
- 이로써 다시 이야기하자면, Spring은 좋은 객체 지향 프로그래밍을 할 수 있도록 도와줌

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)

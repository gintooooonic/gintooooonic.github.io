---
title: Spring의 IoC 컨테이너
date: '2022-02-09 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. IoC 컨테이너

- IoC 컨테이너, DI 컨테이너, Spring 컨테이너 등으로 불림
- 객체의 생성과 관리, 의존 관계의 연결을 담당. 이러한 객체들을 Bean이라고 부름
- 컨테이너에 Bean을 어떻게 구성할 것인지 Java 코드 또는 XML 등으로 프로그래머가 정의
- BeanFactory 또는 ApplicationContext가 곧 IoC 컨테이너

### Bean

- Spring에서 Bean이란 IoC 컨테이너에 의해 관리되는 객체
- 기본적으로 Singleton (Bean의 scope에 대해 알아보자)
- Spring의 Bean과 일반적인 Java의 Bean은 의미가 조금 다름. 또 Enterprise JavaBeans도 다른 개념.
  헷갈리게.. 나중에 따로 정리해보자

### BeanFactory와 ApplicationContext

- BeanFactory 인터페이스는 컨테이너의 구성 매커니즘과 기본적인 기능들을 제공
- ApplicationContext는 BeanFactory의 서브 인터페이스로서,
  아래 추가 기능들을 제공하는 BeanFactory의 Superset
  - 메시지 소스를 활용한 국제화 기능
  - 환경 변수
  - 애플리케이션 이벤트
  - 편리한 리소스 조회
- 직접 사용하는 것은 BeanFactory보다는 주로 ApplicationContext

## 2. IoC 컨테이너의 구성

- 컨테이너에 올라갈 Bean의 이름과 타입, 의존 관계등을 작성
- Java 코드나 XML 등 다양한 포맷으로 구성이 가능
- 컨테이너는 전달받은 구성 정보를 BeanDefinition 형태로 만들어 보유

### Java 코드로 구성

```java
// AppConfig.java

@Configuration
public class AppConfig {
  @Bean
  public MemberService memberService() {
    return new MemberServiceImpl(memberRepository());
  }

  @Bean
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }

  @Bean
  public OrderService orderService() {
    return new OrderServiceImpl(memberRepository(), discountPolicy());
  }

  @Bean
  public DiscountPolicy discountPolicy() {
    return new RateDiscountPolicy();
  }
}
```

```java
ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
MemberService memberService = ac.getBean("memberService", MemberService.class);
```

### XML 파일로 구성

```xml
<!-- appConfig.xml -->

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="memberService" class="hello.core.member.MemberServiceImpl">
    <constructor-arg name="memberRepository" ref="memberRepository" />
  </bean>
  <bean id="memberRepository" class="hello.core.member.MemoryMemberRepository" />
  <bean id="discountPolicy" class="hello.core.discount.RateDiscountPolicy" />
  <bean id="orderService" class="hello.core.order.OrderServiceImpl">
    <constructor-arg name="memberRepository" ref="memberRepository" />
    <constructor-arg name="discountPolicy" ref="discountPolicy" />
  </bean>

</beans>
```

```java
ApplicationContext ac = new GenericXmlApplicationContext("appConfig.xml");
MemberService memberService = ac.getBean("memberService", MemberService.class);
```

### BeanDefinition

- Bean의 메타 데이터로서, Bean 하나당 생성됨
- Bean의 구성 정보를 Java 코드로 받든 XML로 받든 BeanDefinition으로 변환
- 컨테이너는 BeanDefinition을 기반으로 Bean을 생성
- 어떤 정보가 포함되어 있을까?
  - BeanDefinition 객체를 직접 출력해보자
  - 아래 텍스트는 [Java 코드](#java-코드로-구성)로 구성한 memberService Bean의 메타 데이터를 출력한 것
  - 각 속성에 대한 자세한 내용은 [Spring 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition)를 참고

```
Root bean: class [null];
scope=;
abstract=false;
lazyInit=null;
autowireMode=3;
dependencyCheck=0;
autowireCandidate=true;
primary=false;
factoryBeanName=appConfig;
factoryMethodName=memberService;
initMethodName=null;
destroyMethodName=(inferred);
defined in hello.core.AppConfig
```

## 3. Bean 조회

- Bean을 조회하기 위한 메서드들을 제공
  - `getBean(name, type)`, `getBean(type)` : 이름과 타입을 조건으로 Bean을 조회해 반환하며, 중복된 Bean이 있는 경우 예외가 발생
  - `getBeansOfType(type)` : 타입 조건에 해당하는 모든 Bean들을 Map으로 반환
  - 타입으로 조회시 해당 타입의 자손에 해당하는 타입들도 해당됨
- `getBeanDefinitionNames()`, `getBeanDefinition()` 등을 통해 메타 데이터를 조회

```java
// 컨테이너의 모든 Bean들을 조회
void findAllBeans() {
  String[] beanDefinitionNames = applicationContext.getBeanDefinitionNames();
  for (String beanDefinitionName : beanDefinitionNames) {
    Object bean = applicationContext.getBean(beanDefinitionName);
    System.out.println("name = " + beanDefinitionName + " object = " + bean);
  }
}
```

```java
// 컨테이너의 모든 Application Bean들을 조회 (Spring에 의해 생성되는 Bean들을 제외)
void findAllApplicationBeans() {
  String[] beanDefinitionNames = applicationContext.getBeanDefinitionNames();
  for (String beanDefinitionName : beanDefinitionNames) {
    BeanDefinition beanDefinition = applicationContext.getBeanDefinition(beanDefinitionName);
    if (beanDefinition.getRole() == BeanDefinition.ROLE_APPLICATION) {
      Object bean = applicationContext.getBean(beanDefinitionName);
      System.out.println("name = " + beanDefinitionName + " object = " + bean);
    }
  }
}
```

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)
- [Core Technologies - Spring](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)

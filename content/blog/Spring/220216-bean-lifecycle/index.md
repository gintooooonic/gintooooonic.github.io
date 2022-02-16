---
title: Bean 생명 주기와 콜백
date: '2022-02-16 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. Bean 생명 주기

1. Spring 컨테이너 생성
2. Bean 생성
3. Bean 의존성 주입
4. **초기화 후 콜백 호출**
5. Bean 사용
6. **소멸 전 콜백 호출**
7. Spring 어플리케이션 종료

## 2. Bean의 초기화 콜백과 소멸 콜백

- Bean의 생성과 의존성 주입 이후 초기화를 위한 커스텀 메서드를 호출
- Bean의 소멸 직전 커스텀 메서드를 호출
- 커스텀 메서드의 등록은 아래 세 가지 방법에 의해 구현

### InitializingBean과 DisposableBean 인터페이스

- 초기화 메서드 : Bean 클래스에서 InitializingBean 인터페이스의 `afterPropertiesSet()`을 구현
- 소멸 전 메서드 : Bean 클래스에서 DisposableBean 인터페이스의 `destroy()`를 구현
- 현재는 많이 사용되지 않는 Spring 초창기의 방법
- 초기화 메서드와 소멸 전 메서드의 이름 변경 불가
- Spring에서만 동작하는 Spring 전용 인터페이스
- Bean 소스 코드를 수정해야 하므로 외부 라이브러리의 Bean에는 적용 불가

```java
public class MyBean implements InitializingBean, DisposableBean {
  @Override
  public void afterPropertiesSet() throws Exception {
    System.out.println("Bean이 초기화됩니다.");
  }

  @Override
  public void destroy() throws Exception {
    System.out.println("Bean이 소멸됩니다.");
  }
}
```

### @Bean의 initMethod와 destroyMethod 속성

- 초기화 메서드 : @Bean의 `initMethod` 속성
- 소멸 전 메서드 : @Bean의 `destroyMethod` 속성
- `destroyMethod` 속성의 기본 값은 `(inferred)`로, 메서드 이름을 통해 메서드의 추론이 이루어짐 (이름이 `close`나 `shutdown`인 메서드가 소멸 전 메서드가 됨)
- 메서드 이름을 자유롭게 사용 가능
- Spring에 의존하지 않는 Bean 작성 가능
- 외부 라이브러리에도 적용이 가능

```java
public class MyBean {
  public void init() throws Exception {
    System.out.println("Bean이 초기화됩니다.");
  }

  public void close() throws Exception {
    System.out.println("Bean이 소멸됩니다.");
  }
}
```

```java
@Configuration
class AppConfig {
  @Bean(initMethod = "init", destroyMethod = "close")
  public MyBean myBean() {
    return new MyBean();
  }
}
```

### @PostConstruct와 @PreDestroy 어노테이션

- 초기화 메서드 : @PostConstruct가 붙은 메서드
- 소멸 전 메서드 : @PreDestroy가 붙은 메서드
- Java 표준으로, Spring에 종속적이지 않고 다른 컨테이너에서도 사용 가능
- Bean 소스 코드를 수정해야 하므로 외부 라이브러리의 Bean에는 사용하지 못함

```java
public class MyBean {
  @PostConstruct
  public void init() throws Exception {
    System.out.println("Bean이 초기화됩니다.");
  }

  @PreDestroy
  public void close() throws Exception {
    System.out.println("Bean이 소멸됩니다.");
  }
}
```

### 결론은 @PostContstruct와 @PreDestroy를 권장

- 최신 Spring에서는 @PostContstruct와 @PreDestroy를 권장
- 외부 라이브러리에 적용해야 하는 경우에는 @Bean의 `initMethod`와 `destroyMethod` 속성 사용

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)

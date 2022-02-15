---
title: 컴포넌트 스캔과 의존성 자동 주입
date: '2022-02-14 00:00:00'
category: Spring
draft: false
---

![spring](spring.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://spring.io/
</p>

## 1. 컴포넌트 스캔

- 간단히 이야기하면 자동 Bean 등록
- `@Component`, `@ComponentScan` 등의 어노테이션을 통해 사용

### @Component 어노테이션

- 기존에는 Java 코드나 XML 포맷의 설정 파일을 통해 Bean을 등록했음
- 프로젝트 규모가 커지면 모든 Bean을 설정 파일에 적어 놓고 관리하기 어려울 수 있음
- `@Component`를 사용하면 설정 파일 없이 자동으로 컨테이너에 Bean을 등록함
- Bean으로 사용하고자 하는 클래스에 `@Component` 사용
- 즉, `@Component`는 스캔의 대상을 지정하는 역할

```java
@Component
public class MemberRepository {
  ...
}
```

### @Component를 포함하는 어노테이션

- 소스 코드를 열어보면 모두 `@Component`를 포함하고 있으며, 부가적인 기능을 같이 수행
- `@Controller` : Spring MVC 컨트롤러로 인식
- `@Repository` : Spring 데이터 접근 계층으로 인식, DB와 같은 데이터 계층의 예외를 Spring 예외로 변환
- `@Service` : 특별히 추가적인 기능은 없지만, 비즈니스 로직이 포함되어 있음을 개발자가 유추 가능
- `@Configuration` : Spring 설정 정보로 인식, Bean이 싱글톤을 유지하도록 처리

### @ComponentScan 어노테이션

- 컴포넌트 스캔을 사용하기 위해 설정 파일의 클래스에 `@ComponentScan` 사용
- 어떤 컴포넌트를 포함하고 제외할지, 어디부터 스캔할지 설정 가능
- `basePackages` 옵션 : 지정된 패키지의 하위 패키지를 모두 탐색
  - 기본값은 설정 파일이 속한 패키지
  - `basePackages`를 지정하지 않고 설정 파일을 최상단 패키지에 두는 방법을 많이 사용
  - 다수의 패키지 설정 가능
- `includeFilters` 옵션 : 컴포넌트 스캔 대상을 추가 지정
  - 필터의 타입과 클래스를 지정
  - 타입은 거의 `FilterType.ANNOTATION`이며, 기본값이기도 함 (생략 가능)
- `excludeFilters` 옵션 : 컴포넌트 스캔 제외 대상을 지정
  - `includeFilters`와 같음

```java
// MyIncludeComponent, MyExcludeComponent는
// 직접 작성한 임의의 클래스 (어노테이션)
@Configuration
@ComponentScan(
  basePackages = "hello.core",
  includeFilters = @ComponentScan.Filter(
    type = FilterType.ANNOTATION,
    classes = MyIncludeComponent.class
  ),
  excludeFilters = @ComponentScan.Filter(
    type = FilterType.ANNOTATION,
    classes = MyExcludeComponent.class
  )
)
static class AppConfig {}
```

### Bean 충돌 발생시

- Bean 등록시 충돌이 발생할 수 있음
- 자동으로 등록한 두 Bean의 충돌
  - `ConflictingBeanDefinitionException` 예외 발생
- 자동으로 등록한 Bean과 수동으로 등록한 Bean의 충돌
  - 최근의 Spring Boot는 예외가 발생하도록 되어 있으나, 아래 설정으로 수동 Bean이 자동 Bean을 오버라이딩하도록 변경 가능
  - `application.properties` 파일에 `spring.main.allow-bean-definition-overriding=true` 추가

## 2. 의존성 자동 주입

### 의존성 주입 방법

#### 생성자 주입

- 생성자에 `@Autowired`
- 생성자이므로 단 한 번만 실행되도록 보장되어, 주입 받는 객체의 변경이 발생하지 않음
- 필드를 `final`로 선언하면 컴파일 에러를 통해 반드시 주입이 이루어지도록 강제
- 불변, 필수적 의존 관계에 사용
- 생성자가 한 개인 경우 `@Autowired` 생략 가능

```java
@Component
public class OrderService {
  private final MemberRepository memberRepository;

  @Autowired
  public OrderService(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
}
```

#### Setter 주입

- Setter 메서드에 `@Autowired`
- 의존성 주입 이후에도 Setter 메서드를 통해 객체의 변경이 가능
- `@Autowired(required = false)`로 설정하면 주입 대상이 없어도 동작
- 가변, 선택적 의존 관계에 사용

```java
@Component
public class OrderService {
  private MemberRepository memberRepository;

  @Autowired
  public void setMemberRepository(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
}
```

#### 필드 주입

- 간결한 코드
- 외부에서 의존 객체를 지정할 방법이 없기 때문에 테스트가 어려움
- 같은 이유로, 의존성을 주입해주는 Spring이 없다면 사용할 방법이 없음
- 잘 사용하지 않음, 테스트 코드나 Spring의 Config 정도에서만 특별히 사용

```java
@Component
public class OrderService {
  @Autowired
  private MemberRepository memberRepository;
}
```

#### 일반 메서드 주입

- 잘 사용하지 않음

```java
@Component
public class OrderService {
  private MemberRepository memberRepository;

  @Autowired
  public void dependencyInjection(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
}
```

#### 그냥 생성자 주입 쓸래요

- 의존 관계가 불변, 필수적인 **생성자 주입**을 권장
- 대부분의 의존 관계는 불변
  - 불변이 좋은 설계
  - `Setter` 주입처럼 의존 객체를 변경할 가능성을 열어놓으면, 실수로 변경하여 문제가 발생할 수 있음
- 의존 객체가 누락되는 일이 없도록 함
  - Setter 주입을 사용해도 `Autowired(required = false)`가 아닌 이상 Spring 환경에서는 누락되었다는 에러를 띄워주지만,
    Spring이 없는 유닛 테스트 환경에서는 에러가 발생하지 않아 `NullPointException`이 발생
- 결론은 필드를 `final`로 선언하고 생성자 주입을 사용하자

#### Lombok으로 생성자 주입 더 편하게 쓰기

- `@RequiredArgsConstructor` : `final`이 붙은 필드를 모아 생성자를 자동으로 생성
- 생성자가 한 개인 경우에는 `@Autowired` 생략이 가능하니까
- Lombok 세팅 방법은 [여기](https://velog.io/@gillog/Intellij-lombok-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0Gradle-Plugin-Build-Annotation-%EC%84%A4%EC%A0%95-%ED%8F%AC%ED%95%A8)

```java
@Component
@RequiredArgsConstructor
public class OrderService {
  private final MemberRepository memberRepository;
}
```

### 자동 주입할 Bean이 없는 경우

- 자동 주입을 해야 하는데, 컨테이너에 주입 대상의 Bean이 없다면

#### Autowired(required = false)

- 주입할 Bean이 없으면 메서드 자체가 호출 안됨

```java
@Autowired(required = false)
public void setMemberRepository(MemberRepository memberRepository) {
  this.memberRepository = memberRepository;
}
```

#### org.springframework.lang.@Nullable

- 주입할 Bean이 없으면 대신 null 입력

```java
@Autowired
public void setMemberRepository(@Nullable MemberRepository memberRepository) {
  this.memberRepository = memberRepository;
}
```

#### Optional<>

- 주입할 Bean이 없으면 `Optional.empty` 입력

```java
@Autowired
public void setMemberRepository(Optional<MemberRepository> memberRepository) {
  if (memberRepository.isPresent())
    this.memberRepository = memberRepository.get();
  else
    this.memberRepository = null;
}
```

### 자동 주입할 Bean이 두 개 이상 조회되는 경우

- 예를 들어, 주입 받고자 하는 타입의 자식 타입 Bean들이 여러 개 있다면
- `NoUniqueBeanDefinitionException` 예외 발생

#### 이름으로 매칭

- 기본적으로 자동 주입은 타입으로 매칭
- 타입 매칭을 시도했는데 Bean이 여러 개 조회된다면, 필드나 파라미터 이름으로 추가 매칭
- 필드나 파라미터 이름이 특정 Bean의 이름과 같은 경우

```java
@Component
@Qualifier("memoryMemberRepository")
class MemoryMemberRepository extends MemberRepository {
  ...
}

@Component
class JdbcMemberRepository extends MemberRepository {
  ...
}
```

```java
@Autowired
public OrderService(MemberRepository jdbcMemberRepository) {
  this.memberRepository = jdbcMemberRepository;
}
```

#### @Qualifier

- `@Qualifier`로 추가 구분자를 지정
- `@Qualifier("jdbcMemberRepository")`를 못찾는 경우
  - 이름이 `jdbcMemberRepository`인 Bean을 조회
  - 웬만하면 Bean 이름이 아닌 Qualifier를 찾는 용도로만 사용하자

```java
@Component
@Qualifier("memoryMemberRepository")
class MemoryMemberRepository extends MemberRepository {
  ...
}

@Component
@Qualifier("jdbcMemberRepository")
class JdbcMemberRepository extends MemberRepository {
  ...
}
```

```java
@Autowired
public OrderService(@Qualifier("jdbcMemberRepository") MemberRepository memberRepository) {
  this.memberRepository = memberRepository;
}
```

#### @Primary

- 사용하고자 하는 Bean에 `@Primary`를 붙여 높은 우선순위를 부여
- 모든 Bean에 어노테이션을 붙여야 하는 `@Qualifier`보다 작성이 간편
- 더 상세하게 동작하는 `@Qualifier`보다는 실행 우선순위가 낮음

```java
@Component
class MemoryMemberRepository extends MemberRepository {
  ...
}

@Component
@Primary
class JdbcMemberRepository extends MemberRepository {
  ...
}
```

```java
@Autowired
public OrderService(MemberRepository memberRepository) {
  this.memberRepository = memberRepository;
}
```

#### 이름 매칭과 @Qualifier는 OCP와 DIP 위반 아닌가요?

- 내 생각에는..
- 이름 매칭
  - OCP : 필드나 파라미터의 이름의 수정이 불가피하여 클라이언트 코드의 변경이 발생하므로 OCP 위반
  - DIP : 필드와 파라미터의 이름이 구체적인 Bean을 가리킨다고 해서 의존한다고 말할 수 있나?
- @Qualifier
  - OCP : Qualifier 이름의 수정이 불가피하여 클라이언트 코드의 변경이 발생하므로 OCP 위반
  - DIP : Qualifier 이름을 통해 구체적인 Bean을 가리킨다고 해서 의존한다고 말할 수 있나?
- OCP는 위반한 것 같은데 DIP는 의존의 정의에 따라 달라질 것 같음

### 여러 개의 Bean 가져오기

- 특정 타입의 Bean을 모두 가져오고 싶다면
- 클라이언트가 동적으로 특정 Bean을 선택하게 만들고 싶은 경우
- List 또는 Map 사용

```java
@Component
public class OrderService {
  private final List<MemberRepository> repositories;
  private final Map<String, MemberRepository> repositoryMap;

  @Autowired
  public OrderService(List<MemberRepository> repositories, Map<String, MemberRepository> repositoryMap) {
    this.repositories = repositories;
    this.repositoryMap = repositoryMap;
  }
}
```

### 자동이냐 수동이냐, 그것이 문제로다

- 컴포넌트 스캔을 통한 자동 Bean 등록과 `@Autowired` 자동 의존성 주입을 사용할 것인지
- 아니면 Config 파일을 작성해 수동으로 Bean의 등록과 의존성 주입을 할 것인지

#### 자동 Bean 등록과 의존성 주입

- 최근 Spring은 자동을 선호하는 추세가 이어짐
- 자동으로 해도 OCP와 DIP를 지킬 수 있음

#### 수동 Bean 등록과 의존성 주입

- Bean이 매우 많아지면 Config 파일을 관리하는게 힘들어짐
- 어떤 Bean이 있는지 한눈에 확인할 수 있는 것은 장점

#### 자동을 기본으로

- 기본은 편리한 자동 기능을 사용하자
- 수동으로 하는 것이 좋은 경우는 수동을 사용하자
  - 기술 지원 빈은 수동으로 작성하여 명확하게
  - 다형성을 활용하는 경우는 수동으로 작성하여 파악이 쉽도록. 다형성에 의해 사용될 수 있는 자식 Bean들이 매우 많다면, 수동으로 작성하여 Config 파일에서 한눈에 확인할 수 있도록 하면 좋음

> #### 기술 지원 빈?
>
> - 업무 로직 빈 : 컨트롤러, 서비스, 레포지토리 등
> - 기술 지원 빈 : 기술적인 문제나 공통 관심사(AOP) 처리. 데이터베이스 연결, 공통 로그 처리 등의 하부 기술이나 공통 기술

## Reference

- [김영한, 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)

---
title: 엔티티 매핑
date: '2022-02-23 00:00:01'
category: JPA
draft: false
---

## 1. 객체와 테이블 매핑하기

- `@Entity`를 붙이면 JPA가 엔티티로서 관리하게 됨
  - 엔티티의 제약 조건은 다음과 같음
  - 기본 생성자가 필요
  - `final` 클래스, `inner` 클래스, `enum`, `interface` 사용 불가
  - 저장할 필드는 `final`로 선언하지 않음
- `@Table`을 통해 엔티티가 특정 이름의 테이블과 매핑되도록 지정 가능

```java
@Entity
@Table(name = "ODR")
public class Order { ... }
```

## 2. 필드와 컬럼 매핑하기

- `@Column`
  - 컬럼 매핑
  - `name` 속성을 통해 매핑할 컬럼의 이름 지정
  - `insertable`과 `updatable` 속성을 `false`로 지정하면 읽기 전용 설정 가능
  - 그 밖에 `nullable`이나 `unique` 같이 DDL에서 컬럼을 정의할때 사용하는 설정들을 속성을 통해 지정할 수 있음
- `@Temporal`
  - 날짜 타입 컬럼 매핑
  - `value` 속성이 `TemporalType.DATE`이면 date 타입과 매핑
  - `value` 속성이 `TemporalType.TIME`이면 time 타입과 매핑
  - `value` 속성이 `TemporalType.TIMESTAMP`이면 timestamp 타입과 매핑
  - LocalDate나 LocalDateTime 타입으로 필드 선언시 생략 가능
- `@Enumerated`
  - Enum 타입인 필드와 매핑
  - `value` 속성이 `EnumType.STRING`이면 Enum에서 선언된 이름을 테이블에 저장
  - `value` 속성이 `EnumType.ORDINAL`이면 Enum에서 선언된 순서가 숫자로 표현되어 테이블에 저장
  - `EnumType.ORDINAL`은 Enum의 정의가 변경되면 테이블의 기존 데이터가 무용지물이 되므로 사용을 지양
- `@Lob`
  - blob이나 clob 타입 컬럼 매핑
  - 필드의 타입이 `String`, `char[]`, `java.sql.CLOB`과 같은 문자면 clob 매핑
  - 나머지는 blob 매핑
- `@Transient`
  - 해당 필드는 매핑되지 않음
  - DB와 상관 없이 애플리케이션 메모리 상에서만 값을 보관하고 싶으면 사용

## 3. 기본 키 매핑하기

- 기본적으로 `@Id`를 통해 기본 키 매핑
- `@GeneratedValue`의 `strategy`를 설정하면 값의 자동 생성이 가능

```java
@Id @GeneratedValue(strategy = GenerationType.AUTO)
private Long id;
```

### @GeneratedValue의 strategy 속성

- `GenerationType.AUTO`
  - 기본값이며, DB 방언에 따라 자동 지정
- `GenerationType.IDENTITY`
  - DB에 위임
  - 예를 들어 MySQL은 `AUTO_INCREMENT` 사용
  - JPA에서 트랜잭션 커밋 후 INSERT 쿼리를 실행하면, 자동 지정된 ID 값을 알아옴
- `GenerationType.SEQUENCE`
  - DB의 시퀸스 사용
  - Oracle 시퀸스와 같은 DB의 시퀸스 기능을 사용
  - Oracle, PostgreSQL, DB2, H2 등
  - `@SequenceGenerator`를 통한 설정과 최적화 가능 (allocationSize 속성 등)
- `GenerationType.TABLE`
  - 키 생성용 테이블 별도 사용
  - 시퀸스와 달리 모든 DB에서 사용이 가능
  - 별도의 테이블을 통해 구현되므로 성능면에선 불리
  - `@TableGenerator`를 통해 설정 가능

## Reference

- [김영한, 자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic)

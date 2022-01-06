---
title: 스트림
date: '2022-01-06 00:00:01'
category: Java
draft: false
---

스트림은 데이터 소스를 추상화하여
데이터 소스가 무엇이든 같은 방식으로 다룰 수 있도록 한다.
또한 데이터를 다루는데 자주 사용되는 메서드들을 포함하고 있다.

여러 개의 문자열을 정렬하고 순서대로 출력하는 코드를
다음과 같이 작성할 수 있다.

```java
// 배열을 사용하는 경우
String[] strArr = { "aaa", "abc", "bbc" };
Arrays.sort(strArr);
for (String str : strArr)
  System.out.println(str);

// 스트림을 사용하는 경우
Stream<String> strStream = Arrays.stream(strArr);
strStream.sorted().forEach(System.out::println);
```

**스트림은 데이터 소스를 변경하지 않는다.**

데이터 소스를 읽을 뿐이다.

**스트림은 일회용이다.**

예를 들어 `forEach()`를 통해
모든 요소를 읽고 나면 해당 스트림을 다시 사용할 수 없다.

**스트림은 작업을 내부 반복으로 처리한다.**

반복문이 스트림의 메서드 내부에 있다는 뜻이다.
람다식을 매개 변수로 넘겨
반복하며 특정 작업을 수행하도록 할 수도 있다.

**스트림의 연산은 중간 연산과 최종 연산으로 나눌 수 있다.**

중간 연산은 연산의 결과로 스트림을 반환하여 중간 연산을 계속해 연결할 수 있다.

반면 최종 연산은 연산 결과가 스트림이 아니며, 스트림의 요소를 소모하기 때문에
단 한번만 연산이 가능하다. 위에서 언급한 `forEach()`가 최종 연산이다.

**최종 연산하기 전까지 중간 연산은 지연된다.**

중간 연산 메서드를 호출해도, 해당 연산이 즉시 수행되는 것은 아니다.
어떤 작업이 수행되어야 하는지 지정해주는 것 뿐이다.
최종 연산이 호출되어야 중간 연산들이 수행된다.

**기본 타입의 스트림이 제공된다.**

오토박싱과 언박싱으로 인한 비효율을 줄이기 위해
`IntStream`과 같은 기본 타입의 스트림이 제공된다.
일반적으로 `Stream<Integer>`보다 `IntStream`이 더 효율적이다.
또한 int 타입을 위한 추가적인 메서드들이 포함되어 있다.
`LongStream`과 `DoubleStream`도 있다.

**병렬 스트림으로 전환할 수 있다.**

`parallel()`을 통해 병렬 스트림으로 전환할 수 있다.
내부적으로 fork & join을 통해 작업을 병렬처리한다.

병렬로 처리되지 않도록 하려면 `sequential()`을 호출하는데,
기본이 병렬이 아니기 때문에 병렬 스트림으로 전환한 것을 취소하기 위해서만 사용한다.

## 스트림의 생성

### 1. 컬렉션

Collection 클래스에 `stream()`이 정의되어 있으므로,
그 자손인 컬렉션 클래스들은 이 메서드를 사용한다.

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = list.stream();
```

### 2. 배열

```java
Stream<T> Stream.of(T... values)
Stream<T> Stream.of(T[])
Stream<T> Arrays.stream(T[])
Stream<T> Arrays.stream(T[] array, int startInclusive, int endInclusive)
```

IntStream, LongStream, DoubleStream에도
`of()`가 정의되어 있다.

### 3. 정수

```java
IntStream stream1 = IntStream.range(1, 5); // 1, 2, 3, 4
IntStream stream2 = IntStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5
```

### 4. 난수

```java
IntStream intStream = new Random().ints();
intStream.limit(5).forEach(System.out::println);
```

Random 클래스에 `ints()`, `longs()`, `doubles()`가
정의되어 있으며, 크기가 정해지지 않은 무한 스트림을 반환한다.

`limits()`를 통해 크기를 지정해주거나,
생성시 매개변수를 넘겨 크기를 지정한다.

```java
IntStream ints(long streamSize)
```

- `ints()`의 범위 : Integer.MIN_VALUE 이상 Integer.MAX_VALUE 이하
- `longs()`의 범위 : Long.MIN_VALUE 이상 Long.MAX_VALUE 이하
- `doubles()`의 범위 : 0.0 이상 1.0 미만

스트림 생성시 매개변수를 넘겨 범위를 지정할 수 있다.

```java
IntStream ints(int begin, int end)
IntStream ints(long streamSize, int begin, int end)
```

### 5. 람다식

`iterate()`는 시드 값과 람다식을 매개 변수로 받아
무한 스트림을 생성한다. 시드 값이 람다식에 의해 계산되고,
그 결과가 다시 람다식에 의해 계산되고를 반복한다.

```java
// 0, 2, 4, 6, 8, ...
Stream<Integer> evenStream = Stream.iterate(0, n -> n + 2);
```

`generate()`는 람다식만을 매개 변수로 받아
무한 스트림을 생성한다. 매개 변수의 타입이 Supplier이므로
매개 변수가 없는 람다식만 넘길 수 있다.

```java
DoubleStream randomStream = Stream.generate(Math::random);
```

### 6. 파일

특정 디렉터리의 파일 목록을 소스로 하는 스트림,
파일의 행을 요소로 하는 스트림 등을 생성할 수 있다.

### 7. 빈 스트림

비어 있는 스트림을 생성할 수 있다.
스트림에 연산을 수행한 결과가 하나도 없는 경우,
null보다 빈 스트림을 반환하는 것이 좋다.

```java
Stream emptyStream = Stream.empty();
```

### 8. 두 스트림의 연결

`concat()`을 사용해 두 스트림을 하나로 연결할 수 있다.

```java
Stream<String> stream = Stream.concat(stream1, stream2);
```

## 스트림의 중간 연산

- 스트림을 자르기 위해 `skip()`과 `limit()`을 사용한다.
- 스트림의 요소를 걸러내기 위해 `filter()`와 `distinct()`를 사용한다.
- 스트림을 정렬하기 위해 `sorted()`를 사용한다.
- map 연산을 위해 `map()`을 사용한다.
- 요소를 소모하지 않고 스트림을 조회하기 위해 `peek()`을 사용한다.
- 타입 변환을 위한 map의 특수한 형태로서 `mapToInt()`, `mapToLong()`, `mapToDouble()`을 사용한다.
- T[]의 스트림을 T의 스트림으로 변환하기 위해 `flatMap()`을 사용한다.

## 스트림의 최종 연산

- 스트림의 요소를 순회하기 위해 `forEach()`를 사용한다.
- 스트림의 요소에 대한 조건 검사를 위해 `allMatch()`, `anyMatch()`, `noneMatch()`,
  `findFirst()`, `findAny()`를 사용한다.
- 스트림의 요소에 대한 통계를 얻기 위해 `count()`, `sum()`, `average()`, `max()`, `min()`을 사용한다.
- 스트림의 요소를 줄여나가며 연산하는 리듀싱 연산을 위해 `reduce()`를 사용한다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판

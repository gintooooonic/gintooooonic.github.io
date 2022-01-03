---
title: 제네릭스
date: '2022-01-03 00:00:00'
category: Java
draft: false
---

[제네릭 프로그래밍](https://en.wikipedia.org/wiki/Generic_programming)
이라는 프로그래밍 패러다임을 지원하기 위해
JDK 1.5에서 도입되었다.
여러 데이터 타입에 대해 호환되는
일반적인 알고리즘을 작성할 수 있다.

> Generic programming centers around the idea of abstracting from concrete, efficient algorithms
> to obtain generic algorithms that can be combined with different data representations
> to produce a wide variety of useful software.
>
> — Musser, David R.; Stepanov, Alexander A., Generic Programming

책에서
`제네릭스란 다양한 타입의 객체들을 다루는 메서드나 컬렉션 클래스에 컴파일 시의 타입 체크를 해주는 기능`
이라고 정의했는데, 잘 이해가 가지 않았다. 컴파일 타임에 타입 체크하는게 특별한 일인가?

ArrayList라는 컬렉션 클래스를 예로 들 수 있다.
기본적으로 ArrayList에는 다양한 타입의 객체를 삽입할 수 있다.

```java
ArrayList list = new ArrayList();
list.add(1);
list.add(4.5);
list.add("a");
```

다양한 타입을 저장할 수 있다는 말은 장점처럼 들리지만,
의도하지 않은 타입의 객체가 저장될 수 있을 뿐 아니라
저장된 객체를 꺼내오는 과정에서 잘못된 형변환에 의한
에러를 발생시킬 수도 있다. 타입 안정성이 낮다는 것이다.

제네릭스를 통해 어떤 타입의 객체를 다룰 것인지 미리 명시하고
컴파일 타임에 타입 체크가 이루어지도록 하면 이런 문제를 방지할 수 있다.

```java
ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(4.5); // compile error
list.add("a"); // compile error
```

> #### 제네릭스의 장점
>
> 1. 타입 안정성 향상
> 2. 타입 체크와 형변환을 생략한 간결한 코드 작성

## 제네릭 클래스

```java
class Box<T> {
  T item;

  void setItem(T item) { this.item = item; }
  T getItem() { return item; }
}
```

제네릭 클래스 `Box<T>`를 정의하였다.
아래처럼 다양한 타입을 명시하여 사용할 수 있다.
`String` 타입을 명시해주면 타입 변수 `T`가
`String`으로 치환된다고 생각할 수 있겠다.

```java
Box<String> b1 = new Box<String>();
b1.setItem("hello");
String s = b1.getItem();

Box<Integer> b2 = new Box<Integer>();
b2.setItem(1);
Integer i = b2.getItem();
```

> #### 용어 정리
>
> - `Box<T>` : 제네릭 클래스
> - `T` : 타입 변수, 타입 매개변수
> - `Box` : 원시(Raw) 타입

### 1. 제네릭 클래스의 타입 제한하기

```java
public class Playground {
  public static void main(String[] args) {
    FruitBox<Fruit> fruitBox = new FruitBox<>();
    FruitBox<Apple> appleBox = new FruitBox<>();
    FruitBox<Grape> grapeBox = new FruitBox<>();
    FruitBox<Toy> toyBox = new FruitBox<>(); // error
  }
}

class FruitBox<T extends Fruit & Eatable> {}

interface Eatable {}
class Fruit implements Eatable {}

class Apple extends Fruit {}
class Grape extends Fruit {}
class Toy {}
```

`extends` 키워드를 통해
제네릭 타입을 특정 클래스의 자손 클래스 타입 혹은
특정 인터페이스의 구현 클래스 타입으로
제한할 수 있다.
(인터페이스에 대해서도 똑같이 `extends` 키워드를 사용한다.)

`Fruit` 클래스의 자손인 동시에 `Eatable` 인터페이스를
구현한 클래스가 `T`에 올 수 있도록, `&` 문자를 사용해
`class FruitBox<T extends Fruit & Eatable>`로 표현하였다.

### 2. 와일드 카드

와일드 카드 `?`를 사용하여 임의의 타입을 표현할 수 있다.

> - `<? extends T>` : T와 그 자손 타입
> - `<? super T>` : T와 그 조상 타입
> - `<?>` : 모든 타입, `<? extends Object>`와 동일

다음은 `Collections.sort()`의 선언부이다.

```java
static <T> void sort(List<T> list, Comparator<? super T> c)
```

`c`에는 `T` 또는 그 조상 클래스의 타입을
제네릭 타입으로 갖는
`Comparator`의 인스턴스가 입력되어야 한다.

### 3. 제약 사항

#### 제네릭 타입의 배열을 생성할 수 없다

```java
class Box<T> {}
```

`new T[10]`과 같이 배열을 생성할 수 없다.
`new` 연산자는 컴파일 타임에 타입이 무엇인지 정확히 알아야 하기 때문에,
제네릭 타입인 `T`와 함께 사용할 수 없다.

`new` 연산자대신 Reflection API의 `newInstance()`를 사용하거나
Object 배열을 생성하여 T[]로 형변환하는 방법이 있다.
혹은 아예 `ArrayList` 같은 컬렉션 클래스로 대체하는 방법도 있겠다.

#### instanceof 연산자를 사용할 수 없다

`new` 연산자처럼 `instanceof` 또한 컴파일 타임에 타입을 알아야 하므로
T를 피연산자로 받을 수 없다.

## 제네릭 메서드

위에서 언급한 `Collections.sort()`는 제네릭 메서드이다.

```java
static <T> void sort(List<T> list, Comparator<? super T> c)
```

제네릭 타입을 리턴 타입 바로 앞에 선언한다.
해당 제네릭 타입은 메서드 안에서만 사용되며,
클래스의 제네릭 타입과 이름이 겹쳐도
메서드 안에서는 메서드의 제네릭 타입이 사용된다.

## 제네릭 타입의 형변환

### 제네릭 타입 ⇔ 원시 타입

```java
Box box = null;
Box<Object> objBox = null;

box = (Box)objBox; // 제네릭 타입 -> 원시 타입 OK
objBox = (Box<Object>)box; // 원시 타입 -> 제네릭 타입 OK
```

### 제네릭 타입 ⇔ 다른 제네릭 타입

```java
Box<Object> objBox = null;
Box<String> strBox = null;

objBox = (Box<Object>)strBox; // compile error
strBox = (Box<String>)objBox; // compile error
```

## 제네릭 타입의 제거

제네릭 타입은 컴파일 타임에 타입 체크에 사용된 후,
런타임에서는 제거된 상태로 실행된다.
제네릭을 지원하지 않는 자바 하위 버전에 대한
호환성을 제공하기 위함이다.

런타임에서 `ArrayList<Integer>`와
`ArrayList<String>`은 차이가 없다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판

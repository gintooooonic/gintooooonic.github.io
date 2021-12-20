---
title: 객체지향 프로그래밍 둘, 변수와 메서드 - Java
date: '2021-12-20 00:00:01'
category: Java
draft: false
---

## 변수

변수는 지역변수, 인스턴스변수, 클래스변수 세 종류가 있다.
변수의 선언 위치에 따라 종류가 구분된다.

```java
class Variables {
  int iv; // instance variable
  static int cv; // class variable

  void method() {
    int lv = 0; // local variable
  }
}
```

1. **지역변수**는 메서드 영역(메서드의 내부)에 선언된다. `method()`안에 선언된 `lv`는 지역변수.
   - 메서드가 종료되면 소멸되어 사용할 수 없게 된다.
   - 반복문이나 조건문같은 블럭 내에서 생성된 지역변수는 해당 블럭이 끝나면 소멸된다.
2. **인스턴스변수**는 클래스 영역에 `static` 키워드 없이 선언된다. `iv`는 인스턴스변수이다.
   - 인스턴스의 생성 시점에 같이 생성된다.
   - 인스턴스를 통해서만 접근할 수 있다.
   - 인스턴스마다 서로 다른 값을 가질 수 있다.
3. **클래스변수**는 클래스 영역에 `static` 키워드와 함께 선언된다. `cv`는 클래스변수이다.
   - 클래스가 메모리에 로드되는 시점에 생성된다.
   - 인스턴스 없이 클래스 이름으로 접근할 수 있다.
   - 메모리에 단 하나 존재하여, 어떤 인스턴스에서 접근해도 값이 같다.

클래스 영역에 선언하는 변수를 멤버 변수 또는 필드라고 부른다.
인스턴스변수와 클래스변수가 해당된다.

### 멤버 변수의 초기화

#### 1. 명시적 초기화

멤버 변수를 선언과 동시에 초기화하는 방법이다.

```java
class TV {
  boolean power = true;
  int channel = 5;
}
```

#### 2. 생성자

후술할 생성자 메서드 내에서
멤버 변수를 초기화하는 방법이다. [아래 코드를 참고.](#bookmark1)

#### 3. 초기화 블럭

초기화 블럭 내에 코드를 작성해 초기화하는 방법이다.
조건문, 반복문, 예외처리구문 등을 자유롭게 사용할 수 있다.
**클래스 초기화 블럭**과 **인스턴스 초기화 블럭**으로 나뉜다.

- 클래스 초기화 블럭 : 클래스가 메모리에 로드될때 실행됨
- 인스턴스 초기화 블럭 : 인스턴스가 생성될때 실행됨

```java
class TV {
  static String model;
  boolean power;
  int channel;

  static {
    model = "JAVATV-1234";
    System.out.println("static {}");
  }

  {
    power = true;
    channel = 5;
    System.out.println("{}");
  }
}
```

## 메서드

메서드? 함수? 함수와 메서드의 차이는 무엇인가?

- [oop - What's the difference between a method and a function? - Stack Overflow](https://stackoverflow.com/questions/155609/whats-the-difference-between-a-method-and-a-function)
- [05-03 메소드 (Method) - 점프 투 자바](https://wikidocs.net/225)

메서드는 클래스 내의 함수이다. 자바는 문법적으로 클래스 외부에 함수가 정의되지 않기 때문에 메서드만이 존재한다.

메서드를 잘 활용하여 재사용성을 높이고, 중복된 코드를 줄이고, 프로그램의 구조를 단순화할 수 있다.

### 메서드의 선언

자바에서는 기본적으로 다음과 같이 메서드를 선언한다.

```java
int add(int a, int b) {
  int result = a + b;
  return result;
}
```

추가적으로 `static`이나 접근 제어자같은 친구들이 붙는 걸로 알고 있는데, 차차 다루는 걸로..

### 클래스 메서드와 인스턴스 메서드

클래스변수와 인스턴스변수가 나뉘듯,
메서드또한 클래스 메서드와 인스턴스 메서드로 나눌 수 있다. 변수와 동일하게 `static` 키워드의 여부로 구분한다.

```java
public class Calc {
  public static void main(String[] args) {
    Calculator c = new Calculator();

    // static int add(int, int)
    System.out.println(c.add(1, 2));

    c.x = 2;
    c.y = 3;
    // int add()
    System.out.println(c.add());
  }
}

class Calculator {
  int x, y;
  // 클래스 메서드
  static int add(int x, int y) { return x + y; }
  // 인스턴스 메서드
  int add() { return add(x, y); }
}
```

클래스 메서드는 인스턴스 변수를 사용할 수 없다.
클래스 메서드는 인스턴스 없이 사용할 수 있기 때문에,
인스턴스가 존재하지 않을 수 있다.

반대로 인스턴스 메서드에서는 얼마든지 클래스 변수에 접근할 수 있다.
클래스 변수는 클래스의 메모리 로드 시점에 이미 생성되어 있기 때문이다.

만약 메서드에서 인스턴스 변수를 사용하지 않는다면,
클래스 메서드로 정의하는 것을 고려해야 한다.
인스턴스 메서드는 실행시 호출할 메서드를 찾는 과정 때문에
클래스 메서드보다 시간이 조금 더 걸린다.
즉, 인스턴스 메서드로 정의해야할 이유가 있는게 아니라면
클래스 메서드로 정의하는 것이 좋겠다.

> 위 코드를 통해 한 가지 더 알 수 있는 사실,
> 자바는 메서드의 **오버로딩**을 지원한다.
> `Calculator` 클래스에 `add`라는 이름을 가진
> 메서드가 두 개 정의되었다.
> C++처럼 파라미터의 개수와 타입으로 구분된다.

### 특별한 메서드: 생성자

생성자는 인스턴스가 생성될 때 호출되는 메서드이다.
주로 인스턴스 변수의 초기화 작업 등에 사용된다.

<div id="bookmark1"></div>

```java
class Adder {
  int x, y;

  Adder() {
    this(1, 2); // 다른 생성자 호출
  }

  Adder(int x, int y) {
    this.x = x;
    this.y = y;
  }

  // 복사 생성자
  Adder(Adder adder) {
    x = adder.x;
    y = adder.y;
  }

  int add() {
    return x + y;
  }
}
```

- 오버로딩을 통해 여러 개의 생성자를 정의할 수 있다.
- `this()`를 통해 생성자 안에서 다른 생성자를 호출할 수 있다. 단, 반드시 생성자의 맨 첫 줄에서 호출해야 한다.
- 복사 생성자에 주목. 자바에서 Deep copy를 구현하기 위한 하나의 방법.

클래스에 생성자가 하나도 정의되지 않으면
다음과 같은 **기본 생성자**가 생성된다.

```java
Adder() { }
```

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [oop - What's the difference between a method and a function? - Stack Overflow](https://stackoverflow.com/questions/155609/whats-the-difference-between-a-method-and-a-function)
- [05-03 메소드 (Method) - 점프 투 자바](https://wikidocs.net/225)

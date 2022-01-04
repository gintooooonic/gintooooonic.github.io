---
title: 열거형
date: '2022-01-04 00:00:00'
category: Java
draft: false
---

서로 관련된 여러 개의 상수를 묶어
편리하게 선언하기 위한 문법.

```java
public class Playground {
  public static void main(String[] args) {
    Chess piece = Chess.PAWN;
    System.out.println(piece); // output: PAWN
  }
}

enum Chess {
  PAWN, BISHOP, KNIGHT, ROOK, QUEEN, KING
}
```

체스의 말들을 `Chess`라는 열거형으로 묶어
선언하였다.
`Chess`는 열거형의 이름과
차례대로 상수의 이름을 나열한
가장 기본적인 열거형 문법을 나타내고 있으며,
C++를 사용해봤다면 익숙할 것이다.

하지만 자바의 열거형은
C++보다 더 많은 기능을 제공하고 있으며,
아래에서 살펴볼 것이다.

> #### java.lang.Enum
>
> 모든 열거형은 java.lang.Enum의 자손이다.
> `name()`, `ordinal()`, `valueOf()` 등
> 다양한 메서드를 제공하며, 자세한 내용은
> [공식 문서](https://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html)를 참고.

## 열거형 상수에 하나 이상의 값을 지정

다음과 같이 열거형 상수의 값을
직접 지정할 수 있다.

```java
public class Playground {
  public static void main(String[] args) {
    Chess piece = Chess.PAWN;
    System.out.println(piece); // output: PAWN
    System.out.println(piece.getValue()); // output: 6
  }
}

enum Chess {
  PAWN(6), BISHOP(5), KNIGHT(4),
  ROOK(3), QUEEN(2), KING(1);

  private final int value;
  Chess(int value) { this.value = value; }
  public int getValue() { return value; }
}
```

`PAWN(6)`와 같이 괄호를 통해 값을 지정하였다.
정확히는 생성자 `Chess()`의 호출이다.

열거형 상수 아래 추가된
멤버 변수와 메서드들이 눈에 띈다.
(특히 열거형에 메서드를 정의할 수 있다는 점이
새롭다.)

원하는 값을 직접 지정하기 위해
해당 값을 저장할 멤버 변수 `value`와
값을 지정하는 역할을 하는 생성자 `Chess()`를
작성해야 한다. 지정하는 값이 정수이므로
멤버 변수 `value`의 타입을 `int`로 선언하였다.
생성자 `Chess()`는 묵시적으로 private 접근 제어자를 갖기 때문에
외부에서 호출하는 것이 불가능하다.

`getValue()`는 필수적으로 구현해야 하는 부분은 아니다.
`main()`에서 출력해보면 알 수 있지만, 열거형 상수의 값을
직접 출력하는 것으로는 우리가 지정해준 값을 얻을 수 없기 때문에
지정한 값을 얻기 위한 용도로 구현한 것이다.

같은 방식으로 하나의 열거형 상수에 여러 개의 값을 지정할 수도 있다.

```java
enum Chess {
  PAWN(6, 'P'), BISHOP(5, 'B'), KNIGHT(4, 'N'),
  ROOK(3, 'R'), QUEEN(2, 'Q'), KING(1, 'K');

  private final int value;
  private final char symbol;
  Chess(int value, char symbol) {
    this.value = value;
    this.symbol = symbol;
  }
  public int getValue() { return value; }
  public char getSymbol() { return symbol; }
}
```

## 추상 메서드

열거형 내부에 추상 메서드를 정의하면
모든 열거형 상수 내에서 이를 구현해야 한다.

이 문장을 읽고 두 가지 의문이 들었는데,
첫째는 열거형 상수 안에 메서드를 어떻게 구현하냐는 것과
둘째는 이러한 기능의 용도가 무엇인지였다.
이해한 내용은 다음과 같다.

앞서 작성했던 `getValue()`나 `getSymbol()`처럼
자바의 열거형은 내부에 메서드를 정의할 수 있다.

메서드의 기능에 따라 열거형 상수별로 동작을 달리해야하는 경우가
생길 수 있다. `Chess` 열거형을 예로 들면, 말의 현재 좌표와
이동하고자 하는 좌표를 하나씩 받아 이동이 가능한지의 여부를
반환하는 `isMovable()` 메서드가 있다고 가정한다.

```java
enum Chess {
  PAWN(6, 'P'), BISHOP(5, 'B'), KNIGHT(4, 'N'),
  ROOK(3, 'R'), QUEEN(2, 'Q'), KING(1, 'K');

  ...

  public boolean isMovable(int sx, int sy, int ex, int ey) { ... }
}
```

그런데 체스는 말에 따라 이동할 수 있는 범위가 다른 게임이다.
말의 종류에 따라 `isMovable()`의 결과는 달라야 한다.

이때 `isMovable()`을 추상 메서드로 선언하고
각 열거형 상수 안에 메서드를 정의하도록 할 수 있는 것이다.
메서드의 정의는 각 열거형 상수에서 중괄호를 열어 작성할 수 있다.

```java
public class Playground {
  public static void main(String[] args) {
    Chess piece = Chess.PAWN;
    System.out.println(piece.PAWN.isMovable(0, 1, 0, 2)); // 사용은 이렇게
  }
}

enum Chess {
  PAWN(6, 'P') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } },
  BISHOP(5, 'B') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } },
  KNIGHT(4, 'N') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } },
  ROOK(3, 'R') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } },
  QUEEN(2, 'Q') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } },
  KING(1, 'K') { public boolean isMovable(int sx, int sy, int ex, int ey) { ... } };

  ...

  public abstract boolean isMovable(int sx, int sy, int ex, int ey);
}
```

## 열거형의 내부 동작

열거형은 내부적으로
`java.lang.Enum`의 자손 클래스로서
컴파일된다.
각 열거형 상수는 클래스의 `static final` 멤버 변수로서 선언되며,
타입은 해당 열거형 클래스.

[How are enums internally represented in Java? - Stack Overflow](https://stackoverflow.com/questions/32354107/how-are-enums-internally-represented-in-java)

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [Enum (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html)
- [How are enums internally represented in Java? - Stack Overflow](https://stackoverflow.com/questions/32354107/how-are-enums-internally-represented-in-java)

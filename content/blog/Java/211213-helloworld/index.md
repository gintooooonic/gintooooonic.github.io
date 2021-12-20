---
title: Hello World!
date: '2021-12-13 00:00:01'
category: Java
draft: false
---

어떤 언어를 공부해도 첫 시작은 `Hello World` 프로그램인 것 같다.
`Hello.java` 파일을 생성해 다음 코드를 붙여 넣고 저장하자.

```java
class Hello {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

JDK를 올바르게 설치했다면 `javac`와 `java` 명령어를 실행할 수 있을 것이다.
다음 절차를 통해 `Hello.java`를 컴파일하고 실행한다.

```bash
# Hello.java를 컴파일
javac Hello.java

# 컴파일된 바이트 코드(Hello.class) 실행
java Hello

# Output: Hello World!
```

직접 명령어를 통해 컴파일 및 실행하지 않아도
IntelliJ나 Eclipse 같은 IDE를 사용해 실행할 수도 있다.

## Hello World 코드 읽어보기

### 클래스 구조

```java
class Hello { ... }
```

자바 애플리케이션은 클래스 단위로 구성된다.
다시 말해 클래스 여러 개가 모여 하나의 애플리케이션을 이룬다.

파일 하나에 하나의 클래스를 정의하는 것이 보통이지만,
두 개 이상의 클래스를 정의하는 것도 가능하다.
파일의 이름은 파일 안에 정의된 클래스들의 이름 중 하나를 선택하나,
만약 `public class`가 존재한다면 그 클래스의 이름을 파일 이름으로 사용해야 한다.

### main 메서드

```java
public static void main(String[] args) { ... }
```

`java` 명령어로 실행하는 경우, 실행하는 클래스에 `main` 메서드가 있어야 한다.
`main` 메서드가 자바 애플리케이션의 시작점이기 때문이다.

모든 클래스에 `main` 메서드가 필요하지는 않지만,
애플리케이션 내에 적어도 하나의 `main` 메서드를 필요로 한다.

`public static void main(String[] args)`이라는 형태는
`java` 명령어에 의해 실행될 수 있도록 약속된 부분이다.

함수를 정의하는 문법 또한 조금 엿볼 수 있는 것 같다.

### 콘솔 출력

```java
System.out.println("Hello World!");
```

`System.out.println` 메서드를 통해 콘솔 출력이 가능하다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판

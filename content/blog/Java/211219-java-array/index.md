---
title: 자바의 배열(Array)
date: '2021-12-19 00:00:00'
category: Java
draft: false
---

## 배열 (Array)

```java
int[] numbers = { 1, 2, 3, 4, 5 };
String[] strs = { "Hello", "World" };
```

- 같은 타입의 여러 변수를 하나의 묶음으로 다루는 것
- 연속적인 메모리 공간에 저장
- 배열의 이름은 배열을 가리키는 참조변수

## 배열의 선언과 생성, 초기화

### 1. 배열의 선언

```java
// int 배열 선언
int[] numbers;
```

이렇게 `[]`을 변수 이름 뒤에 적어도 상관 없다.

```java
int numbers[];
```

### 2. 배열의 생성

```java
// 길이 10의 int 배열 생성
// 0으로 초기화됨
numbers = new int[10];
```

앞에서 배열을 선언한 것은 배열을 가리킬 참조변수를 선언했을뿐이고,
실제 배열이 메모리에 생성되는 것은 이렇게 `new`에 의해서.

### 3. 배열의 초기화

```java
// 1 ~ 10으로 초기화
for (int i = 0; i < 10; ++i) {
  numbers[i] = i + 1;
}
```

### 4. 배열의 선언과 생성, 초기화를 동시에

```java
// 선언과 동시에 생성, 초기화
int[] arr = new int[3]{ 1, 2, 3 };
int[] arr2 = { 1, 2, 3 };
```

## 배열의 출력

다음 코드처럼 배열의 이름만을 이용해 출력하려고 하면 어떤 결과를 얻을까?

```java
int[] numbers = { 1, 2, 3, 4, 5, 6, 7 };
System.out.println(numbers);
```

`numbers`는 배열을 가리키는 참조변수일뿐이다.
`타입@메모리주소`를 출력한다.

```
[I@75b84c92
```

배열의 내용을 출력하려면 다음 방법을 사용한다.

### 반복문으로 출력하기

```java
int[] numbers = { 1, 2, 3, 4, 5, 6, 7 };
for (int i = 0; i < numbers.length; ++i) {
  System.out.print(numbers[i] + " ");
}
```

- 반복문으로 배열의 각 인덱스를 순회하며 하나씩 출력하는 방식
- `numbers.length`로 배열의 길이를 얻었다.
- We count from zero.

물론 다음처럼 for-each를 사용하는 것도 가능하다.

```java
for (int n: numbers) {
  System.out.print(n + " ");
}
```

### Arrays.toString()

```java
import java.util.Arrays;

public class Array {
  public static void main(String[] args) {
    int[] numbers = { 1, 2, 3, 4, 5, 6, 7 };
    System.out.println(Arrays.toString(numbers));
  }
}
```

- `Arrays` 클래스의 `toString()` 메서드를 활용
- `java.util.Arrays`를 `import`하였다.
- 출력 형식은 `[1, 2, 3, 4, 5, 6, 7]`이다.

## 2차원 배열

```java
// 2차원 int 배열의 선언
int[][] arr;

// 2차원 int 배열의 생성
int[][] arr2 = new int[3][4];

// 2차원 int 배열의 초기화
for (int i = 0; i < arr2.length; ++i) {
  for (int j = 0; j < arr2[i].length; ++j)
    arr2[i][j] = 1;
}

// 배열의 선언과 동시에 생성, 초기화
int[][] arr3 = {
  {1, 2, 3},
  {4, 5, 6},
  {7, 8, 9}
};
```

- 1차원 배열 안에 다른 1차원 배열들을 담는 것과 같음
- 3차원, 4차원, ... n차원 배열 가능

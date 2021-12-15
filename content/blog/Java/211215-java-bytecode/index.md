---
title: 자바의 바이트코드(Bytecode)
date: '2021-12-15 00:00:01'
category: Java
draft: false
---

`javap` 명령어를 통해 바이트코드를 직접 확인할 수 있다.

```java
public class Operator {
    static int func(int n) {
        return n;
    }
    public static void main(String[] args) {
        int a = 10;
        func(a++);
        func(++a);
    }
}
```

위 코드를 컴파일하여 `Operator.class`가 생성되면,

```bash
# a.txt에 저장
javap -c Operator > a.txt
```

`a.txt`를 열어보면 다음과 같은 결과를 확인할 수 있다.

```
Compiled from "Operator.java"
public class Operator {
  public Operator();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  static int func(int);
    Code:
       0: iload_0
       1: ireturn

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: iload_1
       4: iinc          1, 1
       7: invokestatic  #2                  // Method func:(I)I
      10: pop
      11: iinc          1, 1
      14: iload_1
      15: invokestatic  #2                  // Method func:(I)I
      18: pop
      19: return
}
```

증감 연산자를 Prefix로 쓸 때와 Postfix로 쓸 때
바이트코드에 어떤 차이가 있을지 궁금했는데,
변수의 값을 증가시키는 것과 피연산자 스택에 로드하는 것의 순서 차이로 보인다.

`a++`의 경우 `iload_1`하여 값을 미리 피연산자 스택에 올린 후에
`iinc`로 `a`의 값을 증가시키고,
`++a`의 경우 `iinc`를 먼저 실행하여
증가된 `a`의 값을 `iload_1`로 로드하는 것을 알 수 있다.

각 바이트코드 명령어의 기능은 다음 페이지에서 명령어로 검색해보면 알 수 있다.

[Chapter 6. The Java Virtual Machine Instruction Set - Oracle](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-6.html)

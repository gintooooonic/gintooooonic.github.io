---
title: if와 switch는 같은 Bytecode를 생성할까?
date: '2021-12-16 00:00:01'
category: Java
draft: false
---

문득 `if`문과 `switch`문으로 같은 동작을 하는 코드를 작성했을때
같은 바이트코드를 생성하는지 궁금해졌다.

다음 두 코드를 작성하고 `javap` 명령을 사용해 바이트코드를 확인하였다.

```java
import java.util.Scanner;

public class Playground {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    if (n == 0) System.out.println("zero");
    else if (n == 1) System.out.println("one");
    else System.out.println("idk");
  }
}
```

<p align="center" style="color: #888888; font-size: 12px;">
  if를 사용한 구현
</p>

```java
import java.util.Scanner;

public class Playground {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    switch (n) {
      case 0:
        System.out.println("zero");
        break;
      case 1:
        System.out.println("one");
        break;
      default:
        System.out.println("idk");
    }
  }
}
```

<p align="center" style="color: #888888; font-size: 12px;">
  switch를 사용한 구현
</p>

다음은 `if`를 사용했을때의 바이트코드이다.

```
Compiled from "Playground.java"
public class Playground {
  public Playground();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class java/util/Scanner
       3: dup
       4: getstatic     #3                  // Field java/lang/System.in:Ljava/io/InputStream;
       7: invokespecial #4                  // Method java/util/Scanner."<init>":(Ljava/io/InputStream;)V
      10: astore_1
      11: aload_1
      12: invokevirtual #5                  // Method java/util/Scanner.nextInt:()I
      15: istore_2
      16: iload_2
      17: ifne          31
      20: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      23: ldc           #7                  // String zero
      25: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      28: goto          55
      31: iload_2
      32: iconst_1
      33: if_icmpne     47
      36: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      39: ldc           #9                  // String one
      41: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      44: goto          55
      47: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      50: ldc           #10                 // String idk
      52: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      55: return
}
```

다음은 `switch`를 사용했을때의 바이트코드이며,
`if`를 사용했을때와 조금 다른 것을 알 수 있었다.

```
Compiled from "Playground.java"
public class Playground {
  public Playground();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class java/util/Scanner
       3: dup
       4: getstatic     #3                  // Field java/lang/System.in:Ljava/io/InputStream;
       7: invokespecial #4                  // Method java/util/Scanner."<init>":(Ljava/io/InputStream;)V
      10: astore_1
      11: aload_1
      12: invokevirtual #5                  // Method java/util/Scanner.nextInt:()I
      15: istore_2
      16: iload_2
      17: lookupswitch  { // 2
                     0: 44
                     1: 55
               default: 66
          }
      44: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      47: ldc           #7                  // String zero
      49: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      52: goto          74
      55: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      58: ldc           #9                  // String one
      60: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      63: goto          74
      66: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      69: ldc           #10                 // String idk
      71: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      74: return
}
```

`lookupswitch` 명령에 대한 내용은 [문서](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-6.html#jvms-6.5.lookupswitch)를 참고.

찾아보니 `switch` 문을 사용하면 **점프 테이블**이라는 친구를 생성하는 것 같은데..
성능에는 큰 차이가 없는 것 같다. 다음 [링크](https://okky.kr/article/425493) 참고.

컴파일러는 `if`와 `switch`에 대해 다른 바이트코드를 생성한다.
궁금증은 해결했고,
성능 차이에 대해서는 나중에 더 자세히 알아보는 걸로.

## Reference

- [Chapter 6. The Java Virtual Machine Instruction Set - Oracle](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-6.html#jvms-6.5.lookupswitch)
- [자바 switch문과 if문의 내부동작 - 속도 차이에 대해 - OKKY](https://okky.kr/article/425493)

---
title: 입출력 하나, 바이트 기반 스트림
date: '2022-01-10 00:00:00'
category: Java
draft: false
---

입출력이란 컴퓨터 내부/외부 장치와
프로그램이 데이터를 주고받는 것을 말한다.
간단한 예로 사용자가 키보드를 통해 생년월일을 입력하면,
나이를 계산해 화면에 출력해주는 프로그램을 생각할 수 있다.
그리고 파일에 데이터를 읽고 쓰는 것도 입출력이다.

데이터를 주고받는 연결 통로 역할을 해주는 것이 바로
**스트림**이다.
(이전에 다룬 `Stream` 클래스와는 아예 다른 개념임을 유의하자.)

단어 그대로 스트림은 흐르는 물과 같다.
데이터가 단방향으로 연속해서 흐르기 때문이다.
그래서 입력을 위한 스트림과 출력을 위한 스트림을 따로 사용한다.

자바는 `java.io` 패키지를 통해
입출력과 관련된 다양한 클래스들을 제공한다.
크게는 바이트 기반 스트림과 문자 기반 스트림으로 구분할 수 있다.

- 바이트 기반 스트림
  - InputStream, OutputStream, ...
  - 바이트 단위로 데이터를 전송
- 문자 기반 스트림
  - Reader, Writer, ...
  - 문자(2 bytes) 단위로 데이터를 전송

그 밖에 바이트 기반 스트림이나 문자 기반 스트림의 기능을
보완하기 위한 보조 스트림들이 존재한다.

## 바이트 기반 스트림

```
java.io.InputStream (implements java.io.Closeable)
  java.io.ByteArrayInputStream
  java.io.FileInputStream
  java.io.FilterInputStream
    java.io.BufferedInputStream
    java.io.DataInputStream (implements java.io.DataInput)
    java.io.LineNumberInputStream
    java.io.PushbackInputStream
  java.io.ObjectInputStream (implements java.io.ObjectInput, java.io.ObjectStreamConstants)
  java.io.PipedInputStream
  java.io.SequenceInputStream
  java.io.StringBufferInputStream
```

<p align="center" style="color: #888888; font-size: 12px;">
  InputStream 클래스 계층도
  (https://docs.oracle.com/javase/8/docs/api/java/io/package-tree.html)
</p>

```
java.io.OutputStream (implements java.io.Closeable, java.io.Flushable)
  java.io.ByteArrayOutputStream
  java.io.FileOutputStream
  java.io.FilterOutputStream
    java.io.BufferedOutputStream
    java.io.DataOutputStream (implements java.io.DataOutput)
    java.io.PrintStream (implements java.lang.Appendable, java.io.Closeable)
  java.io.ObjectOutputStream (implements java.io.ObjectOutput, java.io.ObjectStreamConstants)
  java.io.PipedOutputStream
```

<p align="center" style="color: #888888; font-size: 12px;">
  OutputStream 클래스 계층도
  (https://docs.oracle.com/javase/8/docs/api/java/io/package-tree.html)
</p>

InputStream과 OutputStream은
모든 바이트 기반 스트림의 조상이다.
데이터를 읽고 쓰기 위한 메서드를 정의해놓았기 때문에,
어떤 자손 클래스를 사용하든 표준화된 방법으로 프로그래밍이 가능하다.

```java
// InputStream
abstract int read()
int read(byte[] b)
int read(byte[] b, int off, int len)

// OutputStream
abstract void write(int b)
void write(byte[] b)
void write(byte[] b, int off, int len)
```

`read()`와 `write(int b)`는
대상마다 입출력 방법이 다를 수 있기 때문에
추상 메서드로 선언되었다.
나머지 메서드들에서도
`read()`와 `write(int b)`를 사용해
입출력이 이루어진다.

그 밖에 파일 내 현재 읽고 쓰는 위치를 관리하는
`mark()`와 `reset()`,
버퍼가 있는 스트림에서만 동작하는 `flush()` 등
다른 메서드들도 정의되어 있으므로 아래 공식 문서를 참고.

- [InputStream (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html)
- [OutputStream (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html)

### ByteArrayInput과 ByteArrayOutputStream

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;

class Playground {
  public static void main(String[] args) {
    byte[] src = { 0, 1, 2, 3, 4 };
    byte[] dest = null;

    ByteArrayInputStream in = new ByteArrayInputStream(src);
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    // 1바이트식 데이터를 읽어
    // 출력 스트림에 쓰기
    int data = 0;
    while ((data = in.read()) != -1) { // 스트림의 끝에 도달하면 -1 반환
      System.out.println("Data read: " + data);
      out.write(data);
    }

    dest = out.toByteArray();
    System.out.println("Result: " + Arrays.toString(dest));
  }
}
```

원본 배열에서 데이터를 1바이트씩 읽어
출력 스트림에 쓰는 소스 코드.
스트림의 끝에 도달해 더 이상 읽을 데이터가 없는 경우
`read()`가 -1을 반환하여
반복문을 탈출한다.

원래 스트림을 사용한 후에는 `close()`를 통해
스트림을 닫아주어야 하지만,
ByteArrayInput과 ByteArrayOutputStream처럼
메모리만을 사용하는 스트림에서는
가비지 컬렉터에 의해 자동으로 자원이 반환된다.

1바이트씩 데이터를 옮기는 것보다는
배열을 사용해 한 번에 많은 데이터를 옮기는 것이 더 효율적이다.
아래 코드 참고.

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;

class Playground {
  public static void main(String[] args) {
    byte[] src = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
    byte[] dest = null;
    byte[] tmp = new byte[4];

    ByteArrayInputStream in = new ByteArrayInputStream(src);
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    try {
      int len = 0;
      while (in.available() > 0) {
        // tmp의 길이만큼 데이터를 읽어 tmp에 저장
        // tmp의 길이를 다 채우지 못하고 스트림이 끝나는 경우도 존재
        // len에 읽은 길이를 저장
        len = in.read(tmp);

        // 읽은 길이만큼 tmp에서 꺼내 출력 스트림에 쓰기
        out.write(tmp, 0, len);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }


    dest = out.toByteArray();
    System.out.println("Result: " + Arrays.toString(dest));
  }
}
```

### FileInputStream과 FileOutputStream

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileBackup {
  public static void main(String[] args) throws IOException {
    if (args.length != 1) {
      System.out.println("usage: java FileBackup <filename>");
      return;
    }

    FileInputStream in = new FileInputStream(args[0]);
    FileOutputStream out = new FileOutputStream("backup_" + args[0]);



    int data = 0;
    while ((data = in.read()) != -1)
      out.write(data);

    System.out.println("Success!");

    // 자원이 반환되지 않는 경우는 없을까?
    in.close();
    out.close();
  }
}
```

```
$ java FileBackup profile.png
Success!

$ ll
FileBackup.class   FileBackup.java    backup_profile.png profile.png
```

파일의 복사본을 생성하는 프로그램을 작성하였다.
사용 방법이 ByteArrayInput & ByteArrayOutputStream과
크게 차이나지 않는데, 조상 클래스인 InputStream과 OutputStream에서
정의된 메서드를 오버라이딩하여 사용하기 때문이다.

프로그램 종료 전에 `close()`를 통해
생성한 스트림들을 닫아주었는데, 갑자기 의문이 생겼다.

**Q.** 스트림을 생성했으면 닫아주는 것이 필수적인 절차인 것 같은데,
프로그램의 비정상적인 종료로 `close()`가 실행되지 않아
자원이 미반환되는 경우도 있지 않을까?

전에 쓰레드 파트에서 공부했던 `ReentrantLock`의 경우
finally 블럭을 사용해 메서드 반환이나 예외가 발생해도
자원을 반환하는 코드가 항상 실행되도록 하였다.
스트림에서도 같은 방법이 사용되는지 궁금하다.
비단 파일 스트림이나 위에서 작성한 FileBackup 프로그램이 아니라
스트림 전반에 대한 의문이다.

**A.** 찾아보니 오라클의 공식 자바 튜토리얼에 아래와 같은 코드와 내용이 있었다.
충분한 답이 될 것 같다.

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class CopyBytes {
  public static void main(String[] args) throws IOException {

    FileInputStream in = null;
    FileOutputStream out = null;

    try {
      in = new FileInputStream("xanadu.txt");
      out = new FileOutputStream("outagain.txt");
      int c;

      while ((c = in.read()) != -1) {
          out.write(c);
      }
    } finally {
      if (in != null) {
          in.close();
      }
      if (out != null) {
          out.close();
      }
    }
  }
}
```

> #### Always Close Streams
>
> Closing a stream when it's no longer needed is very important — so important that CopyBytes uses a finally block to guarantee that both streams will be closed even if an error occurs. This practice helps avoid serious resource leaks.
>
> One possible error is that CopyBytes was unable to open one or both files. When that happens, the stream variable corresponding to the file never changes from its initial null value. That's why CopyBytes makes sure that each stream variable contains an object reference before invoking close.

[Byte Streams (The Java™ Tutorials > Essential Java Classes > Basic I/O) - Oracle](https://docs.oracle.com/javase/tutorial/essential/io/bytestreams.html)

만약 finally 블럭을 활용해 `close()`를 한다면,
`close()`에서도 IOException을 발생할 수 있음을 유의해야할 것 같다.
본 예제 코드에서는 `main()`에서 `throws IOException`을 명시했기에
`close()`에 대한 예외 처리를 하지 않은 것으로 보인다.

## 바이트 기반의 보조 스트림

위에서 소개한 바이트 기반 스트림들의 기능을
보완하기 위해 보조 스트림을 사용하기도 한다.
보조 스트림 단독으로 사용할 수는 없고
기반 스트림을 필요로 한다.

```java
FileInputStream fis = new FileInputStream("test.txt");
BufferedInputStream bis = new BufferedInputStream(fis);
bis.read();
```

기반 스트림인 FileInputStream의 인스턴스를 통해
BufferedInputStream을 생성하고 있다.
그래서 영어로는 기반 스트림을 Wrap한다는 의미에서
어떤 스트림의 'Wrapper'라고도 부르는 것 같다.

거의 모든 보조 스트림이 FilterInputStream과
FilterOutputStream의 자손이다.
SequenceInputStream은 FilterInputStream의 자손이 아니다.
위에 올려놓은 [클래스 계층도](#바이트-기반-스트림)를 참고.

### BufferedInputStream과 BufferedOutputStream

버퍼를 두고 입출력을 수행하는 스트림이다.
데이터를 버퍼에 쌓아두었다가 한번에 옮기기 때문에
더 효율적이다.

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileBackup {
  public static void main(String[] args) throws IOException {
    if (args.length != 1) {
      System.out.println("usage: java FileBackup <filename>");
      return;
    }

    try (
      FileInputStream in = new FileInputStream(args[0]);
      FileOutputStream out = new FileOutputStream("backup_" + args[0]);
      BufferedInputStream bin = new BufferedInputStream(in);
      BufferedOutputStream bout = new BufferedOutputStream(out);
    ) {
      int data = 0;
      while ((data = bin.read()) != -1)
        bout.write(data);
    } catch (IOException e) {
      e.printStackTrace();
    }

    System.out.println("Success!");
  }
}
```

앞에서 작성한 FileBackup 프로그램을
버퍼를 활용해 개선해보았다.

try-with-resources 문법으로
스트림이 자동으로 `close()` 되도록 작성하였다.
InputStream과 OutputStream이 Closeable 인터페이스를 구현하는데,
Closeable이 AutoCloseable을 상속하므로 try-with-resources문을 사용할 수 있다.

한 가지 궁금했던 부분은 스트림의 `close()`와 관련된 부분이었다.
`bin`과 `bout`을 닫으면 기반 스트림인 `in`과 `out`도 닫힌다.
BufferedInputStream과 BufferedOutputStream의 `close()`가
기반 스트림의 `close()`를 호출하기 때문이다.

**Q.** 문제는 try-with-resource에 의해
`in`과 `out` 또한 `close()`가 따로 실행된다는 점이다.
즉 `close()`가 두 번 실행될 것 같은데, 이미 닫힌 스트림에
`close()`를 실행하면 문제가 생기지 않을까?

**A.** 실행해보니 일단 에러가 발생하지 않았다.
Closeable 인터페이스에 대한 공식 문서에서
`close()`에 대한 설명을 찾아보니 이렇게 적혀있었다.

> Closes this stream and releases any system resources associated with it. If the stream is already closed then invoking this method has no effect.

[Closeable (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Closeable.html)

에러가 발생할 일은 없어보인다.

### DataInputStream과 DataOutputStream

각각 DataInput, DataOutput 인터페이스를 구현한다.
데이터를 바이트 단위가 아닌 8가지 기본 타입의 단위로 읽고 쓸 수 있다.
값을 16진수로 저장한다.

```java
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class WriteScoreData {
  public static void main(String[] args) {
    int[] scores = { 80, 90, 85, 100, 95 };

    try (
      FileOutputStream fos = new FileOutputStream("score.dat");
      DataOutputStream dos = new DataOutputStream(fos);
    ) {
      for (int i = 0; i < scores.length; ++i)
        dos.writeInt(scores[i]);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
```

성적 정보를 `score.dat`에 작성하는 코드이다.

```java
import java.io.DataInputStream;
import java.io.EOFException;
import java.io.FileInputStream;
import java.io.IOException;

public class ReadScoreData {
  public static void main(String[] args) {
    try (
      FileInputStream fis = new FileInputStream("score.dat");
      DataInputStream dis = new DataInputStream(fis);
    ) {
      while (true) {
        int score = dis.readInt();
        System.out.println(score);
      }
    } catch (EOFException e) {
      System.out.println("End");
    } catch (IOException ie) {
      ie.printStackTrace();
    }
  }
}
```

`score.dat`에 작성된 성적 정보를 읽어오는 코드이다.
더 이상 읽을 데이터가 없는 경우 EOFException이 발생하므로
catch해주었다.

### SequenceInputStream

여러 개의 입력 스트림을 이어
하나의 스트림을 다루는 것처럼 만든다.

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.SequenceInputStream;
import java.util.Arrays;
import java.util.Vector;

class Playground {
  public static void main(String[] args) {
    byte[][] src = {
      { 0, 1, 2, 3 },
      { 4, 5, 6, 7 },
      { 8, 9, 10, 11 }
    };

    Vector<ByteArrayInputStream> v = new Vector<>();
    for (byte[] bytes: src) {
      ByteArrayInputStream in = new ByteArrayInputStream(bytes);
      v.add(in);
    }

    SequenceInputStream seqin = new SequenceInputStream(v.elements());
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    int data = 0;
    try {
      while ((data = seqin.read()) != -1) {
        out.write(data);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }

    System.out.println(Arrays.toString(out.toByteArray()));

    // seqin.close() 해야 할까?
  }
}
```

SequenceInputStream을 사용한 후에
`close()`를 해야 할까?

### PrintStream

데이터를 기반 스트림에 다양한 형태로 출력한다.
`System.out`이 PrintStream 객체이다.

문자 기반 스트림의 역할을 수행한다.
더 향상된 문자 기반 스트림인 PrintWriter를 사용하는 것이 좋다.

```java
import java.io.BufferedOutputStream;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.PrintStream;

class Playground {
  public static void main(String[] args) {
    FileOutputStream fdOut = new FileOutputStream(FileDescriptor.out);
    BufferedOutputStream buffOut = new BufferedOutputStream(fdOut, 128);
    PrintStream out = new PrintStream(buffOut, true);

    out.println("hello world!");
  }
}
```

`java.lang.System`을 참고해
표준 출력에 대한 PrintStream을 생성하여
출력하는 코드를 작성하였다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [java.io Class Hierarchy (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/package-tree.html)
- [InputStream (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html)
- [OutputStream (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html)
- [Byte Streams (The Java™ Tutorials > Essential Java Classes > Basic I/O) - Oracle](https://docs.oracle.com/javase/tutorial/essential/io/bytestreams.html)
- [Closeable (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Closeable.html)

---
title: 입출력 셋, 표준 입출력과 파일
date: '2022-01-12 00:00:01'
category: Java
draft: false
---

## 표준 입출력

표준 입출력이란 콘솔 환경에서의 입력과 출력을 의미하는 것으로서
자바에서는 `System` 클래스의 멤버 변수로
`in`, `out`, `err`
세 가지의 표준 입출력 스트림이 미리 정의되어 있다.

```java
// System.java
// Zulu OpenJDK 11

public static final InputStream in = null;
public static final PrintStream out = null;
public static final PrintStream err = null;

...

FileInputStream fdIn = new FileInputStream(FileDescriptor.in);
FileOutputStream fdOut = new FileOutputStream(FileDescriptor.out);
FileOutputStream fdErr = new FileOutputStream(FileDescriptor.err);
setIn0(new BufferedInputStream(fdIn));
setOut0(newPrintStream(fdOut, props.getProperty("sun.stdout.encoding")));
setErr0(newPrintStream(fdErr, props.getProperty("sun.stderr.encoding")));

...

private static PrintStream newPrintStream(FileOutputStream fos, String enc) {
  if (enc != null) {
    try {
      return new PrintStream(new BufferedOutputStream(fos, 128), true, enc);
    } catch (UnsupportedEncodingException uee) {}
  }
  return new PrintStream(new BufferedOutputStream(fos, 128), true);
}
```

다음 메서드를 통해 표준 입출력의 대상을
다른 스트림으로 변경하는 것도 가능하다.

```java
static void setOut(PrintStream out)
static void setErr(PrintStream err)
static void setIn(InputStream in)
```

## 파일

File 클래스를 통해
파일을 대상으로 입출력이 가능하다.

[File (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/File.html)

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [File (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/File.html)

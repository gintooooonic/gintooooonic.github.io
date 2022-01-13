---
title: 입출력 둘, 문자 기반 스트림
date: '2022-01-12 00:00:00'
category: Java
draft: false
---

바이트 기반 스트림과 다른 점은
문자 데이터를 다루기 때문에
2바이트 단위로 데이터가 오고 간다는 부분이다.

그리고 여러 종류의 인코딩과
자바의 유니코드간 변환을 자동으로 처리한다.
데이터를 읽을 때는 특정 인코딩을 유니코드로 변환하고,
데이터를 쓸 때는 유니코드를 특정 인코딩으로 변환한다.

모든 문자 기반 스트림의 조상은
**Reader**와 **Writer**이다.
바이트 기반 스트림에서
InputStream과 OutputStream이
갖고 있던 역할과 같으며,
`byte[]` 대신 `char[]` 타입을 사용한다는 것을 제외하면
메서드에도 큰 차이가 없다.

- [Reader (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Reader.html)
- [Writer (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Writer.html)

## 문자 기반 스트림

### FileReader와 FileWriter

파일에서의 텍스트 데이터 입출력을 위한 클래스이다.
FileInputStream & FileOutputStream과
사용 방법에는 큰 차이가 없다.

인코딩을 자동으로 처리해주기 때문에
FileInputStream & FileOutputStream을 사용했을때
깨졌던 글자도 정상적으로 출력할 수 있다.

### PipedReader와 PipedWriter

쓰레드 사이에 데이터를 주고받을때 사용한다.
파이프라는 이름에서 예상할 수 있듯이
입력 스트림과 출력 스트림을 연결하여 사용할 수 있다.

예를 들어 출력 스트림에서 `write()`한 데이터를
입력 스트림에서 `read()`할 수 있다.

### StringReader와 StringWriter

내부의 StringBuffer를 이용해
메모리에 문자 데이터를 저장한다.

입출력 대상이 메모리라는 점에서는
CharArrayReader & CharArrayWriter와 비슷한 포지션에 있지만
`char[]` 대신 `String`을 사용한다는 차이가 있다.

## 문자 기반의 보조 스트림

### BufferedReader와 BufferedWriter

버퍼를 사용해 입출력 효율을 높인다.

`readLine()`이라는 메서드를 가지고 있어
데이터를 줄 단위로 읽기에 편리하다.

### InputStreamReader와 OutputStreamWriter

바이트 기반 스트림을 문자 기반 스트림으로 연결시켜준다.

따라서 문자 기반 스트림이 아니라
바이트 기반 스트림 InputStream & OutputStream을
Wrapping하는 보조 스트림이다.

바이트 기반 스트림의 데이터에
인코딩 변환 작업을 수행한다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [Reader (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Reader.html)
- [Writer (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/io/Writer.html)

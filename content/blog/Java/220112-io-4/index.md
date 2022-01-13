---
title: 입출력 넷, 직렬화
date: '2022-01-12 00:00:02'
category: Java
draft: false
---

직렬화(Serialization)란 객체를 데이터 스트림으로 변환하는 것이다.
객체를 다른 컴퓨터 등에 전송하기 위해
객체가 담고 있는 멤버들을 연속적인 데이터의 흐름으로 바꾸는 것이다.
여기서의 멤버란 객체의 인스턴스 변수만을 이야기한다.
객체는 내부적으로 메서드를 포함하지 않는다.

반대로 직렬화된 데이터 스트림을 원래의 객체로 변환하는 일을
역직렬화라고 한다.

직렬화는 ObjectInputStream,
역직렬화는 ObjectOutputStream을 통해 이루어진다.

`readObject()`와 `writeObject()` 등 다양한 메서드를 지원한다.

## Serializable 인터페이스

클래스가 Serializable 인터페이스를 구현해야
직렬화가 가능하다.

물론 조상 클래스가 Serializable을 구현하고 있다면
자손 클래스에서는 따로 구현하지 않아도 직렬화가 가능하다.

하지만 자손 클래스에서만 구현하고 조상 클래스에서는
구현이 안되어 있다면, 기본적으로 조상 클래스의 멤버는
직렬화 대상에 포함되지 않는다.
대신 `writeObject()`와 `readObject()`를
직접 작성하여 직렬화에 포함되도록 할 수 있다.

## transient 제어자

`transient` 키워드로 선언된 멤버 변수는
직렬화 대상에서 제외된다.

## serialVersionUID

직렬화 했을때의 클래스와
역직렬화하는 클래스는 같은 버전을 사용해야 한다.

여기서 버전이 되는 것이 바로
static 멤버 변수인 `serialVersionUID`인데,
기본적으로는 클래스에 정의된 멤버들의 정보를 이용해서
자동 생성된다. static 또는 transient 멤버 변수들은
`serialVersionUID`에 영향을 주지 않는다.

직렬화시의 클래스 버전과
역직렬화시의 클래스 버전이 맞아야 하기 때문에
관리가 어려울 수 있다.
이 때는 `serialVersionUID`을 직접 정의하여 사용하기도 하며,
중복된 값을 방지할 수 있도록 `serialver` 명령어를 통해 생성할 수 있다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판

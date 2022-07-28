---
title: Swift의 구조체와 클래스
date: '2022-07-26 00:00:00'
category: iOS
draft: false
---

Swift의 구조체와 클래스가 갖는
공통점과 차이점에 대해 정리합니다.

## 1. 구조체와 클래스의 공통점

### a. 프로퍼티와 메서드를 갖습니다.

구조체와 클래스 모두 데이터를 프로퍼티에 저장하고,
동작을 메서드에 정의한다는 점이 같습니다.

```swift
struct Person {
	// Property
	var name: String
	var age: Int

	// Method
	func sayHi() {
		print("\(name) says hi.")
	}
}

var person = Person(name: "Elon Musk", age: 51);
print(person.name) // prints "Elon Musk"
person.sayHi() // prints "Elon Musk says hi."
```

### b. Initializer 메서드를 호출합니다.

인스턴스 생성 시 초기 상태를 설정하기 위해 Initializer 메서드를 호출합니다.

```swift
class Person {
	var name: String
	var age: Int

	init(name: String, age: Int) {
		self.name = name
		self.age = age
		print("name: \(name), age: \(age)")
	}
}

// prints "name: Elon Musk, age: 51"
var person = Person(name: "Elon Musk", age: 51);
```

### c. extension 문법을 사용해 기능을 확장할 수 있습니다.

구조체나 클래스에 대한 extension을 작성할 수 있습니다.
예를 들면, 기본 타입인 `Int`도 구조체이기 때문에 아래처럼 제곱수를 반환하는 메서드를 추가해 사용할 수 있습니다.

```swift
extension Int {
	func square() -> Int {
		return self * self
	}
}

var num: Int = 2
print(num.square())
```

### d. protocol을 따를 수 있습니다.

아래처럼 특정 프로토콜을 따를 수 있습니다.

```swift
protocol Talkable {
	var message: String { get set }
	func say()
}

struct Person: Talkable {
	var name: String
	var message: String

	func say() {
		print("\(name) says \(message).")
	}
}

var person = Person(name: "Elon Musk", message: "hello world")
person.say() // prints "Elon Musk says hello world."
```

## 2. 구조체와 클래스의 차이점

### a. 상속

객체지향 프로그래밍 경험에서 알고 있듯이,
상속은 클래스가 갖고 있는 기능입니다.
**구조체는 상속할 수 없습니다.**

더불어 클래스는 **조상과 자손 타입간의 캐스팅**이 가능합니다.

```swift
class Person {
	var name: String
	var message: String

	init(name: String, message: String) {
		self.name = name
		self.message = message
	}
}

class Student: Person {
	var studentId: Int

	init(name: String, message: String, studentId: Int) {
		self.studentId = studentId
		super.init(name: name, message: message)
	}
}

var student = Student(name: "Elon Musk", message: "hello world", studentId: 1)

// type casting
var person: Person = student
var std: Student = person as! Student // downcast
```

### b. 값의 복사와 참조

기본적으로 구조체는 값 타입, 클래스는 참조 타입입니다.

구조체의 인스턴스는 **값의 복사를 통해 전달**됩니다.
Stack 메모리에는 같은 값을 갖는 두 개의 서로 다른 변수가 존재하게 됩니다.

```swift
struct Person {
	var name: String

	func sayHi() {
		print("\(name) says hi.")
	}
}

var a = Person(name: "Jake")
var b = a
a.name = "Paul"

a.sayHi() // prints "Paul says hi."
b.sayHi() // prints "Jake says hi."
```

클래스의 인스턴스는 Heap 메모리에 존재하며,
전달하고자 할 경우 **메모리 공간에 대한 참조가 전달**됩니다.
여러 개의 변수가 하나의 Heap 메모리 공간을 가리킵니다.

```swift
class Person {
	var name: String

	init(name: String) {
		self.name = name
	}

	func sayHi() {
		print("\(name) says hi.")
	}
}

var a = Person(name: "Jake")
var b = a
a.name = "Paul"

a.sayHi() // prints "Paul says hi."
b.sayHi() // prints "Paul says hi."
```

### c. Initializer와 Deinitializer

구조체는 자동으로 Initializer 메서드를 생성해주지만,
클래스는 그렇지 않습니다. 직접 `init()` 메서드를 정의해야 합니다.

```swift
// error: class 'Person' has no initializers
class Person {
	var name: String
}
```

그리고 클래스는 Deinitializer를 정의할 수 있습니다.

```swift
class Person {
	var name: String

	init(name: String) {
		self.name = name
		print("Hi, I'm \(name).")
	}

	deinit {
		print("I'm leaving!")
	}
}

var person: Person? = Person(name: "Jake") // prints "Hi, I'm Jake."
person = nil // prints "I'm leaving!"
```

## Reference

- [Structures and Classes — The Swift Programming Language (Swift 5.7)](https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html)
- [Swift - 구조체 클래스 - yagom's blog](https://blog.yagom.net/530/)

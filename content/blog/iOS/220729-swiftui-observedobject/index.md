---
title: SwiftUI의 @ObservedObject
date: '2022-07-29 00:00:01'
category: iOS
draft: false
---

## @ObservedObject

공식 문서에 따르면, `@ObservedObject`는
observable한 객체를 구독하면서
객체의 내용이 변경되면 뷰를 업데이트하게 만드는
Property Wrapper입니다.

```swift
@propertyWrapper @frozen struct ObservedObject<ObjectType> where ObjectType : ObservableObject
```

다시 말하면 이는 Publisher-Subscriber 패턴입니다.
Publisher는 `ObservableObject` 클래스이며,
Subscriber는 `@ObservedObject`입니다.

`@ObservedObject`로 정의된 프로퍼티는 대상 객체의 내용이 변경되면 의존 뷰들을 업데이트하는데,
뷰를 업데이트하도록 notify하는 동작은 개발자가 제어할 수 있습니다.

## ObservableObject

이름의 'Observable'에서 짐작할 수 있는 것처럼
`ObservableObject`는 **구독 가능**한 객체의 조건을 정의한
**프로토콜**입니다.

```swift
protocol ObservableObject : AnyObject
```

`ObservableObject`를 따르는 클래스는
내부에 `@Published` 애노테이션을 사용한 프로퍼티를 선언합니다.
해당 프로퍼티들의 값이 변경되면, `objectWillChange`라는 Publisher를 통해
Subscriber들에게 값의 변경이 전파됩니다.

## 예제 1

```swift
import SwiftUI

struct ContentView: View {
	// Publisher인 CounterRepo를 구독하고 있는 Subscriber
	// CounterRepo에서 발행하는 값들의 변경에 의존해 뷰가 업데이트됨
	@ObservedObject var counterRepo = CounterRepo()

    var body: some View {
		VStack {
			Text("Count: \(counterRepo.count)") // 값을 출력
				.padding()

			Button {
				counterRepo.count += 1 // 값을 변경
			} label: {
				Text("Increase")
			}
		}
    }
}

// 변수 count를 발행하는 Publisher
class CounterRepo: ObservableObject {
	@Published var count = 0
}
```

`CounterRepo` 클래스가 `ObservableObject` 프로토콜을 따르고 있으며,
내부에서 `count`라는 변수를 Publishing하고 있습니다.

그리고 `ContentView` 뷰의 프로퍼티 `counterRepo`에 `@ObservedObject`를 붙여
`CounterRepo`를 구독하고 있는 것을 알 수 있습니다.

## 예제 2

`CounterRepo`에서 꼭 `@Published` Property Wrapper를 통해 Publish하지 않아도 됩니다.
앞에서 언급한 `objectWillChange` Publisher를 직접 사용할 수 있습니다.

```swift
import SwiftUI

struct ContentView: View {
	// Publisher인 CounterRepo를 구독하고 있는 Subscriber
	// CounterRepo에서 발행하는 값들의 변경에 의존해 뷰가 업데이트됨
	@ObservedObject var counterRepo = CounterRepo()

	var body: some View {
		VStack {
			Text("Count: \(counterRepo.count)") // 값을 출력
				.padding()

			Button {
				counterRepo.count += 1 // 값을 변경
			} label: {
				Text("Increase")
			}
		}
	}
}

// 변수 count를 발행하는 Publisher
class CounterRepo: ObservableObject {
	var count = 0 {
		willSet {
			// 5의 배수마다 Publish
			if (newValue % 5 == 0) {
				objectWillChange.send()
			}
		}
	}
}
```

`objectWillChange` Publisher를 사용하면 변경된 값을 언제 Publish할 것인지
개발자가 직접 제어할 수 있습니다.

## Reference

- [SwiftUI 튜토리얼 5편 — @State, @Binding, @ObservedObject - Harry The Great](https://medium.com/harrythegreat/swiftui-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC-5%ED%8E%B8-state-binding-observedobject-83c00c3317cb)

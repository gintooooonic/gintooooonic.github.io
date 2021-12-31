---
title: 컬렉션 프레임워크 둘, Set과 Map
date: '2021-12-31 00:00:00'
category: Java
draft: false
---

## HashSet

Set 인터페이스를 구현한 것으로,
Set의 특징처럼 중복된 원소를 저장하지 않는다는 특징이 있다.
또한 저장 순서를 유지하지 않는다.

`add()`나 `addAll()`을 통해 원소를 추가할때
중복된 원소가 있으면 `false`를 반환해 추가에 실패했음을 알린다.

```java
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Playground {
  public static void main(String[] args) {
    Set set = new HashSet();
    Scanner sc = new Scanner(System.in);
    System.out.print("> ");
    int num = sc.nextInt();

    while (set.add(num)) {
      System.out.println("Added " + num);
      System.out.print("> ");
      num = sc.nextInt();
    }

    System.out.println("Failed to add " + num + " (Duplicated)");
    System.out.println("Set: " + set);
  }
}
```

```
> 2
Added 2
> 4
Added 4
> 6
Added 6
> 4
Failed to add 4 (Duplicated)
Set: [2, 4, 6]
```

중복을 방지하면서 저장 순서를 유지하고자 한다면
LinkedHashSet을 사용한다.

> #### 중복 여부의 판별
>
> HashSet은 추가하려는 원소의 `equals()`와 `hashCode()`를 호출하여
> 중복 여부를 판별한다. 만일 직접 정의한 클래스 타입의 원소를
> HashSet에 저장하고자 한다면, 해당 클래스에 `equals()`와
> `hashCode()`를 오버라이딩해야 의도한 결과를 얻을 수 있다.

## TreeSet

이진 검색 트리 형태로 원소를 저장하며,
정확히는 레드-블랙 트리로 구현되어 있다.

역시 중복된 원소를 허용하지 않으며,
저장 순서를 유지하지도 않는다.

트리에 원소를 추가하기 위해 비교 연산이 발생하므로,
Comparable을 구현하거나 Comparator를 넘겨주어
객체를 비교할 방법을 알려줘야 한다.

트리 구조를 유지하므로 원소의 추가 및 삭제에는 시간이 오래 걸리지만,
검색과 정렬에 유리하다. 특히 범위 검색.

```java
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

public class Playground {
  public static void main(String[] args) {
    Set set = new TreeSet();
    set.add(new Person("John", 15));
    set.add(new Person("Kelly", 30));
    set.add(new Person("Peter", 20));
    set.add(new Person("Tylor", 25));
    set.add(new Person("Andrew", 24));

    System.out.println("> List of all people:");
    printSet(set);

    System.out.println("\n> List of people in their 20s:");
    TreeSet tset = (TreeSet)set;
    Person low = new Person("", 20);
    Person high = new Person("", 30);
    printSet(tset.subSet(low, high));
  }

  static void printSet(Set s) {
    Iterator it = s.iterator();

    while (it.hasNext()) {
      System.out.println(it.next());
    }
  }
}

class Person implements Comparable<Person> {
  String name;
  int age;

  Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  @Override
  public int compareTo(Person p) {
    return this.age - p.age;
  }

  @Override
  public String toString() {
    return String.format("Person [name=%s, age=%d]", name, age);
  }
}
```

```
> List of all people:
Person [name=John, age=15]
Person [name=Peter, age=20]
Person [name=Andrew, age=24]
Person [name=Tylor, age=25]
Person [name=Kelly, age=30]

> List of people in their 20s:
Person [name=Peter, age=20]
Person [name=Andrew, age=24]
Person [name=Tylor, age=25]
```

## HashMap

Map 인터페이스의 구현 클래스 중 하나.

HashSet처럼 해싱을 사용하므로 검색에 뛰어난 성능을 보인다.

키와 값의 페어를 저장하며, 이는
Entry라는 내부 클래스를 통해 구현된다.

HashMap의 내부 동작에 대해서는
[해당 포스트](https://d2.naver.com/helloworld/831311)
에서 자세히 설명하고 있다.

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class Playground {
  public static void main(String[] args) {
    HashMap map = new HashMap();
    map.put("Tesla", 1070.34);
    map.put("Apple", 178.2);
    map.put("NVIDIA", 295.86);
    map.put("AMD", 145.15);
    map.put("Amazon", 3372.89);

    System.out.println("> Stock:");

    Set set = map.entrySet();
    Iterator it = set.iterator();
    while (it.hasNext()) {
      Map.Entry e = (Map.Entry)it.next();
      System.out.printf("%s - %f%n", e.getKey(), e.getValue());
    }
  }
}
```

```
> Stock:
Apple - 178.200000
NVIDIA - 295.860000
Tesla - 1070.340000
AMD - 145.150000
Amazon - 3372.890000
```

## TreeMap

이진 검색 트리 형태로 키-값 페어를 저장한다.

검색과 정렬에 유리한데, 검색의 경우 대부분은 HashMap이 더 좋은 성능을 보인다.
범위 검색과 정렬에 있어 HashMap보다 우위에 있다고 볼 수 있다.

```java
import java.util.*;

public class Playground {
  public static void main(String[] args) {
    TreeMap map = new TreeMap(new Comparator<String>() {
      @Override
      public int compare(String a, String b) {
        return -a.compareTo(b); // Descending order
      }
    });

    map.put("Tesla", 1070.34);
    map.put("Apple", 178.2);
    map.put("NVIDIA", 295.86);
    map.put("AMD", 145.15);
    map.put("Amazon", 3372.89);

    System.out.println("> Stock:");

    Set set = map.entrySet();
    Iterator it = set.iterator();
    while (it.hasNext()) {
      Map.Entry e = (Map.Entry)it.next();
      System.out.printf("%s - %f%n", e.getKey(), e.getValue());
    }
  }
}
```

```
> Stock:
Tesla - 1070.340000
NVIDIA - 295.860000
Apple - 178.200000
Amazon - 3372.890000
AMD - 145.150000
```

## 해싱 vs. 트리

해싱을 사용하는 HashSet, HashMap과

이진 검색 트리를 사용하는
TreeSet, TreeMap을 비교.

HashSet과 HashMap은 상수 시간에
검색이 가능하다. 삽입과 삭제도 마찬가지.

반면 이진 검색 트리를 사용하는
TreeSet과 TreeMap의 경우
검색, 삽입, 삭제에 `O(log N)` 시간을 소요한다.

대신 TreeSet과 TreeMap은
데이터를 정렬된 상태로 보관한다.
때문에 범위 검색에 유리하고,
정렬된 데이터가 필요한 경우에 유용하다.

[HashSet vs TreeSet in Java - GeeksforGeeks](https://www.geeksforgeeks.org/hashset-vs-treeset-in-java/)

## Properties

HashMap의 구버전인 HashTable을 상속하여 구현한 클래스.
HashTable은 `(Object, Object)` 쌍을 저장하는데 비해
Properties는 `(String, String)` 쌍을 저장하는
보다 단순하된 컬렉션 클래스이다.

애플리케이션의 환경설정과 관련된 속성을 저장하는데 사용되며,
파일에서 데이터를 읽고 쓸 수 있도록 편리한 기능을 제공한다.

## Collections 클래스

컬렉션과 관련된 유용한 메서드들을 제공한다.

- synchronizedXXX() : 멀티 쓰레드 환경에서 동기화 처리가 필요한 경우 사용
- unmodifiableXXX() : 데이터를 변경할 수 없도록 읽기 전용 컬렉션을 만들때 사용
- singletonXXX() : 싱글톤 컬렉션을 만들때 사용
- checkedXXX() : 한 종류의 객체만 저장하도록 제한하고 싶을때 사용

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [Java HashMap은 어떻게 동작하는가? - NAVER D2](https://d2.naver.com/helloworld/831311)
- [HashSet vs TreeSet in Java - GeeksforGeeks](https://www.geeksforgeeks.org/hashset-vs-treeset-in-java/)

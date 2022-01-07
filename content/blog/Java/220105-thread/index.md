---
title: 쓰레드
date: '2022-01-05 00:00:00'
category: Java
draft: false
---

모든 프로세스에는 최소 하나 이상의 쓰레드가 존재하며,
둘 이상의 쓰레드를 가진 프로세스를 멀티쓰레드 프로세스라고 한다.

`main` 메서드 또한 쓰레드를 통해 실행되며,
이를 main 쓰레드라고 한다.

## 쓰레드 구현

쓰레드를 구현하는 방법을 크게 두 가지로 나누면..

1. Thread 클래스 상속
2. Runnable 인터페이스의 구현 클래스 작성,
   그리고 그 인스턴스를 통해 Thread 객체 생성

다중 상속의 불가로 Thread 클래스를 상속하면
다른 클래스를 상속받을 수 없기 때문에
Runnable 인터페이스를 사용하는 방법이 일반적이라고 한다.
또한 재사용성이 높고 코드의 일관성을 유지할 수 있다고 하는데
아직 와닿지는 않는다.

```java
public class Playground {
  public static void main(String[] args) {
    Thread th1 = new MyThread();
    Thread th2 = new Thread(new MyRunnable());

    th1.start();
    th2.start();
  }
}

class MyThread extends Thread {
  @Override
  public void run() {
    for (int i = 1; i <= 5; ++i) {
      System.out.println(getName() + " : " + i);
    }
  }
}

class MyRunnable implements Runnable {
  @Override
  public void run() {
    for (int i = 1; i <= 5; ++i) {
      System.out.println(Thread.currentThread().getName() + " : " + i);
    }
  }
}
```

- 두 방법 공통적으로 `run()`을 구현해야 한다.
- MyThread는 Thread의 자손 클래스이므로 직접 `getName()`을 호출했지만,
  MyRunnable은 `Thread.currnetThread()`을 통해 접근하고 있다.
- `run()`을 구현했지만, 실제 실행은 `start()`를 통해 이루어진다.
  `start()`를 통해 독립적인 콜 스택에서 `run()`이 실행된다.
  쓰레드마다 다른 콜 스택을 가진다는 점이 흥미롭다.

## 싱글 쓰레드와 멀티 쓰레드

멀티 쓰레드 프로세스에서는
여러 개의 쓰레드가 작업을 나누어 처리한다.
효율적으로 들리지만, 항상 싱글 쓰레드 프로세스보다
빠르다고 장담할 수 없다.

프로세스 혹은 쓰레드가 전환되는 것을
컨텍스트 스위칭이라고 한다.
작업의 상태와 프로그램 카운터 등을 저장하고 불러오는
작업이 수행되며, 이는 오버헤드가 된다.

성능이 CPU에 의존적인 프로그램이라면
싱글 코어 프로세서에서는 오히려
싱글 쓰레드로 프로그래밍하는 것이 효율적일 것이다.

또한 멀티 코어 프로세서를 갖추고 있다고 하더라도
여러 쓰레드가 하나의 자원을 가지고 작업해야 하는 경우라면
멀티 쓰레드를 사용하는 것이 득이 되지 않을 수 있다.

## 쓰레드의 우선 순위

```java
void setPriority(int newPriority)
int getPriority()

public static final int MAX_PRIORITY = 10;
public static final int NORM_PRIORITY = 5;
public static final int MIN_PRIORITY = 1;
```

우선 순위가 높은 쓰레드는 더 많은 작업 시간을 가질 수 있다.
`setPriority()`를 통해 우선 순위를 직접 설정할 수 있다.

별도의 우선 순위를 설정하지 않는 경우,
자신을 생성한 쓰레드의 우선 순위를 갖는다.
main 쓰레드의 우선 순위는 5로 설정되어 있다.

자바는 플랫폼 독립적인 언어이지만
쓰레드의 스케쥴링은 운영체제에 종속적인 부분이다.
높은 우선 순위를 주면 항상 더 많은 작업 시간을 가질 거라고
장담할 수는 없다.
운영체제의 스케쥴링 정책과 JVM 구현에 따라 상이할 수 있다.

## 쓰레드 그룹

쓰레드 그룹을 통해 관련된 쓰레드들을 그룹으로 묶을 수 있다.
쓰레드 그룹 안에 쓰레드 그룹을 포함하는 것도 가능하다.
보안 측면의 장점으로
쓰레드는 자신이 속한 쓰레드 그룹이나 하위 쓰레드 그룹은 변경할 수 있지만
다른 쓰레드 그룹의 쓰레드를 변경할 수 없다.

`ThreadGroup` 클래스가 제공된다. [공식 문서](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadGroup.html)

```java
ThreadGroup main = Thread.currentThread().getThreadGroup();
ThreadGroup grp1 = new ThreadGroup("Group 1");
ThreadGroup grp2 = new ThreadGroup("Group 2");

ThreadGroup subGrp1 = new ThreadGroup(grp1, "SubGroup 1");
Thread th = new Thread(grp2, new MyRunnable(), "Thread");
```

## 데몬 쓰레드

다른 쓰레드의 작업을 돕는 보조적인 역할의 쓰레드이다.
일반 쓰레드(비 데몬 쓰레드)가 모두 종료되면 자동적으로 종료된다.

일반 쓰레드와 생성과 실행 방법이 같으나
실행 전에 `setDaemon()` 메서드를 호출해야 한다는 점이 다르다.

```java
Thread th = new Thread(new MyRunnable());
th.setDaemon(true);
th.start();
```

## 쓰레드의 생명 주기

![thread_lifecycle](thread_lifecycle.png)

<p align="center" style="color: #888888; font-size: 12px;">
  https://link2me.tistory.com/1730
</p>

쓰레드의 생명 주기를 나타낸 것이다.
각 원 안의 텍스트는 쓰레드의 상태를 나타내며,
화살표의 메서드를 통해 상태간 전이가 발생한다.

1. New : 쓰레드 객체가 생성되었으나 `start()`가 호출되지 않았다.
2. Runnable : 실행 가능한 상태로 대기열 큐에서 기다리는 중이다. Ready!
3. Running : 실행 중인 상태이다.
4. Waiting : I/O Block 등에 의한 일시정지 상태이다.
   일시정지가 끝나면 다시 대기열에 들어가 Runnable 상태가 된다.
5. Terminated : 쓰레드의 작업이 종료되었다.

상태의 전이를 위해 사용되는 메서드는 다음과 같다.

- `sleep()`을 사용해 일정 시간동안 쓰레드를 정지시킨다.
- `interrupt()`를 사용해 실행중인 쓰레드의 작업을 취소한다.
- `suspend()`, `resume()`, `stop()`을 통해 쓰레드를 정지시키거나 다시 실행대기시킨다.
  Deprecated.
- `yeild()`를 사용해 실행 중인 쓰레드의 남은 실행 시간을 다음 차례 쓰레드에게 양보한다.
- `join()`을 통해 실행중인 쓰레드의 작업을 멈추고 다른 쓰레드가 일정 시간동안 작업을 수행하도록 기다린다.

## 쓰레드 동기화

`synchronized` 키워드를 통해 쓰레드를 동기화할 수 있다.
쓰레드의 동기화란 진행 중인 작업에 다른 쓰레드가 간섭하지 못하도록 막는 것이다.

```java
// 메서드 전체를 임계 영역으로
public synchronized void calc() { ... }

// 하나의 블럭을 임계 영역으로
// 객체의 참조
synchronized(obj) { ... }
```

## wait()과 notify()

```java
void wait()
void wait(long timeout)
void wait(long timeout, int nanos)
void notify()
void notifyAll()
```

동기화를 통해 특정 쓰레드가 락을 얻어
다른 쓰레드의 간섭 없이 작업할 수 있도록 하였다.

여기서 발생할 수 있는 문제는
쓰레드가 락을 불필요하게 오래 갖게 되는 현상이다.
쓰레드가 당장 작업할 수 있는 상태가 아니라면
다른 쓰레드에게 락을 넘기는 것이 바람직하다.

이런 동작을 위해 `wait()`, `nofity()`, `nofityAll()`이 제공된다.

- `wait()`은 쓰레드 자신이 현재 작업이 불가능한 상태라고 판단할때 호출하여
  다른 쓰레드에게 락을 넘기고, 다시 작업이 가능해질때까지 기다린다.
- `notify()`는 기다리고 있는 쓰레드를 깨워 다시 락을 넘기는 일을 하며,
  하나의 특정 쓰레드에게 통지된다.
- `notifyAll()`은 `notify()`와 기능은 같지만 기다리고 있는
  모든 쓰레드에게 통지한다는 차이가 있다.

**예시: 베이커리 시뮬레이션**

빵집을 예시로 들 수 있는데, 하나의 테이블에 요리사는 빵을 만들어서 놓고
여러 명의 손님들이 원하는 빵을 가져가려고 기다리는 상황이다.

우선 요리사가 빵을 놓는 도중에 손님이 빵을 가져가려 하거나,
두 명의 손님이 동시에 빵을 가져가려하면 문제가 발생할 수 있기에
빵의 추가/삭제는 동기화되어야 한다. 즉, 요리사든 손님이든
한 번에 한 사람만 테이블에 접근할 수 있도록 조치한다.

손님이 도넛을 원하는데 만약 도넛이 없다면,
도넛이 만들어질 때까지 기다릴 것이다.
기다린답시고 테이블에 대한 락을 계속 가지고 있으면
요리사도 빵을 놓을 수 없고, 다른 손님들도
빵을 가져갈 수 없다.

이때 해당 손님은 `wait()`을 호출하여 요리사나
다른 손님들에게 락을 넘기고,
빵이 만들어졌을때 `notify()`로 통지를 받아
빵을 가져가면 되는 것이다.

**베이커리에서 발생한 문제점**

한 가지 문제는 특정 대상을 찝어서
`notify()`하는 것이 불가능하다는 것이다.
즉 통지의 대상이 요리사가 될지, 손님 A가 될지,
손님 B가 될지 알 수 없다.
테이블에 빵이 없다면 요리사가 통지를 받아
빵을 만들도록 하는 것이 적절한데,
정말 운이 나쁜 경우 요리사가 영영 통지를 받지 못하고
텅 빈 테이블 앞에서 손님들끼리 notify를 날리며
손만 쪽쪽 빨고 있는 상황이 발생할 수도 있다.

이후의 Lock과 Condition을 사용해
선별적 notify로 이 문제를 해결할 수 있다.

## Lock과 Condition

synchronized 대신
Lock과 Condition을 통해 동기화하는 방법이 있다.
`java.util.concurrent.locks` 패키지의 클래스들을 사용한다.

- ReentrantLock : 지금까지 공부했던 일반적인 락.
- ReentrantReadWriteLock : 읽기 락과 쓰기 락이 분리.
  읽는 도중에 다른 쓰레드가 같이 읽는 것은 OK. 하지만 읽는 도중에 쓰거나,
  쓰는 도중에 읽는 것은 허용되지 않는다.
- StampedLock : 읽기 락과 쓰기 락 외에 '낙관적 읽기 락'을 사용한다.

### ReentrantLock

ReentrantLock의 객체를 생성하고
`lock()`과 `unlock()` 등의 메서드를 호출해
락을 직접 잠그고 해제한다.
synchronized가 잠금과 해제를 자동적으로 처리해주었던 것과는
다른 모습이다.

```java
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
  // ...
} finally {
  lock.unlock();
}
```

잠근 락은 꼭 해제해주어야 하는데,
예외가 발생하거나 return하는 경우에도 락을 해제할 수 있도록
finally 블럭을 사용해 `unlock()`을 호출하는게 일반적이다.

락을 얻기 위한 메서드로 `lock()` 대신 `tryLock()`을 사용할 수도 있다.
`lock()`이 락을 얻을 때까지 블락되는 것과 달리,
`tryLock()`은 락을 얻으려고 기다리지 않는다.
쓰레드의 응답성을 높이는데 도움이 된다.

#### Condition

Condition을 통해
앞의 베이커리 예시에서 있었던
`wait()`과 `notify()`의 문제를 해결할 수 있다.

기존의 문제점은 요리사와 손님들이 같은 대기 풀에서
기다린다는 점이었다.
요리사가 손님들에게 밀려 락을 얻지 못하는 상황이 발생할 수 있었다.

요리사를 위한 풀과 손님들을 위한 풀이 따로 있다면 문제는 해결된다.
Condition을 통해 구현할 수 있다.

```java
ReentrantLock lock = new ReentrantLock();

Condition forCook = lock.newCondition();
Condition forCust = lock.newCondition();
```

ReentrantLock 객체의 `newCondition()`을 통해
요리사의 Condition과 손님들의 Condition을 따로 생성하였다.

이제 `wait()`과 `notify()` 대신,
같은 기능을 하는 Condition의 `await()`와 `signal()`을 사용하면 문제를 해결할 수 있다.

## volatile

효율을 위해 CPU에서는 캐시를 운영하는데,
멀티 코어 환경의 경우 코어마다 별도의 캐시를 가진다.

멀티 쓰레드 환경에서 캐시의 미갱신으로 인해
메모리와 캐시의 값 불일치 문제가 발생할 수 있다.
예를 들면 변수의 값을 계속해서 쓰고 쓰레드 A와
읽기만 하는 쓰레드 B, C가 있을 때,
A는 쓰는 입장이므로 최신의 값을 유지하지만
B와 C는 예전 값을 읽게 될 수도 있다.

volatile 제어자로 변수를 선언하면
캐시가 아닌 메모리에서 값을 읽도록 하여
문제를 해결할 수 있다.

또는 변수의 값을 읽을 때 synchronized 블럭을 사용해도
해결할 수 있다. synchronized 블럭에 들어갈 때와 나올 때
캐시와 메모리간 동기화가 이루어진다.

또한 volatile 제어자로 `long`이나 `double` 변수를 선언하면
이들의 읽기와 쓰기를 원자화할 수 있다.
원래 JVM은 4바이트씩 읽고 쓰기 때문에 `int`와 같은 타입들은
한 번에 읽고 쓰는 것이 가능하다. 하지만 8바이트인
`long`과 `double`은 그렇지 않으므로
변수 값을 읽는 도중에 다른 쓰레드가 끼어들 수 있다.
volatile로 읽기와 쓰기를 원자화하여 이 문제를 해결할 수 있다.

## fork & join 프레임워크

멀티 쓰레드 프로그래밍의 다른 방법이다.
하나의 작업을 여러 개로 쪼개 처리하는 코드를
좀 더 쉽게 작성할 수 있다.

추상 클래스인 RecursiveAction 또는
RecursiveTask를 상속하여 구현한다.
전자는 반환값이 없는 작업,
후자는 반환값이 있는 작업을 구현할 때 사용한다.

추상 메서드 `compute()`를 구현해 작업을 작성해주면 된다.

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class Playground {
  static final ForkJoinPool pool = new ForkJoinPool();

  public static void main(String[] args) {
    SumTask task = new SumTask(1, 100);
    Long result = pool.invoke(task); // invoke를 통해 실행
    System.out.println(result);
  }
}

class SumTask extends RecursiveTask<Long> { // RecursiveTask 상속
  long from, to;

  SumTask(long from, long to) {
    this.from = from;
    this.to = to;
  }

  public Long compute() { // compute()를 구현
    long size = to - from + 1;

    if (size <= 5)
      return sum();

    long half = (from + to) / 2;

    SumTask leftSum = new SumTask(from, half);
    SumTask rightSum = new SumTask(half + 1, to);

    leftSum.fork(); // 작업을 fork

    return rightSum.compute() + leftSum.join(); // 작업을 join
  }

  long sum() {
    long tmp = 0L;
    for (long i = from; i <= to; ++i)
      tmp += i;
    return tmp;
  }
}
```

`rightSum`은 `compute()`를 호출해
재귀적으로 이분할하고
`leftSum`은 `fork()`를 통해 작업 큐에 추가하고 있다.
작업 큐에 추가된 작업들은 `join()`을 통해 수행되어 결과를 반환한다.

**ForkJoinPool**

fork & join 프레임워크에서 제공하는 쓰레드 풀이다.

쓰레드마다 본인의 작업 큐를 관리하는데,
작업 큐가 비어 있는 쓰레드는 다른 쓰레드의 작업 큐에서
작업을 가져와 수행한다. Work stealing이라고 부른다.

**fork()와 join()**

- `fork()` : 해당 작업을 쓰레드 풀의 작업 큐에 넣는다.
  비동기 메서드라서 블락 없이 바로 다음 문장이 실행된다.
- `join()` : 해당 작업을 수행하여 결과를 반환한다.
  동기 메서드라서 작업의 수행이 끝날 때까지 기다린다.

## Reference

- 남궁성, Java의 정석 (3rd Edition), 도우출판
- [ThreadGroup (Java Platform SE 8) - Oracle](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadGroup.html)

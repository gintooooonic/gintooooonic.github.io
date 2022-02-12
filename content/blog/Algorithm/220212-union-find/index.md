---
title: Union Find 알고리즘
date: '2022-02-12 00:00:00'
category: Algorithm
draft: false
---

## Union Find 알고리즘이란

- `Union`과 `Find` 연산을 제공한다고 하여 Union Find
- 다른 이름은 Disjoint Set Union (DSU)
- 두 집합을 합치고, 임의의 두 원소가 같은 집합에 있는지 빠르게 알 수 있음

## 동작 과정

- 두 개의 연산을 제공
  - `union(x, y)` : x가 속한 집합과 y가 속한 집합을 합치는 연산
  - `find(x)` : x가 속한 집합을 대표하는 원소를 반환
- 각 원소는 본인의 부모 원소를 갖게 되고, 최상위 부모 원소가 집합의 대표 값이 됨
- 각 원소마다 본인의 부모 원소를 저장하는 배열이 필요
- 마치 트리와 같음

## 구현

```cpp
// 각 원소의 부모를 보관
int par[10000];

// 재귀적으로 루트 원소를 찾아 반환
int find(int x) {
    if (x == par[x]) return x;
    return find(par[x]);
}

// x와 y의 루트 원소를 찾아 하나를 다른 하나의 부모로 지정
// C++에서는 union이 키워드이므로 다른 이름을 사용하였음
void merge(int x, int y) {
    x = find(x);
    y = find(y);
    if (x != y) par[y] = x;
}

int main(void) {
    // par 배열 초기화
    for (int i = 0; i < 10000; ++i)
        par[i] = i;

    // merge & find
    // ...

    return 0;
}
```

- Find와 Union 연산을 최적화하면 평균적으로 `O(α(n))` 시간이 소요
  - `α(n)`은 [Ackermann 함수](https://ko.wikipedia.org/wiki/%EC%95%84%EC%BB%A4%EB%A7%8C_%ED%95%A8%EC%88%98)의 역함수
  - 상수 시간에 가까울 정도로 n에 대해 매우 느리게 증가
- 일반적인 알고리즘 문제 풀이에서는 최적화 없이 사용해도 괜찮을 것으로 보임

### Find 연산 최적화

```cpp
int find(int x) {
    if (x == par[x]) return x;
    return par[x] = find(par[x]);
}
```

- 기존 코드는 루트 원소와의 거리가 먼 경우 재귀 호출이 많이 일어나기 때문에 최악의 경우 `O(n)` 시간 소요
- 루트 원소를 찾아 올라가는 경로의 모든 원소들을 루트 원소에 직접 붙여줌으로써 경로를 단축
- 첫 번째 Find에서는 시간 차이가 없겠지만, 그 이후에는 상수 시간에 찾을 수 있을 것
- 평균적으로 `O(log(n))` 시간 소요

### Union 연산 최적화

```cpp
int set_size[10000]; // 먼저 1로 초기화

void merge(int x, int y) {
    x = find(x);
    y = find(y);
    if (x != y) {
        if (set_size[x] < set_size[y])
            swap(x, y);
        par[y] = x;
        set_size[x] += set_size[y];
    }
}
```

- 기존 코드는 항상 두 번째 집합이 첫 번째 집합에 붙도록 방향이 고정
- 최악의 경우 트리의 depth가 `O(n)`이 될 수 있음
- 크기가 작은 집합이 크기가 큰 집합에 붙도록 최적화
- depth가 작은 트리를 큰 트리의 루트에 붙이는 꼴이 됨
- 평균적으로 `O(log(n))` 시간 소요

## Reference

- [Disjoint Set Union - Algorithms for Competitive Programming](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

---
title: 최소 신장 트리
date: '2022-02-13 00:00:00'
category: Algorithm
draft: false
---

## 1. Minimum spanning tree

### Spanning tree

- 무방향 가중치 그래프가 주어졌을때, Spanning tree는 다음 조건을 만족하는 Subtree
  - 모든 정점들은 직간접적 연결 관계
  - 즉, 임의의 두 정점 사이에 반드시 경로가 존재

### Minimum spanning tree

- 그래프에서 얻을 수 있는 Spanning tree 중 비용이 최소인 것
  - Spanning tree의 비용은 간선들의 가중치 합
- 간선의 개수는 `(정점의 개수) - 1`
  - Spanning tree의 조건을 만족시키면서 최소한의 간선을 선택하므로
- MST를 구하는 알고리즘으로 Kruskal 알고리즘, Prim 알고리즘이 있음

## 2. Kruskal 알고리즘

- 간선을 가중치가 작은 순으로 하나씩 읽으며 트리에 포함할지 결정하는 방식
  - 간선이 잇는 두 정점이 이미 연결 관계에 있다면 트리에 포함하지 않음
  - 두 정점이 이미 연결되어 있는지 확인하기 위해서 [Union Find 알고리즘](https://gintooooonic.github.io/Algorithm/220212-union-find/)을 사용
- 최적화된 Union Find 알고리즘을 사용하면 `O(M * log(N))` 시간에 동작 가능

## 동작 과정

1. 주어진 그래프의 모든 간선들을 가중치 오름차순으로 정렬
2. 아직 읽지 않은 최소 가중치의 간선을 선택
3. 간선이 잇는 두 정점이 이미 같은 그래프에 있다면 2번으로
4. 두 정점을 Union
5. (MST의 비용을 구하는 경우) 간선의 가중치를 합계 값에 합산

## 구현

[BOJ 1197: 최소 스패닝 트리](https://www.acmicpc.net/problem/1197)를 풀이합니다.

```cpp
#include <bits/stdc++.h>
using namespace std;

#define FASTIO ios_base::sync_with_stdio(false);cin.tie(NULL);
#define endl '\n'
#define ll long long
#define tiii tuple<int, int, int>

const int VV = 10001;
int V, E, parent[VV], set_size[VV];
vector<tiii> edges;

int find(int x) {
    if (x == parent[x]) return x;
    return parent[x] = find(parent[x]);
}

void merge(int x, int y) {
    x = find(x), y = find(y);
    if (x != y) {
        if (set_size[x] < set_size[y])
            swap(x, y);
        parent[y] = x;
        set_size[x] += set_size[y];
    }
}

int main(void) {
    FASTIO
    // 입력
    cin >> V >> E;
    while (E--) {
        int a, b, w;
        cin >> a >> b >> w;
        edges.push_back({ w, a, b });
    }
    sort(edges.begin(), edges.end());

    // Union Find를 위한 초기화
    for (int i = 1; i <= V; ++i) {
        parent[i] = i;
        set_size[i] = i;
    }

    // Kruskal 알고리즘
    ll cost_sum = 0;
    for (auto edge : edges) {
        auto [weight, a, b] = edge;
        if (find(a) != find(b)) {
            merge(a, b);
            cost_sum += weight;
        }
    }
    cout << cost_sum << endl;

    return 0;
}
```

## 3. Prim 알고리즘

-

## Reference

- [Spanning tree - Wikipedia](https://en.wikipedia.org/wiki/Spanning_tree)
- [Minimum spanning tree - Kruskal with Disjoint Set Union - Algorithms for Competitive Programming](https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html)

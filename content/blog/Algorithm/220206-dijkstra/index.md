---
title: Dijkstra 알고리즘
date: '2022-02-06 00:00:00'
category: Algorithm
draft: false
---

## Dijkstra 알고리즘이란

- 그래프에서 노드 사이의 최단 경로를 찾는 알고리즘
- 하나의 노드에서 다른 모든 노드까지의 최단 경로를 구함 (Single-source shortest paths)
- 간선의 가중치가 음수인 경우에는 사용할 수 없음

## 동작 과정

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GazC3A4OQTE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

1. 전체 정점 중에서 아직 방문하지 않았으면서 현재까지 기록된 최단 거리가 제일 짧은 정점 `from`을 선택
2. `from`의 인접 정점 `to`들을 순회하며, 만약 `(현재 from 까지의 최단 거리) + (from ~ to 거리)`가 기존에 알고 있던 `to`까지의 최단 거리보다 짧다면 값을 갱신
3. `from`을 방문 처리하고 다시 1번으로 이동

## 성능

위 [요약](#요약) 1번 과정의 구현에 따라 달라질 수 있습니다.

1. 전체 V개의 정점을 순회하면서 `from`을 찾는 경우 총 V번만에 찾을 수 있고,
   이것을 총 V번의 방문마다 실행함. 그리고 방문 정점마다 인접 정점을 확인하므로 총 E번의 최단 거리 검사가 발생. 총 시간 복잡도는 `O(V^2 + E)`
2. 우선 순위 큐를 사용하면 `from`을 찾는 비용이 줄어 V의 로그 시간에 찾을 수 있음.
   그리고 우선 순위 큐의 특성상 최단 거리를 갱신할때 로그 시간이 소요됨. 총 시간 복잡도는 `O((V + E) * log(V))`

## 구현

[BOJ 1753번: 최단 경로](https://www.acmicpc.net/problem/1753) 문제를 풀이합니다.

### 첫 번째 솔루션 (TLE)

위 [시간 복잡도](#시간-복잡도)의 1번에 해당하는 풀이.
정점의 최대 개수가 20,000개라서 그런지 TLE가 발생한다.

```cpp
#include <bits/stdc++.h>
using namespace std;

#define FASTIO ios_base::sync_with_stdio(false);cin.tie(NULL);
#define endl '\n'
#define ll long long
#define pii pair<int, int>

const int VV = 20001, INF = INT_MAX;
int V, E, K, d[VV];
bool marked[VV];
vector<pii> g[VV];

void dijkstra(int start) {
    // 초기화
    fill(d, d + V + 1, INF);
    fill(marked, marked + V + 1, false);

    d[start] = 0;
    for (int i = 1; i <= V; ++i) {
        // 정점 from을 선택
        int from = -1;
        for (int j = 1; j <= V; ++j) {
            if (!marked[j] && (from == -1 || d[j] < d[from]))
                from = j;
        }

        // 더 이상 방문할 필요가 없음
        if (d[from] == INF)
            break;

        // 인접 정점들을 순회
        for (auto e : g[from]) {
            auto [to, dist] = e;

            // 최단 거리 갱신
            if (d[from] + dist < d[to])
                d[to] = d[from] + dist;
        }

        // 방문 처리
        marked[from] = true;
    }
}

int main(void) {
    FASTIO
    cin >> V >> E >> K;
    while (E--) {
        int u, v, w;
        cin >> u >> v >> w;
        g[u].emplace_back(v, w);
    }

    dijkstra(K);

    for (int i = 1; i <= V; ++i) {
        if (d[i] == INF) cout << "INF" << endl;
        else cout << d[i] << endl;
    }

    return 0;
}
```

### 두 번째 솔루션 (AC)

우선 순위 큐를 사용해 시간 복잡도를 개선하였다.

```cpp
#include <bits/stdc++.h>
using namespace std;

#define FASTIO ios_base::sync_with_stdio(false);cin.tie(NULL);
#define endl '\n'
#define ll long long
#define pii pair<int, int>

const int VV = 20001, INF = INT_MAX;
int V, E, K, d[VV];
bool marked[VV];
vector<pii> g[VV];
priority_queue<pii, vector<pii>, greater<pii>> pq;

void dijkstra(int start) {
    // 초기화
    fill(d, d + V + 1, INF);

    d[start] = 0;
    pq.push({ 0, start });
    while (pq.size()) {
        // 정점 from을 선택
        auto [d_from, from] = pq.top(); pq.pop();

        // 최단 거리가 아닌 경우 무시
        if (d_from > d[from]) continue;

        // 인접 정점들을 순회
        for (auto e : g[from]) {
            auto [to, d_to] = e;

            // 최단 거리 갱신
            if (d_from + d_to < d[to]) {
                d[to] = d_from + d_to;
                pq.push({ d[to], to });
            }
        }
    }
}

int main(void) {
    FASTIO
    cin >> V >> E >> K;
    while (E--) {
        int u, v, w;
        cin >> u >> v >> w;
        g[u].emplace_back(v, w);
    }

    dijkstra(K);

    for (int i = 1; i <= V; ++i) {
        if (d[i] == INF) cout << "INF" << endl;
        else cout << d[i] << endl;
    }

    return 0;
}
```

## Reference

- [Dijkstra's algorithm - Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [Dijkstra Algorithm - Algorithms for Competitive Programming](https://cp-algorithms.com/graph/dijkstra.html)
- [Dijkstra's Algorithm - Computerphile - YouTube](https://www.youtube.com/watch?v=GazC3A4OQTE)

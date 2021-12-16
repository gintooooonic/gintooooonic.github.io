---
title: 자바의 제어문(Control flow)
date: '2021-12-16 00:00:00'
category: Java
draft: false
---

자바의 조건문과 반복문은 기존에 알고 있던 C++의 그것과 크게 다르지 않았다.

`for` 문에 Label을 붙이고 `break` 할때 해당 Label을 명시해서 반복문을 탈출할 수 있는 기능은 흥미로웠다.
중첩 반복문에서 한 번에 가장 바깥 반복문으로 탈출할 수 있도록 구현할 수 있겠구나!

```java
// 1단 다섯 번만에 계산이 힘들다며 구구단을 종료하는 프로그램
public class NestedLoop {
    public static void main(String[] args) {
        outer: for (int i = 1; i <= 9; ++i) {
            for (int j = 1; j <= 9; ++j) {
                System.out.println(i + " * " + j + " is " + (i * j));
                if (j >= 5) {
                    System.out.println("It's tough... Good bye");
                    break outer;
                }
            }
        }
    }
}
```

`continue` 또한 Label을 지정할 수 있다고 한다.

그 밖에 조건문과 반복문에 대한 내용은 `quick sort` 알고리즘을 구현하며 연습해보는 것으로 대신한다.

```java
public class QuickSort {
    public static void main(String[] args) {
        int[] arr = {7, 3, 5, 4, 8, 0, 1, 9, 2, 6};

        System.out.println("[BEFORE]");
        printArr(arr);

        System.out.println("[AFTER]");
        sort(arr, 0, arr.length);
        printArr(arr);
    }

    static void sort(int[] arr, int from, int to) {
        if (to - from <= 1)
            return;

        int pivot = from;
        int less = to - 1;
        int greater = from + 1;

        while (greater <= less) {
            // Find a number greater than pivot
            while (greater < to && arr[greater] <= arr[pivot]) ++greater;
            // Find a number less than pivot
            while (less > from && arr[less] >= arr[pivot]) --less;

            // Swap
            if (less < greater) swap(arr, pivot, less);
            else swap(arr, less, greater);
        }

        sort(arr, from, less);
        sort(arr, less + 1, to);
    }

    static void swap(int[] arr, int idx1, int idx2) {
        int tmp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = tmp;
    }

    static void printArr(int[] arr) {
        System.out.printf("Array [ ");
        for (int i = 0; i < arr.length; ++i)
            System.out.printf("%d ", arr[i]);
        System.out.printf("]%n");
    }
}
```

```
[BEFORE]
Array [ 7 3 5 4 8 0 1 9 2 6 ]
[AFTER]
Array [ 0 1 2 3 4 5 6 7 8 9 ]
```

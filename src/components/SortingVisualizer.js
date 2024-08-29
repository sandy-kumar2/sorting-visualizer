import React, { useState } from "react";
import ArrayBar from "./ArrayBar";
import "./SortingVisualizer.css";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(50); // Initialize with a default size
  const [time, setTime] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const generateArray = () => {
    if (!size || size < 5 || size > 100000) {
      alert("Please enter a valid array size between 5 and 1000.");
      return;
    }
    const newArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 500)
    );
    setArray(newArray);
    setTime(null); // Reset time when a new array is generated
    setSearchResult(null); // Reset search results
  };

  const measureTime = (operation) => {
    const startTime = performance.now();
    operation();
    const endTime = performance.now();
    setTime((endTime - startTime).toFixed(2));
  };

  // Sorting functions
  const bubbleSort = () => {
    measureTime(() => {
      let sortedArray = [...array];
      for (let i = 0; i < sortedArray.length - 1; i++) {
        for (let j = 0; j < sortedArray.length - i - 1; j++) {
          if (sortedArray[j] > sortedArray[j + 1]) {
            [sortedArray[j], sortedArray[j + 1]] = [
              sortedArray[j + 1],
              sortedArray[j],
            ];
          }
        }
      }
      setArray(sortedArray);
    });
  };

  const selectionSort = () => {
    measureTime(() => {
      let sortedArray = [...array];
      for (let i = 0; i < sortedArray.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < sortedArray.length; j++) {
          if (sortedArray[j] < sortedArray[minIndex]) {
            minIndex = j;
          }
        }
        if (minIndex !== i) {
          [sortedArray[i], sortedArray[minIndex]] = [
            sortedArray[minIndex],
            sortedArray[i],
          ];
        }
      }
      setArray(sortedArray);
    });
  };

  const mergeSort = () => {
    measureTime(() => {
      const sortedArray = mergeSortRecursive(array);
      setArray(sortedArray);
    });
  };

  const mergeSortRecursive = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortRecursive(arr.slice(0, mid));
    const right = mergeSortRecursive(arr.slice(mid));
    return merge(left, right);
  };

  const merge = (left, right) => {
    const result = [];
    while (left.length && right.length) {
      if (left[0] < right[0]) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }
    return result.concat(left).concat(right);
  };

  const quickSort = () => {
    measureTime(() => {
      let sortedArray = [...array];
      quickSortRecursive(sortedArray, 0, sortedArray.length - 1);
      setArray(sortedArray);
    });
  };

  const quickSortRecursive = (arr, low, high) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSortRecursive(arr, low, pi - 1);
      quickSortRecursive(arr, pi + 1, high);
    }
  };

  const partition = (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  const insertionSort = () => {
    measureTime(() => {
      let sortedArray = [...array];
      for (let i = 1; i < sortedArray.length; i++) {
        let key = sortedArray[i];
        let j = i - 1;
        while (j >= 0 && sortedArray[j] > key) {
          sortedArray[j + 1] = sortedArray[j];
          j--;
        }
        sortedArray[j + 1] = key;
      }
      setArray(sortedArray);
    });
  };

  // Search functions
  const linearSearch = (arr, target) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        return i;
      }
    }
    return -1;
  };

  const binarySearch = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  };

  const handleSearch = () => {
    if (searchValue === "") {
      alert("Please enter a value to search.");
      return;
    }

    const target = Number(searchValue);

    // Perform linear search on the original array
    const linearResult = linearSearch(array, target);

    // Perform binary search on a sorted copy of the array
    const sortedArray = [...array].sort((a, b) => a - b);
    const binaryResult = binarySearch(sortedArray, target);

    setSearchResult({
      linear:
        linearResult !== -1 ? `Found at index ${linearResult}` : "Not found",
      binary:
        binaryResult !== -1 ? `Found at index ${binaryResult}` : "Not found",
    });
  };

  return (
    <div className="sorting-visualizer">
      <div className="controls">
        <label>Array Size:</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          min="5"
          max="1000"
        />
        <button onClick={generateArray}>Generate Array</button>
      </div>
      <div className="array-container">
        {array.map((value, idx) => (
          <ArrayBar key={idx} value={value} />
        ))}
      </div>
      <div className="buttons">
        <button onClick={bubbleSort}>Bubble Sort</button>
        <button onClick={selectionSort}>Selection Sort</button>
        <button onClick={mergeSort}>Merge Sort</button>
        <button onClick={quickSort}>Quick Sort</button>
        <button onClick={insertionSort}>Insertion Sort</button>
      </div>
      <div className="search">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter value to search"
        />
        <button onClick={handleSearch}>Search</button>
        {searchResult && (
          <div>
            <p>Linear Search: {searchResult.linear}</p>
            <p>Binary Search: {searchResult.binary}</p>
          </div>
        )}
      </div>
      {time && <p>Sort Time taken: {time} ms</p>}
    </div>
  );
};

export default SortingVisualizer;

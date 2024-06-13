import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingTime(0);
    if (file) {
      const startTime = performance.now();
      const numbers = await readFileAsNumbers(file);
      const stats = calculateStats(numbers);
      const endTime = performance.now();
      const processingTimeInSeconds = (endTime - startTime) / 1000;
      setProcessingTime(processingTimeInSeconds);
      setResult(stats);
      setIsProcessing(false);
    }
  };

  const readFileAsNumbers = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split('\n');
        const numbers = lines.flatMap((line) => line.trim().split(/\s+/)).map(Number);
        resolve(numbers);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const calculateStats = (numbers) => {
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const max = sortedNumbers[sortedNumbers.length - 1];
    const min = sortedNumbers[0];
    const median = calculateMedian(sortedNumbers);
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const increasingSequence = findLongestIncreasingSequence(numbers);
    const decreasingSequence = findLongestDecreasingSequence(numbers);

    return { max, min, median, mean, increasingSequence, decreasingSequence };
  };

  const calculateMedian = (sortedNumbers) => {
    const len = sortedNumbers.length;
    const midIndex = Math.floor(len / 2);
    if (len % 2 === 0) {
      return (sortedNumbers[midIndex - 1] + sortedNumbers[midIndex]) / 2;
    } else {
      return sortedNumbers[midIndex];
    }
  };

  const findLongestIncreasingSequence = (numbers) => {
    let longestSequence = [];
    let currentSequence = [];

    for (let i = 0; i < numbers.length; i++) {
      if (i === 0 || numbers[i] >= numbers[i - 1]) {
        currentSequence.push(numbers[i]);
      } else {
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
        }
        currentSequence = [numbers[i]];
      }
    }

    if (currentSequence.length > longestSequence.length) {
      longestSequence = currentSequence;
    }

    return longestSequence;
  };

  const findLongestDecreasingSequence = (numbers) => {
    let longestSequence = [];
    let currentSequence = [];

    for (let i = 0; i < numbers.length; i++) {
      if (i === 0 || numbers[i] <= numbers[i - 1]) {
        currentSequence.push(numbers[i]);
      } else {
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
        }
        currentSequence = [numbers[i]];
      }
    }

    if (currentSequence.length > longestSequence.length) {
      longestSequence = currentSequence;
    }

    return longestSequence;
  };

  return (
    <div className="App">
      <h1>File Statistics Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Calculate'}
        </button>
      </form>
      {result && (
        <div>
          <h2>Results</h2>
          <p>Max: {result.max}</p>
          <p>Min: {result.min}</p>
          <p>Median: {result.median}</p>
          <p>Mean: {result.mean}</p>
          <p>Increasing Sequence: {result.increasingSequence.join(', ')}</p>
          <p>Decreasing Sequence: {result.decreasingSequence.join(', ')}</p>
          <p>Processing Time: {processingTime.toFixed(2)} seconds</p>
        </div>
      )}
    </div>
  );
}

export default App;
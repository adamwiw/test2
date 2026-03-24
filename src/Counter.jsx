import { useState } from 'react'
import './Counter.css'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <div className="button-group">
        <button onClick={decrement} aria-label="Decrement">-</button>
        <button onClick={reset} aria-label="Reset">Reset</button>
        <button onClick={increment} aria-label="Increment">+</button>
      </div>
    </div>
  )
}

export default Counter

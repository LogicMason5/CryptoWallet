import React, { useState } from "react";

type CounterProps = {
  initial?: number;
};

const Counter: React.FC<CounterProps> = ({ initial = 0 }) => {
  const [count, setCount] = useState<number>(initial);

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Simple Counter</h2>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button
        onClick={() => setCount(count - 1)}
        style={{ marginLeft: 10 }}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

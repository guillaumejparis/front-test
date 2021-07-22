import { useState, useMemo, useEffect, useCallback } from 'react';

import './App.css';
import Content from './Content';
import { usePrevious, useWindowSize, useWheel, useTouch, useDirection } from './hooks';
import { getBaseContentList, steps } from './utils';

function App() {
  const { height } = useWindowSize();
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(0);
  const prevAnimate = usePrevious(animate);
  const [multiple, setMultiple] = useState(1);
  const contentList = useMemo(() => {
    let tmpContentList = [];
    for (let i = 0; i < multiple; i++) {
      tmpContentList.push.apply(tmpContentList, getBaseContentList(i));
    }
    return tmpContentList;
  }, [multiple]);
  const contentListLastIndex = useMemo(() => contentList.length - 1, [contentList]);
  const contentListLength = useMemo(() => contentList.length, [contentList]);

  const up = useCallback(() => index - 1 >= 0 && setAnimate(-1), [index]);
  const down = useCallback(() => index < contentListLastIndex && setAnimate(1), [index, contentListLastIndex]);
  const setItemsNumber = useCallback((newMultiple) => {
    setIndex(0);
    setMultiple(newMultiple);
  }, []);

  useEffect(() => {
    if (prevAnimate !== 0 && animate === 0) setIndex(index + prevAnimate || 0);
  }, [prevAnimate, animate, index]);
  useDirection(useWheel, animate, up, down);
  useDirection(useTouch, animate, up, down);

  return (
    <div className="App">
      <Content
        data={contentList[index - 1]}
        contentListLength={contentListLength}
        top={-height}
        height={height}
        animate={animate}
        step={steps.PREVIOUS}
      />
      <Content
        data={contentList[index]}
        contentListLength={contentListLength}
        onTransitionEnd={() => {
          setAnimate(0);
        }}
        top={0}
        height={height}
        animate={animate}
        step={steps.CURRENT}
      />
      <Content
        data={contentList[index + 1]}
        contentListLength={contentListLength}
        top={height}
        height={height}
        animate={animate}
        step={steps.NEXT}
      />
      {/* buttons */}
      <div className="App-buttons">
        <div>
          <button onClick={() => setItemsNumber(1)}>x1</button>
          <button onClick={() => setItemsNumber(10000)}>x10000</button>
          <button onClick={() => setItemsNumber(100000)}>x100000</button>
        </div>
        <div>
          <button onClick={up}>Prev</button>
          <button onClick={down}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default App;

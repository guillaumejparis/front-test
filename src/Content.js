import { steps, transition } from './utils';
import './Content.css';

const Content = ({ data, contentListLength, top, step, animate, height, onTransitionEnd }) => {
  let style = {};

  if (step === steps.PREVIOUS && animate === -1) style = { top: 0, transition };
  if (step === steps.NEXT && animate === 1) style = { top: 0, transition };
  if (step === steps.CURRENT && animate !== 0)
    style = { top: animate === -1 ? height : -height, opacity: 0, transition };

  return (
    <div className="Content" style={{ top, ...style }} onTransitionEnd={onTransitionEnd}>
      {`${data?.index}/${contentListLength}- ${data?.text}`}
      <input type="text" className="Content-input" disabled value="placeholder" />
    </div>
  );
};

export default Content;

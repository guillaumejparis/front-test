export const getBaseContentList = (baseIndex) => [
  { index: 1 + 3 * baseIndex, text: 'What ?', value: '' },
  { index: 2 + 3 * baseIndex, text: 'Why ?', value: '' },
  { index: 3 + 3 * baseIndex, text: 'Who ?', value: '' },
];

export const transition = 'top .5s ease-out, opacity .5s';

export const steps = { PREVIOUS: 'PREVIOUS', CURRENT: 'CURRENT', NEXT: 'NEXT' };
export const directions = { UP: 'UP', DOWN: 'DOWN' };

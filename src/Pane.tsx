import React from 'react';

export interface IPaneProps {
  className?: string;
  style?: React.CSSProperties;

  children?: React.ReactNode;

  initialSize?: number;
  minSize?: number;
  maxSize?: number;

  eleRef?: (node: HTMLDivElement) => void;
}

function Pane(props: IPaneProps) {

  const eleRef = (node: HTMLDivElement) => {
    if (props.eleRef) props.eleRef(node);
  }

  let initialSize = 'auto';
  if (props.initialSize !== undefined) {
    initialSize = `${props.initialSize}px`;
  }

  let minSize;
  if (props.minSize !== undefined) {
    minSize = `${props.minSize}px`;
  }

  let maxSize;
  if (props.maxSize !== undefined) {
    maxSize = `${props.maxSize}px`;
  }

  const style: React.CSSProperties = {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: initialSize,
    minWidth: minSize,
    maxWidth: maxSize,
    ...props.style
  };

  if (initialSize === 'auto') {
    style.flexGrow = 1;
    style.flexShrink = 1;
  }

  return (
    <div ref={eleRef} className={['pane', props.className].join(' ')} style={style}>
      {props.children}
    </div>
  );
}

export default Pane;

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Pane, { IPaneProps } from './Pane';

export interface ISplitPaneProps {
  className?: string;
  style?: React.CSSProperties;

  children: React.ReactElement<IPaneProps> | React.ReactElement<IPaneProps>[];

  updateCallback?: () => void;
}

function SplitPane(props: ISplitPaneProps) {

  const panes: React.ReactElement<IPaneProps>[] = [];
  if (Array.isArray(props.children)) {
    panes.push(...props.children);
  } else {
    panes.push(props.children);
  }

  const wrapper = useRef<HTMLDivElement>(null);

  const [currentSeparator, setCurrentSeparator] = useState<HTMLDivElement>();
  const [currentPane, setCurrentPane] = useState<HTMLDivElement>();

  const [active, setActive] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  const onMouseUp = () => {
    setActive(false);

    if (wrapper.current) {
      const eles = wrapper.current.querySelectorAll('.separator.active');
      eles.forEach((separator) => separator.classList.remove('active'));
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);

    const position = e.clientX;
    setStartPosition(position);
    setCurrentPosition(position);

    e.currentTarget.classList.add('active');
    setCurrentSeparator(e.currentTarget);
    setCurrentPane(e.currentTarget.previousSibling as HTMLDivElement);
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const newPosition = e.clientX;
    setCurrentPosition(newPosition);
  };

  const swipePane = useCallback(() => {
    if (active && currentSeparator && currentPane) {

      const currentPaneRect = currentPane.getBoundingClientRect();
      const width = currentPaneRect.width + (currentPosition - startPosition);
      const min = Number(currentPane.style.minWidth.replace('px', '')) || 0;
      const max = Number(currentPane.style.maxWidth.replace('px', '')) || 0;

      if (min === 0 && currentPosition <= currentPaneRect.left) {
        return
      }
      if (min > 0 && max > 0 && (width <= min || width >= max)) {
        return
      }

      currentPane.style.flexBasis = `${width}px`;
      setStartPosition(currentPosition);
    }
  }, [active, currentSeparator, currentPane, startPosition, currentPosition]);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return function cleanup() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    swipePane();
  }, [swipePane]);

  return (
    <>
      <div ref={wrapper} className="split-pane">
        {
          panes.map((pane, index) => {
            return <React.Fragment key={`child-${index}`}>
              <Pane
                key={`pane-${index}`}
                {...pane.props}
              />
              {
                index < panes.length - 1 &&
                <div
                  key={`separator-${index}`}
                  className="separator"
                  onMouseDown={onMouseDown}
                />
              }
            </React.Fragment>
          })
        }
      </div>
    </>
  );
}

SplitPane.defaultProps = {};

export default SplitPane;

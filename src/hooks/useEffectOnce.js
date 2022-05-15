import React from "react";

export const useEffectOnce = (effect) => {
  const destroyFunc = React.useRef();
  const calledOnce = React.useRef(false);
  const renderAfterCalled = React.useRef(false);

  if (calledOnce.current) {
    renderAfterCalled.current = true;
  }

  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    calledOnce.current = true;
    destroyFunc.current = effect();

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }

      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

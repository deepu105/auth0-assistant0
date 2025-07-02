import { useEffect } from 'react';

/**
 * useScript is a hook for appending script elements to the body of the document
 * @param {string} appendTo where in the document will the script be appended to, e.g. head, body
 * @param {object} attributes script element attributes such as src, type, text and async
 * @param {boolean} shouldLoad allows to conditionally apend/remove the script
 */

export const useScript = (
  appendTo: keyof Document,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: { [key: string]: any },
  shouldLoad = true
) => {
  useEffect(() => {
    if (typeof document === 'undefined' || !shouldLoad) {
      return;
    }

    const script = document.createElement('script');
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'text') {
        script.text = value;
      } else {
        script.setAttribute(key, value);
      }
    });
    (document[appendTo] as HTMLElement).appendChild(script);

    return () => {
      (document[appendTo] as HTMLElement).removeChild(script);
    };
  }, [attributes, shouldLoad]);
};

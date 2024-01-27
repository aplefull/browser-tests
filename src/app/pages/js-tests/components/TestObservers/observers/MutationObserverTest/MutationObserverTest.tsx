import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import mutationObserverData from '@data/mutation-observer-data.json';
import { Button } from '@/app/components/Button/Button';
import { copy } from '@/utils/utils';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TNodeData = {
  nodeName: string;
  nodeValue: string | null;
};

type TMutationEntryData = {
  type: string;
  target: TNodeData | TNodeData[] | null;
  oldValue: string | null;
  addedNodes: TNodeData | TNodeData[] | null;
  nextSibling: TNodeData | TNodeData[] | null;
  removedNodes: TNodeData | TNodeData[] | null;
  attributeName: string | null;
  previousSibling: TNodeData | TNodeData[] | null;
  attributeNamespace: string | null;
};

type TMutationObserverResults = {
  status: 'success' | 'error';
  data?: {
    expected: TMutationEntryData[];
    actual: TMutationEntryData[];
  };
};

const getNodeData = (node: Node | NodeList | null): TNodeData[] | TNodeData | null => {
  if (!node) return null;

  if (node instanceof NodeList) {
    const array = [...node];
    if (array.length === 0) return null;

    return array.map((node) => {
      const nodeName = node.nodeName;
      const nodeValue = node.nodeValue;

      return {
        nodeName,
        nodeValue,
      };
    });
  }

  const nodeName = node.nodeName;
  const nodeValue = node.nodeValue;

  return {
    nodeName,
    nodeValue,
  };
};

const compareNodes = (node1: TNodeData | TNodeData[] | null, node2: TNodeData | TNodeData[] | null) => {
  if (!node1 && !node2) return true;
  if (!node1 && node2) return false;
  if (node1 && !node2) return false;

  if (Array.isArray(node1) && !Array.isArray(node2)) return false;
  if (!Array.isArray(node1) && Array.isArray(node2)) return false;

  if (Array.isArray(node1) && Array.isArray(node2)) {
    if (node1.length !== node2.length) return false;

    for (let i = 0; i < node1.length; i++) {
      const item1 = node1[i];
      const item2 = node2[i];

      if (item1.nodeName !== item2.nodeName) return false;
      if (item1.nodeValue !== item2.nodeValue) return false;
    }

    return true;
  }

  if (node1 && node2 && !Array.isArray(node1) && !Array.isArray(node2)) {
    if (node1.nodeName !== node2.nodeName) return false;
    if (node1.nodeValue !== node2.nodeValue) return false;
  }

  return true;
};

const compareArrays = (data1: TMutationEntryData[], data2: TMutationEntryData[]) => {
  if (data1.length !== data2.length) return false;

  for (let i = 0; i < data1.length; i++) {
    const item1 = data1[i];
    const item2 = data2[i];

    if (item1.type !== item2.type) return false;
    if (item1.oldValue !== item2.oldValue) return false;
    if (item1.attributeName !== item2.attributeName) return false;
    if (item1.attributeNamespace !== item2.attributeNamespace) return false;

    if (!compareNodes(item1.target, item2.target)) return false;
    if (!compareNodes(item1.addedNodes, item2.addedNodes)) return false;
    if (!compareNodes(item1.nextSibling, item2.nextSibling)) return false;
    if (!compareNodes(item1.removedNodes, item2.removedNodes)) return false;
    if (!compareNodes(item1.previousSibling, item2.previousSibling)) return false;
  }

  return true;
};

export const MutationObserverTest = () => {
  const [mutationObserverResults, setMutationObserverResults] = useState<TMutationObserverResults | null>(null);

  const mutationElementRef = useRef<HTMLDivElement>(null);
  const mutationObserverAllowRecordRef = useRef(false);

  const runMutations = () => {
    const element = mutationElementRef.current;
    if (!element) return;

    mutationObserverAllowRecordRef.current = true;

    document.documentElement.setAttribute('data-test', 'test');
    document.documentElement.removeAttribute('data-test');

    const div = document.createElement('div');
    div.textContent = 'Mutation';

    element.appendChild(div);
    div.textContent = 'Mutation 2';
    element.removeChild(div);

    element.setAttribute('data-test', 'test');
    element.removeAttribute('data-test');

    element.style.backgroundColor = 'red';
    element.style.backgroundColor = '';

    element.classList.add(styles.withPseudo);
    element.classList.remove(styles.withPseudo);

    element.style.setProperty('--test', 'test');
    element.style.removeProperty('--test');

    element.append('Mutation 3');
    element.prepend('Mutation 4');
    element.replaceChildren('Mutation 5');
    element.replaceChildren('Mutation 6', 'Mutation 7');

    element.innerHTML = '<div>Mutation 8</div>';

    const copy = element.cloneNode(true);
    element.appendChild(copy);

    element.innerHTML = '';
  };

  useEffect(() => {
    const onMutation = (entries: MutationRecord[]) => {
      if (!mutationObserverAllowRecordRef.current) return;

      const data: TMutationEntryData[] = entries.map((entry) => {
        return {
          type: entry.type,
          target: getNodeData(entry.target),
          oldValue: entry.oldValue,
          addedNodes: getNodeData(entry.addedNodes),
          nextSibling: getNodeData(entry.nextSibling),
          removedNodes: getNodeData(entry.removedNodes),
          attributeName: entry.attributeName,
          previousSibling: getNodeData(entry.previousSibling),
          attributeNamespace: entry.attributeNamespace,
        };
      });

      if (compareArrays(data, mutationObserverData)) {
        setMutationObserverResults({
          status: 'success',
          data: {
            expected: mutationObserverData,
            actual: data,
          },
        });
      } else {
        setMutationObserverResults({
          status: 'error',
          data: {
            expected: mutationObserverData,
            actual: data,
          },
        });
      }

      mutationObserverAllowRecordRef.current = false;
    };

    const mutationObserver = new MutationObserver(onMutation);

    mutationObserver.observe(document.getRootNode(), {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  const jsonSettings = {
    maxStringLength: 400,
    collapseLevel: 1,
  };

  return (
    <div className={styles.mutationObserver}>
      <Button text="Run mutations" onClick={runMutations} />
      <div ref={mutationElementRef} className={styles.mutationElement} />
      {mutationObserverResults && (
        <>
          <div className={styles.results}>
            {mutationObserverResults.status === 'success' && (
              <div className={styles.success}>All mutations detected correctly</div>
            )}

            {mutationObserverResults.status === 'error' && (
              <div className={styles.error}>
                <span>Mutation observer's results are not as expected. You can copy expected and actual results:</span>
                <div className={styles.buttons}>
                  <Button text="Copy expected results" onClick={() => copy(mutationObserverResults.data?.expected)} />
                  <Button text="Copy actual results" onClick={() => copy(mutationObserverResults.data?.actual)} />
                </div>
              </div>
            )}
          </div>
          <Json data={mutationObserverResults.data} settings={jsonSettings} />
        </>
      )}
    </div>
  );
};

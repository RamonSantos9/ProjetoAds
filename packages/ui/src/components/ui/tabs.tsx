'use client';

import * as React from 'react';
import { type ComponentProps } from 'react';
import * as Primitive from '@radix-ui/react-tabs';
import { mergeRefs } from '@/utils/merge-refs';

type ChangeListener = (v: string) => void;
const listeners = new Map<string, Set<ChangeListener>>();

export interface TabsProps extends ComponentProps<typeof Primitive.Tabs> {
  /**
   * Identifier for Sharing value of tabs
   */
  groupId?: string;

  /**
   * Enable persistent
   */
  persist?: boolean;

  /**
   * If true, updates the URL hash based on the tab's id
   */
  updateAnchor?: boolean;
}

const TabsContext = React.createContext<{
  valueToIdMap: Map<string, string>;
} | null>(null);

function useTabContext() {
  const ctx = React.use(TabsContext);
  if (!ctx) throw new Error('You must wrap your component in <Tabs>');
  return ctx;
}

export const TabsList = Primitive.TabsList;

export const TabsTrigger = Primitive.TabsTrigger;

export function Tabs({
  ref,
  groupId,
  persist = false,
  updateAnchor = false,
  defaultValue,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: TabsProps) {
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const valueToIdMap = React.useMemo(() => new Map<string, string>(), []);
  const [value, setValue] =
    _value === undefined
      ? // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
        React.useState(defaultValue)
      : // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
        [_value, React.useEffectEvent((v: string) => _onValueChange?.(v))];

  React.useLayoutEffect(() => {
    if (!groupId) return;
    let previous = sessionStorage.getItem(groupId);
    if (persist) previous ??= localStorage.getItem(groupId);
    if (previous) setValue(previous);

    const groupListeners = listeners.get(groupId) ?? new Set();
    groupListeners.add(setValue);
    listeners.set(groupId, groupListeners);
    return () => {
      groupListeners.delete(setValue);
    };
  }, [groupId, persist, setValue]);

  React.useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    for (const [value, id] of valueToIdMap.entries()) {
      if (id === hash) {
        setValue(value);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [setValue, valueToIdMap]);

  return (
    <Primitive.Tabs
      ref={mergeRefs(ref, tabsRef)}
      value={value}
      onValueChange={(v: string) => {
        if (updateAnchor) {
          const id = valueToIdMap.get(v);

          if (id) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }

        if (groupId) {
          const groupListeners = listeners.get(groupId);
          if (groupListeners) {
            for (const listener of groupListeners) listener(v);
          }

          sessionStorage.setItem(groupId, v);
          if (persist) localStorage.setItem(groupId, v);
        } else {
          setValue(v);
        }
      }}
      {...props}
    >
      <TabsContext
        value={React.useMemo(() => ({ valueToIdMap }), [valueToIdMap])}
      >
        {props.children}
      </TabsContext>
    </Primitive.Tabs>
  );
}

export function TabsContent({
  value,
  ...props
}: ComponentProps<typeof Primitive.TabsContent>) {
  const { valueToIdMap } = useTabContext();

  if (props.id) {
    valueToIdMap.set(value, props.id);
  }

  return (
    <Primitive.TabsContent value={value} {...props}>
      {props.children}
    </Primitive.TabsContent>
  );
}

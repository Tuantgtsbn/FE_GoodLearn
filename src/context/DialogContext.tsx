import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentType,
} from 'react';

type DialogWithClose<TResult = unknown> = {
  id?: string;
  onClose?: (result?: TResult) => void;
};

type DialogComponent<
  TResult = unknown,
  TProps extends Record<string, unknown> = Record<string, never>,
> = ComponentType<TProps & DialogWithClose<TResult>>;

type DialogContextType = {
  stack: IStack[];
  createDialog: (
    Component: DialogComponent,
    props?: Record<string, unknown>,
    mode?: ModeOpenDialog
  ) => Promise<unknown>;
  closeDialog: (id: string, result: unknown) => void;
  closeAll: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

type ModeOpenDialog = 'stack' | 'replace' | 'exclusive';

interface IStack {
  id: string;
  Component: DialogComponent;
  props: Record<string, unknown>;
  resolve: (value: unknown) => void;
}

export function DialogProvider({ children }) {
  const [stack, setStack] = useState<IStack[]>([]);

  const createDialog = useCallback((Component, props = {}, mode = 'stack') => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      setStack((prev) => {
        if (mode === 'exclusive') {
          prev.forEach((dialog) => dialog.resolve(undefined));
          return [
            {
              id,
              Component,
              props,
              resolve,
            },
          ];
        }
        if (mode === 'replace' && prev.length > 0) {
          const top = prev[prev.length - 1];
          top.resolve(undefined);
          return [...prev.slice(0, -1), { id, Component, props, resolve }];
        }
        return [...prev, { id, Component, props, resolve }];
      });
    });
  }, []);

  const closeDialog = useCallback((id, result) => {
    setStack((prev) => {
      const item = prev.find((dialog) => dialog.id === id);
      item?.resolve(result);
      return prev.filter((dialog) => dialog.id !== id);
    });
  }, []);

  useEffect(() => {
    return () => {
      // Khi Provider biến mất, hãy giải phóng tất cả các Promise đang chờ
      setStack((prev) => {
        prev.forEach((dialog) => dialog.resolve(undefined));
        return [];
      });
    };
  }, []);

  const closeAll = useCallback(() => {
    setStack((prev) => {
      prev.forEach((dialog) => dialog.resolve(undefined));
      return [];
    });
  }, []);

  return (
    <DialogContext.Provider
      value={{ stack, createDialog, closeDialog, closeAll }}
    >
      {children}
      <DialogRender stack={stack} closeDialog={closeDialog} />
    </DialogContext.Provider>
  );
}

function DialogRender({ stack, closeDialog }) {
  if (stack.length === 0) return null;
  return (
    <>
      {stack.map((item, index) => {
        const { id, Component, props } = item;
        const isTop = index === stack.length - 1;

        return (
          <div
            key={id}
            role="dialog"
            aria-modal="true"
            className={[
              'fixed inset-0 flex items-center justify-center transition-colors duration-200',
              isTop ? 'bg-black/50' : 'bg-transparent',
            ].join(' ')}
            style={{ zIndex: 1000 + index }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDialog(id, undefined);
            }}
          >
            <Component
              {...props}
              id={id}
              onClose={(result) => closeDialog(id, result)}
            />
          </div>
        );
      })}
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider');
  return ctx;
}

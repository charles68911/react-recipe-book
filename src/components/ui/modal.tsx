import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-stretch justify-center bg-emerald-950/50 backdrop-blur-sm lg:items-center lg:p-4" onClick={onClose}>
      <div className="flex h-full w-full flex-col bg-white text-emerald-950 lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-[24px] lg:shadow-[0_30px_80px_rgba(0,0,0,.25)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-emerald-900/10 px-6 py-4">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <Button variant="tertiary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

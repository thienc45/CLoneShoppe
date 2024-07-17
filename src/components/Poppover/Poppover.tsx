import { arrow, offset, shift, useFloating } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  renderPopover: React.ReactNode;
  className?: string;
}

export default function Popover({ children, className, renderPopover }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLElement>(null);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-end',
    middleware: [
      offset(10),
      shift(),
      arrow({
        element: arrowRef,
      }),],

  });

  const showPopover = () => setIsOpen(true);
  const hidePopover = () => setIsOpen(false);

  return (
    <div
      className={`relative ${className}`}
      ref={reference}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="relative z-10"
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            ref={floating}
          >
            <span
              ref={arrowRef}
              className="absolute border-x-transparent border-t-transparent border-b-white border-[11px]"
              style={{
                position: 'absolute',
                top: y ? `${y}px` : '0',
                left: x ? `${x}px` : '0',
                transform: 'translate(-50%, -100%)',
              }}
            />
            <div className="bg-white p-3 rounded shadow-lg">
              {renderPopover}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

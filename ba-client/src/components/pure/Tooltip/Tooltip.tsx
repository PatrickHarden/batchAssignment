import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  /**
   * Content to show inside the tooltip
   */
  content: string;
  /**
   * Side for tooltip to appear relative to the element
   * @default 'bottom'
   */
  side?: TooltipPrimitive.PopperContentProps['side'];
  /**
   * Duration before the tooltip opens
   * @default 150
   */
  delayDuration?: number;
  /**
   * The open state of the tooltip when it is ininitially rendered
   */
  defaultOpen?: boolean;
  /**
   * The controlled open state of the tooltip. Must be used in conjunction with {@link onOpenChange}
   */
  open?: boolean;
  /**
   * Event handler called when the open state of the tooltip changes
   * @param open open state of the tooltip
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Class name to pass along to trigger or `span` wrapper if disabled element
   */
  className?: string;
}

const Tooltip = ({
  content,
  side = 'bottom',
  delayDuration = 150,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children
}: React.PropsWithChildren<TooltipProps>) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>
          <TooltipTrigger className={className}>{children}</TooltipTrigger>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className={styles.tooltipContent} side={side} sideOffset={10}>
            {content}
            <TooltipPrimitive.Arrow className={styles.tooltipArrow} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<Pick<TooltipProps, 'className'>>
>(({ children, className, ...props }, ref) => {
  if (React.isValidElement<React.ComponentProps<'input'>>(children)) {
    // assert only one child
    const child = React.Children.only(children);

    // if child is a disabled element, we need to wrap it around a span and give it `pointer-events: none` style
    // https://www.radix-ui.com/docs/primitives/components/tooltip#displaying-a-tooltip-from-a-disabled-button
    if (child.props.disabled) {
      const originalStyles = child.props.style ?? {};
      const clonedChild = React.cloneElement(child, {
        style: { ...originalStyles, pointerEvents: 'none' }
      });
      return React.createElement(
        'span',
        {
          ref,
          ...props,
          tabIndex: 0,
          'data-testid': 'tooltip-disabled-element-wrapper',
          className
        },
        clonedChild
      );
    }

    return React.cloneElement(child, { ref, ...props, className });
  }

  throw new TypeError('Invalid children used in TooltipTrigger');
});

TooltipTrigger.displayName = 'TooltipTrigger';

export default Tooltip;

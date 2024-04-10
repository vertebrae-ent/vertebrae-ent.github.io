import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';

@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class AppTooltipDirective {
  @Input() tooltip?: string;
  @Input() tooltipPos: 'top' | 'bottom' = 'top';

  el = inject(ElementRef);

  getOrCreateTooltipElement() {
    let tooltipEl = document.body.querySelector('#tooltip') as HTMLElement;
    if (!tooltipEl) {
      tooltipEl = document.createElement('div') as HTMLElement;
      tooltipEl.setAttribute('id', 'tooltip');
      tooltipEl.style.left = '-99999px';
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  @HostListener('mouseenter') showTooltip() {
    if (this.tooltip) {
      const tooltip = this.getOrCreateTooltipElement();

      // Set the tooltip content
      tooltip.innerHTML = this.tooltip;
      // Show the tooltip
      tooltip.classList.add('show');
      tooltip.classList.remove('top', 'bottom');
      tooltip.classList.add(this.tooltipPos);
      requestAnimationFrame(() => {
        const tRect = tooltip.getBoundingClientRect();

        // Position the tooltip relative to the parent element
        const elRect = this.el.nativeElement.getBoundingClientRect();
        if (this.tooltipPos === 'top') {
          tooltip.style.top = `${
            window.scrollY + elRect.top - tRect.height - 10
          }px`;
        } else {
          tooltip.style.top = `${window.scrollY + elRect.bottom + 10}px`;
        }
        tooltip.style.left = `${
          elRect.left + elRect.width / 2 - tRect.width / 2
        }px`;
      });
    }
  }

  @HostListener('mouseleave') hideTooltip() {
    const tooltip = this.getOrCreateTooltipElement();
    tooltip.innerHTML = '';
    tooltip.style.left = '-99999px';
    tooltip.classList.remove('show');
  }
}

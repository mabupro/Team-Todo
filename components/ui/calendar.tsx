'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateFormatter, DayPicker } from 'react-day-picker';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import { useResponsiveMonths } from '@/hooks/useResponsiveMonths';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const numberOfMonths = useResponsiveMonths();

  const formatCaption: DateFormatter = (date, options) => {
    const y = format(date, 'yyyy');
    const m = format(date, 'MM', { locale: options?.locale });
    return `${y}年${m}月`;
  };

  return (
    <DayPicker
      locale={ja}
      weekStartsOn={1}
      numberOfMonths={numberOfMonths}
      // disabled={{ dayOfWeek: [0, 6] }}
      formatters={{ formatCaption }}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:z-20',
          // 選択された日（無効日以外）に背景色
          '[&:has([aria-selected])]:bg-accent',
          '[&:has([aria-selected].day-range-start)]:rounded-l-md',
          '[&:has([aria-selected].day-range-end)]:rounded-r-md',
          // 無効日のセルは常に背景を透明に
          '[&:has([aria-disabled])]:bg-transparent',
        ),
        // 日付ボタン本体
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal disabled:pointer-events-none',
        ),
        day_range_start:
          'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        day_range_end:
          'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('size-6', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('size-6', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };

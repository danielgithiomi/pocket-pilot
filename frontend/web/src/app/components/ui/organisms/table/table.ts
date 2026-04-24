import { NgClass, CommonModule } from '@angular/common';
import { TableColumn, TableAlign } from './table.types';
import { Trash2, LucideAngularModule } from 'lucide-angular';
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'organism-table',
  styleUrl: './table.css',
  templateUrl: './table.html',
  imports: [CommonModule, LucideAngularModule, NgClass],
})
export class Table<T extends object> {
  /* INPUTS */
  id = input.required<string>();
  data = input.required<T[]>();
  isLoading = input<boolean>(true);
  columns = input.required<TableColumn<T>[]>();
  emptyMessage = input<string>('No data available');

  /* OUTPUTS */
  deleteRow = output<T>();

  /* ICONS */
  readonly Trash2 = Trash2;
  readonly iconSize = 18;

  /* COMPUTED */
  gridTemplateColumns = computed<string>(() => {
    return this.columns()
      .map((col) => col.width || '1fr')
      .join(' ');
  });

  columnCount = computed<number>(() => this.columns().length);

  /* METHODS */
  handleDelete(item: T) {
    this.deleteRow.emit(item);
  }

  getCellAlignment(align?: TableAlign): string {
    return align || 'left';
  }

  getCellValue(item: T, column: TableColumn<T>): string | HTMLElement {
    if (column.cellTemplate) return column.cellTemplate(item);

    const value = item[column.key as keyof T];
    return value !== undefined && value !== null ? String(value) : '';
  }

  isActionsColumn(column: TableColumn<T>): boolean {
    return column.key === 'actions';
  }

  shouldRenderAsHtml(item: T, column: TableColumn<T>): boolean {
    if (column.cellTemplate) return true;

    const value = item[column.key as keyof T];
    return typeof value === 'string' && (value.includes('<div') || value.includes('<span'));
  }
}

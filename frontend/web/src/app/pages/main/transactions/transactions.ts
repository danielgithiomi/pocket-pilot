import { Component, signal } from '@angular/core';
import { Button } from '@components/ui/atoms/button';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import { Form } from "@components/structural/main/form/form";

@Component({
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
  imports: [Button, LucideAngularModule, NoData, Form],
})
export class Transactions {
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  protected isFormOpen = signal<boolean>(false);
}

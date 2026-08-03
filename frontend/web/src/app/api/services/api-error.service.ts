import { ToastService } from '@atoms/toast';
import { IStandardError } from '@shared/types';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiServiceError {
    private readonly toastService = inject(ToastService);

    renderToast(error: IStandardError) {
        const { title, details } = error;
        this.toastService.show({
            title,
            details: details as string,
            variant: 'error'
        });
    }
}

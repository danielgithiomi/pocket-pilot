import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { ExchangeRatesSnapshot, IStandardResponse } from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRatesResource {
    readonly getExchangeRatesSnapshot = httpResource<IStandardResponse<ExchangeRatesSnapshot>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.exchange_rates),
    }));
}

import { inject, Injectable } from "@angular/core";
import { PreferencesMutation } from "@methods/mutations";

@Injectable({
    providedIn: 'root'
})
export class PreferencesService {

    private readonly mutation = inject(PreferencesMutation);

    
    
}
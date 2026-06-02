import { Country } from '@global/types';
import { NgClass } from '@angular/common';
import { FieldTree } from '@angular/forms/signals';
import { PhoneNumberStatus } from './phone-number.types';
import { COUNTRIES, DEFAULT_COUNTRY_ISO } from '@global/constants';
import { Component, computed, HostListener, input, output, signal } from '@angular/core';
import { Check, ChevronDown, ChevronUp, LucideAngularModule, Search, X } from 'lucide-angular';
import {
    isoToFlag,
    filterCountries,
    findCountryByIso,
    buildFullPhoneNumber,
} from './phone-number.utils';

@Component({
    selector: 'atom-phone-number',
    styleUrl: './phone-number.css',
    templateUrl: './phone-number.html',
    imports: [NgClass, LucideAngularModule],
})
export class PhoneNumber {
    /* INPUTS */
    id = input.required<string>();
    required = input<boolean>(true);
    label = input.required<string>();
    placeholder = input.required<string>();
    defaultCountryIso = input.required<string>();

    inverted = input<boolean>(false);
    invertLabel = input<boolean>(false);
    invertedIcon = input<boolean>(false);
    enableHoverScale = input<boolean>(false);

    inputClassName = input<string>('');
    wrapperClassName = input<string>('');

    showStatus = input<boolean>(false);
    status = input<PhoneNumberStatus>('error');

    formField = input.required<FieldTree<string, string>>();

    /* OUTPUTS */
    clearOutput = output<void>();

    /* ICONS */
    readonly X = X;
    readonly iconSize = 18;
    readonly Check = Check;
    readonly Search = Search;
    readonly ChevronUp = ChevronUp;
    readonly ChevronDown = ChevronDown;
    protected readonly isoToFlag = isoToFlag;

    /* SIGNALS */
    protected readonly countries = COUNTRIES;
    protected readonly hasBlurred = signal(false);
    protected readonly nationalNumber = signal('');
    protected readonly isDropdownOpen = signal(false);
    protected readonly countrySearchQuery = signal('');
    protected readonly selectedCountry = signal<Country>(findCountryByIso(DEFAULT_COUNTRY_ISO));

    /* COMPUTED */
    fieldState = computed(() => this.formField()());
    inputId = computed<string>(() => `phone-number-field-${this.id()}`);
    selectedCountryFlag = computed(() => isoToFlag(this.selectedCountry().iso));

    filteredCountries = computed(() => filterCountries(this.countries, this.countrySearchQuery()));

    showClearIcon = computed(() => this.nationalNumber().length > 0);

    customContainerClasses = computed<string>(() => {
        if (!this.showStatus()) return this.inputClassName();

        const statusBorderClasses =
            this.status() === 'error'
                ? 'phone-number-container-error'
                : 'phone-number-container-success';

        return [statusBorderClasses, this.inputClassName()].filter(Boolean).join(' ');
    });

    showErrors = computed(
        () => this.fieldState().invalid() && (this.fieldState().touched() || this.hasBlurred()),
    );

    /* METHODS */
    toggleDropdown(event: Event) {
        event.stopPropagation();
        this.isDropdownOpen.update((open) => !open);

        if (this.isDropdownOpen()) {
            this.countrySearchQuery.set('');
        }
    }

    closeDropdown() {
        this.isDropdownOpen.set(false);
        this.countrySearchQuery.set('');
    }

    selectCountry(country: Country) {
        this.selectedCountry.set(country);
        this.syncFormValue();
        this.closeDropdown();
    }

    onPhoneInput(event: Event) {
        const value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
        this.nationalNumber.set(value);
        this.syncFormValue();
    }

    onPhoneBlur() {
        this.hasBlurred.set(true);
    }

    onSearchInput(event: Event) {
        this.countrySearchQuery.set((event.target as HTMLInputElement).value);
    }

    onSearchClick(event: Event) {
        event.stopPropagation();
    }

    onDropdownClick(event: Event) {
        event.stopPropagation();
    }

    onClear(event: Event) {
        event.stopPropagation();
        this.nationalNumber.set('');
        this.syncFormValue();
        this.clearOutput.emit();
    }

    isCountrySelected(country: Country): boolean {
        return this.selectedCountry().iso === country.iso;
    }

    @HostListener('document:click')
    onDocumentClick() {
        this.closeDropdown();
    }

    private syncFormValue() {
        const fullNumber = buildFullPhoneNumber(this.selectedCountry(), this.nationalNumber());

        this.formField()().controlValue.set(fullNumber);
    }
}

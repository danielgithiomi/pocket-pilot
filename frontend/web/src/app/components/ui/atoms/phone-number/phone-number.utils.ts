import { Country } from '@global/types';
import { COUNTRIES, COUNTRIES_BY_DIAL_CODE, DEFAULT_COUNTRY_ISO } from '@global/constants';

export function isoToFlag(iso: string): string {
    const code = iso.toUpperCase();
    if (code.length !== 2) return '';

    return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function findCountryByIso(iso: string): Country {
    const country = COUNTRIES.find((entry) => entry.iso === iso);
    if (country) return country;

    return COUNTRIES.find((entry) => entry.iso === DEFAULT_COUNTRY_ISO) ?? COUNTRIES[0];
}

export function parsePhoneNumber(
    value: string,
    fallbackIso: string = DEFAULT_COUNTRY_ISO
): { country: Country; nationalNumber: string } {
    const fallbackCountry = findCountryByIso(fallbackIso);

    if (!value) {
        return { country: fallbackCountry, nationalNumber: '' };
    }

    if (value.startsWith('+')) {
        const digits = value.slice(1).replace(/\D/g, '');

        for (const country of COUNTRIES_BY_DIAL_CODE) {
            if (digits.startsWith(country.dialCode)) {
                return {
                    country,
                    nationalNumber: digits.slice(country.dialCode.length)
                };
            }
        }

        return { country: fallbackCountry, nationalNumber: digits };
    }

    return {
        country: fallbackCountry,
        nationalNumber: value.replace(/\D/g, '')
    };
}

export function buildFullPhoneNumber(country: Country, nationalNumber: string): string {
    const digits = nationalNumber.replace(/\D/g, '');
    if (!digits) return '';

    return `+${country.dialCode}${digits}`;
}

export function getNationalNumberDigits(value: string, fallbackIso: string = DEFAULT_COUNTRY_ISO): string {
    return parsePhoneNumber(value, fallbackIso).nationalNumber;
}

export function filterCountries(countries: Country[], query: string): Country[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return countries;

    return countries.filter((country) => {
        const searchable = `${country.name} ${country.iso} +${country.dialCode} ${country.dialCode}`.toLowerCase();
        return searchable.includes(normalizedQuery);
    });
}

export interface FormattedPhoneNumber {
    flag: string;
    dialCode: string;
    countryName: string;
    nationalNumber: string;
}

export function formatPhoneNumberForDisplay(value: string | null | undefined): FormattedPhoneNumber | null {
    if (!value) return null;

    const { country, nationalNumber } = parsePhoneNumber(value);

    if (!nationalNumber) return null;

    return {
        flag: isoToFlag(country.iso),
        dialCode: `+${country.dialCode}`,
        countryName: country.name,
        nationalNumber
    };
}

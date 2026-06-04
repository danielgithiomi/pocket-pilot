import { animate, state, style, transition, trigger } from '@angular/animations';

export const accordionContentAnimation = trigger('accordionContent', [
    state(
        'collapsed',
        style({
            height: '0px',
            opacity: 0,
            overflow: 'hidden',
        }),
    ),
    state(
        'expanded',
        style({
            height: '*',
            opacity: 1,
            overflow: 'hidden',
        }),
    ),
    transition('collapsed => expanded', animate('220ms cubic-bezier(0.22, 1, 0.36, 1)')),
    transition('expanded => collapsed', animate('200ms ease-in')),
]);

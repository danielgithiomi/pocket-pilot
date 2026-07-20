import { NgClass } from '@angular/common';
import { hashFromName } from '@libs/utils';
import { Component, computed, input } from '@angular/core';
import { AvatarClasses, AvatarSize, COLOR_PALETTE, AVATAR_SIZE_MAP, INITIALS_TEXT_MAP } from './avatar.types';

@Component({
    selector: 'atom-avatar',
    imports: [NgClass],
    template: `
        <div
            class="rounded-full grid place-items-center shrink-0"
            [ngClass]="[avatarClasses().background, avatarClasses().avatarSize]">
            <p class="font-semibold" [ngClass]="[avatarClasses().foreground, avatarClasses().initialsSize]">
                {{ displayInitials() }}
            </p>
        </div>
    `
})
export class Avatar {
    // INPUTS
    readonly displayName = input.required<string>();
    readonly numberOfInitials = input.required<1 | 2>();
    readonly avatarSize = input<AvatarSize>('md', { alias: 'size' });

    // COMPUTED
    protected readonly avatarClasses = computed<AvatarClasses>(() => {
        const { bg, fg } = COLOR_PALETTE[Math.abs(hashFromName(this.displayName())) % COLOR_PALETTE.length];

        return {
            background: bg,
            foreground: fg,
            avatarSize: AVATAR_SIZE_MAP[this.avatarSize()],
            initialsSize: INITIALS_TEXT_MAP[this.avatarSize()]
        };
    });

    protected readonly displayInitials = computed<string>(() => {
        if (this.numberOfInitials() === 1) return this.displayName().slice(0, 1).toUpperCase();

        // 2 Initials
        const parts = this.displayName().split(' ');

        if (parts.length === 1) {
            const firstLetter = this.displayName().slice(0, 1).toUpperCase();
            const secondLetter = this.displayName().slice(1, 2).toUpperCase();
            return firstLetter + secondLetter;
        } else
            return this.displayName()
                .split(' ')
                .map(name => name.slice(0, 1).toUpperCase())
                .join('');
    });
}

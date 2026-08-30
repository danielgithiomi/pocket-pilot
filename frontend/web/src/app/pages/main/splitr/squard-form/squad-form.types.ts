import { SplitrSquadPayload } from '@shared/types';
import { maxLength, minLength, required, schema } from '@angular/forms/signals';

export type squadSchema = SplitrSquadPayload;

export const initialCreateSquadData: squadSchema = {
    squadName: '',
    squadMembers: []
};

export const squadValidationSchema = schema<squadSchema>((root) => {
    // Squad Name
    required(root.squadName, { message: 'The squad name is required field!' });
    minLength(root.squadName, 3, { message: 'The squad name must be at least 3 characters long!' });
    maxLength(root.squadName, 25, {
        message: 'The squad name must be at most 25 characters long!'
    });

    // Squad Members
    required(root.squadMembers, { message: 'The squad members are required field!' });
});

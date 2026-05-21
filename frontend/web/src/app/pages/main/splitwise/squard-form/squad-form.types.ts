import { maxLength, minLength, required, schema } from '@angular/forms/signals';

export interface CreateSquadSchema {
    squadName: string;
    squadMembers: string[];
}

export interface UpdateSquadSchema extends CreateSquadSchema {
    squadImageKey: string;
}

export const initialCreateSquadData: CreateSquadSchema = {
    squadName: '',
    squadMembers: [],
};

export const createSquadValidationSchema = schema<CreateSquadSchema>((root) => {
    // Squad Name
    required(root.squadName, { message: 'The squad name is required field!' });
    minLength(root.squadName, 3, { message: 'The squad name must be at least 3 characters long!' });
    maxLength(root.squadName, 25, {
        message: 'The squad name must be at most 25 characters long!',
    });

    // Squad Members
    required(root.squadMembers, { message: 'The squad members are required field!' });
});

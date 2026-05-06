import { required, schema } from '@angular/forms/signals';

export interface CreateSquadSchema {
  squadName: string;
  squadMembers: string[];
}

export const initialCreateSquadData: CreateSquadSchema = {
  squadName: '',
  squadMembers: [],
};

export const createSquadValidationSchema = schema<CreateSquadSchema>((root) => {
  // Squad Name
  required(root.squadName, { message: 'The squad name is required field!' });

  // Squad Members
  required(root.squadMembers, { message: 'The squad members are required field!' });
});

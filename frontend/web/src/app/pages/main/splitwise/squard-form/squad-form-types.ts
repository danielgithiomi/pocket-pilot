import { required, schema } from '@angular/forms/signals';

export interface CreateSquadSchema {
  squadName: string;
  squadMembers: string[];
}

export const InitialCreateSquadData: CreateSquadSchema = {
  squadName: '',
  squadMembers: [],
};

export const CreateSquadValidationSchema = schema<CreateSquadSchema>((root) => {
  // Squad Name
  required(root.squadName, { message: 'The squad name is required field!' });

  // Squad Members
  required(root.squadMembers, { message: 'The squad members are required field!' });
});

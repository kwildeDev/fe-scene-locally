import { z } from 'zod';
import { organisationEventSchema } from '../validation/organisationEventSchema';

export type Formfields = z.infer<typeof organisationEventSchema>;
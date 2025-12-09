import { z } from "zod";

const capitaliseFirstCharacter = (
    name: string | undefined
): string | undefined => {
    if (!name) {
        return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const organisationEventSchema = z.object({
        title: z
            .string()
            .min(3, { message: 'Title is required' })
            .transform((value) => capitaliseFirstCharacter(value) || '')
            .refine((value) => (value ?? '').trim() !== '', {
                message: 'Title cannot be empty',
            }),
        description: z
            .string()
            .min(20, { message: 'Description is required' })
            .transform((value) => capitaliseFirstCharacter(value) || '')
            .refine((value) => value.trim() !== '', {
                message: 'Description cannot be empty',
            }),
        startDate: z
            .string()
            .min(1, { message: 'Start date is required' })
            .refine(
                (date) => {
                    const inputDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return inputDate >= today;
                },
                {
                    message: 'Start date must be today or in the future',
                }
            ),
        startTime: z.string().min(1, { message: 'Start time is required' }),
        endDate: z
            .string()
            .min(1, { message: 'End date is required' })
            .refine(
                (date) => {
                    const inputDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return inputDate >= today;
                },
                {
                    message: 'End date must be today or in the future',
                }
            ),
        endTime: z.string().min(1, { message: 'End time is required' }),
        venue: z.number()
            .int()
            .min(1, { message: 'Venue is required' }),
        isOnline: z.boolean(),
        accessLink: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || z.string().url().safeParse(value).success,
                {
                    message: 'Invalid URL',
                }
            ),
        category: z.number()
            .int()
            .min(1, { message: 'Category is required' }),
        subcategory: z.number()
            .int()
            .min(1, { message: 'Subcategory is required' }),
        selectedTags: z.array(z.string().toLowerCase()).optional(),
        isRecurring: z.boolean(),
        recurringFrequency: z.string().optional(),
        recurringDay: z.string().optional(),
        imageUrl: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || z.string().url().safeParse(value).success,
                {
                    message: 'Invalid URL',
                }
            ),
        signupRequired: z.boolean(),
    })
    .refine(
        (values) => {
            const startDateTime = new Date(
                `${values.startDate}T${values.startTime}`
            );
            const endDateTime = new Date(`${values.endDate}T${values.endTime}`);
            return endDateTime > startDateTime;
        },
        {
            message: `End time must be after start time`,
            path: ['endTime'],
        }
    )
    .refine(
        (values) => {
            if (values.isRecurring) {
                return !!values.recurringFrequency && !!values.recurringDay;
            }
            return true;
        },
        {
            message: 'Recurring frequency and day are required for recurring events',
            path: ['recurringDay'],
        }
    );

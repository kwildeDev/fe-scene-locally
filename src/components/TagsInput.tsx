import React from 'react';
import {
    UseFormRegister,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
    FieldErrors,
} from 'react-hook-form';
import { Wrap, WrapItem, Text } from '@chakra-ui/react';
import CreatableSelect from 'react-select/creatable';
import type {
    CSSObjectWithLabel,
    MultiValue,
    StylesConfig,
} from 'react-select';
import { EventFormField } from './EventFormField';
import { Formfields } from '../types/forms';

interface TagsInputProps {
    register: UseFormRegister<Formfields>;
    errors: FieldErrors<Formfields>;
    isDisabled: boolean;
    isPublished: boolean;
    tagsList: string[];
    selectedTags: string[];
    isLoadingTags: boolean;
    tagsError: boolean;
    setValue: UseFormSetValue<Formfields>;
    getValues: UseFormGetValues<Formfields>;
    trigger: UseFormTrigger<Formfields>;
}

export const TagsInput: React.FC<TagsInputProps> = ({
    errors,
    isDisabled,
    isPublished,
    tagsList,
    selectedTags,
    isLoadingTags,
    tagsError,
    setValue,
    trigger,
}) => {
    const tagOptions = React.useMemo(
        () => tagsList.map((tag) => ({ value: tag, label: tag })),
        [tagsList]
    );

    const handleReactSelectChange = (
        newValue: MultiValue<{ value: string; label: string }>
    ) => {
        const tags = newValue.map(
            (option: { value: string; label: string }) => option.value
        );
        setValue('selectedTags', tags, { shouldDirty: true });
        trigger('selectedTags');
    };
    const handleCreateTag = (newTag: string) => {
        const newTags = [...selectedTags, newTag];
        setValue('selectedTags', newTags, { shouldDirty: true });
        trigger('selectedTags');
    };

    const styles: StylesConfig<{ value: string; label: string }, true> = {
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#116932',
            borderRadius: '6px',
            marginRight: '8px',
            marginTop: '6px',
            marginBottom: '6px',
            ':hover': {
                backgroundColor: '#124a28',
                color: 'white',
            },
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: 'white',
            fontSize: '0.875rem',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            ':hover': {
                backgroundColor: '#116932',
                color: 'white',
            },
        }),
        placeholder: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: '#27272a',
        }),
        dropdownIndicator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: '#27272a',
        }),
        clearIndicator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: '#27272a',
        }),
    };

    return (
        <Wrap mt={4} width="calc(100% - 2rem)">
            <WrapItem display="block" flex="1">
                <EventFormField
                    label="Select or Create Tags"
                    error={
                        Array.isArray(errors.selectedTags)
                            ? errors.selectedTags[0]
                            : errors.selectedTags
                    }
                    htmlFor="tags"
                    focusWarningMessage="This event is already published. Changing tags may affect how attendees find it and understand its purpose."
                    shouldWarn={isPublished}
                >
                    <div>
                        {tagsError && (
                            <Text color="fg.error">
                                Tags could not be loaded. You may need to add
                                them manually.
                            </Text>
                        )}
                        <CreatableSelect
                            inputId="tags"
                            isMulti
                            options={tagOptions}
                            value={selectedTags.map((tag) => ({
                                value: tag,
                                label: tag,
                            }))}
                            onChange={handleReactSelectChange}
                            styles={styles}
                            isDisabled={isDisabled}
                            isLoading={isLoadingTags}
                            placeholder="Select or type a tag"
                            isClearable
                            onCreateOption={handleCreateTag}
                        />
                    </div>
                </EventFormField>
            </WrapItem>
        </Wrap>
    );
};

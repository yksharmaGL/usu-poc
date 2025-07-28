'use client'
import { FormBuilder } from "@formio/react";
import { getFormById } from "@src/services/form-services/formServices";
import { useQuery } from "@tanstack/react-query";
import 'formiojs/dist/formio.full.min.css';

interface FormEditProps {
    params: {
        formId: string;
    };
}

export default function FormEdit({ params }: FormEditProps) {
    console.log("params", params)
    const FormBuilderComponent: any = FormBuilder;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["form", params.formId],
        queryFn: async ({ signal }) => {
            return await getFormById({
                signal,
                selectedFormId: params.formId,
            });
        },
    });

    let content;
    if (isLoading) {
        content = <div>Loading...</div>;
    } else if (isError) {
        content = <div>Error: {error instanceof Error ? error.message : "Something went wrong"}</div>;
    } else if (data?.form_data) {
        const form = {
            components: data?.form_data.components || [],
        };

        content = <FormBuilderComponent initialForm={form} />;
    }

    return <div className="p-6">{content}</div>;
}

'use client'
import { useQuery } from '@tanstack/react-query'
import classes from "./page.module.css";
import { getAllForm } from '@src/services/form-services/formServices';
import FormList from '@src/global-components/form-list/formList';

export default function RendeSubmittedFormsPage() {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['form'],
        queryFn: getAllForm
    })

    let content;
    if (isLoading) {
        content = <div>Loading...</div>
    }
    if (isError) {
        content = <div>Error: {error.message || "Something went wrong please try again later."}</div>
    }

    if (data) {
        content = <>
            <h2 className={classes.heading}>Submitted Forms</h2>
            <div className={classes.list}>
                {data?.map((item: any) => <FormList {...item} />)}
            </div>
        </>
    }

    return (
        <div className={classes.container}>
            {content}
        </div>
    )
}

import { useState } from "react";
import classes from "./formList.module.css";
import { useQuery } from "@tanstack/react-query";
import { getFormById, getFormSubmittedById } from "@/src/services/services";
import { Form } from "@formio/react";
import Modal from "react-modal";

export default function FormList({ id }: any) {
    const FormRenderer: any = Form;

    const [selectedFormId, setSelectedFormId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["form", selectedFormId],
        queryFn: async ({ signal }) => {
            const formSubmittedData = await getFormSubmittedById({ signal, selectedFormId });
            const formCreatedData = await getFormById({ signal, selectedFormId });

            formCreatedData?.form_data?.components?.forEach((component: any) => {
                if (formSubmittedData?.form_data[component?.key]) {
                    component.defaultValue = formSubmittedData?.form_data[component?.key];
                }
            })
            return formCreatedData;
        },
        enabled: !!selectedFormId
    })

    let content;
    if (isLoading) {
        content = <div>Loading...</div>
    }

    if (isError) {
        content = <div>Error: {error.message || "Something went wrong"}</div>
    }

    const openModal = (id: any) => {
        setSelectedFormId(id); 
        setIsModalOpen(true);  
    };

    const closeModal = () => {
        setIsModalOpen(false); 
        setSelectedFormId(null); 
    };

    if (data) {
        const formJSON = typeof data.form_data === 'string' ? JSON.parse(data.form_data) : data.form_data;
        content = <FormRenderer
            className={classes.formRenderer}
            form={formJSON}
            onSubmit={(submission: any) => {
            }}
            src={""}
        />
    }

    return (
        <>
            <div className={classes.formCard}>
                <div className={classes.formHeader}>{`Form ${id}`}</div>
                <button className={classes.viewButton} onClick={() => openModal(id)}>View</button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Form Modal" 
                className={classes.modalContent}  
                overlayClassName={classes.modalOverlay} 
                ariaHideApp={false} 
            >
                <button className={classes.modalClose} onClick={closeModal}>&times;</button>

                <h2>Form Submitted data</h2>
                <div className={classes.modalContent}>
                {content}
                </div>
            </Modal>

            
        </>
    )
}

'use server'

import {createWorkflow, editWorkflow, getWorkflowsByUserId, publishWorkflow,  deleteWorkflow, getEventsById, 
    getActiveWorkflowsByUserId, getWorkflowById,
    deleteTrigger,
    deleteAction,
    getActionTypes,
    getTriggerTypes,
    createTrigger,
    createAction
} from '@repo/prisma-db/repo/workflow';
import {logger} from '@repo/winston-logger/index';
import { metadata } from '../../app/layout';

export const createWorkflowAction = async ({name,description,userId}:any) => {
    try{
        const workflow = await createWorkflow({name,description,userId});
        return {success: "Workflow created successfully", result: workflow}
    }
    catch (error) {
        return {error: "Workflow creation failed"}
    }

}

export const getWorkflows = async (userId:string) => {
    const workflows = await getWorkflowsByUserId(userId);
    return workflows;
}

export const editFlow = async (workflowId:string, name:string, description: string) => {
    logger.info('Editing workflow',workflowId, name, description);
    const workflow = await editWorkflow(workflowId,name,description);
    return workflow;
}

export const publishFlow = async (workflowId:string, state:boolean) => {
    try{
        await publishWorkflow(workflowId,state);
        return {success: "Workflow published/unpublished successfully"}
    }
    catch (error) {
        return {error: "Workflow published/unpublished successfully"}
    }
}

export const deleteFlow= async (workflowId:string) => {
    try{
        await deleteWorkflow(workflowId); 
        return {success: "Workflow deleted successfully"}
    }
    catch (error) {
        return {error: "Workflow not deleted successfully"}
    }
 
}


export const getEventsByWorkflowId = async (workflowId:string) => {
    const events:any = await getEventsById(workflowId);
    return events;
}

export const getActiveWorkflows = async (userId:string) => {
    const workflows = await getActiveWorkflowsByUserId(userId);
    return workflows;
}

export const getWorkflow = async (workflowId:string) => {
    const workflow = await getWorkflowById(workflowId);
    return workflow;
}

export const deleteTriggerAction = async (id:string) => {
    try{
        await deleteTrigger(id);
        return {success: "Trigger deleted successfully"}
    }
    catch (error) {
        return {error: "Trigger not deleted successfully"}
    }
}


export const deleteActionAction = async (id:string) => {
    try{
        await deleteAction(id);
        return {success: "Action deleted successfully"}
    }
    catch (error) {
        return {error: "Action not deleted successfully"}
    }
}

export const getActionTypesAction = async () => {
    const actionTypes = await getActionTypes();
    return actionTypes;
}

export const getTriggerTypesAction = async () => {
    const triggerTypes = await getTriggerTypes();
    return triggerTypes;
}

export const createTriggerAction = async({workflowId, triggerId, metadata}:any) => {
    try{
        const trigger = await createTrigger({workflowId, triggerId, metadata});
        return {success: "Trigger created successfully", result: trigger}
    }
    catch (error) {
        return {error: "Trigger creation failed"}
    }
}

export const createActionAction = async({workflowId, actionId, metadata,sortingOrder}:any) => {
    try{
        const action = await createAction({workflowId, actionId, metadata,sortingOrder});
        return {success: "Action created successfully", result: action}
    }
    catch (error) {
        return {error: "Action creation failed"}
    }

}
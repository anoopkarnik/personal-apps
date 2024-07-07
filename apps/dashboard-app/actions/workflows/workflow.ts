'use server'

import {createWorkflow, editWorkflow, getNodesByWorkflowId, getWorkflowsByUserId, publishWorkflow, createNode, editNode, deleteNode} from '@repo/prisma-db/repo/workflow';

export const createWorkflowAction = async ({name,description,userId}:any) => {
    console.log('Creating workflow',name,description,userId);
    const workflow = await createWorkflow({name,description,userId});
    return workflow;
}

export const getWorkflows = async (userId:string) => {
    const workflows = await getWorkflowsByUserId(userId);
    return workflows;
}

export const editFlow = async (workflowId:string, name:string, description: string) => {
    console.log('Editing workflow',workflowId, name, description);
    const workflow = await editWorkflow(workflowId,name,description);
    return workflow;
}

export const publishFlow = async (workflowId:string, state:boolean) => {
    console.log('Publishing workflow',workflowId,state);
    await publishWorkflow(workflowId,state);  
}

export const getNodes = async (workflowId:string) => {
    const workflow = await getNodesByWorkflowId(workflowId);
    const name = workflow?.name || 'Untitled';
    const nodes = workflow?.nodes;
    const description = workflow?.description || '';
    const publish = workflow?.publish || false;
    let trigger = undefined
    let actions:any = [];
    if (name && nodes) {
        trigger = nodes.find((node:any) => node.type === 'Trigger');
        actions = nodes.filter((node:any) => node.type === 'Action');
    }

    return {name,description,publish,trigger,actions};
}

export const addNodeToWorkflow = async ({name,description,workflowId,type,userId,actionType,subActionType,actionData}:any) => {
    const node:any = await createNode({name,description,workflowId,type,userId,actionType,subActionType,actionData});
    return node;
}

export const editNodeInWorkflow = async ({id,name,description,workflowId,type,userId,actionType,subActionType,actionData}:any) => {
    const node:any = await editNode({id,name,description,workflowId,type,userId,actionType,subActionType,actionData});
    return node;
}

export const deleteNodeInWorkflow = async (id:string) => {
    await deleteNode(id);
    return 'Node deleted';
}
import { Client } from '@notionhq/client';
import { logger } from '@repo/winston-logger/index';
import { queryDatabase, createPage, modifyPage, createDatabase, getPage, getBlockChildren, deleteBlock, appendBlockChildren } from './index'; // Adjust the import path accordingly

const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const queryNotionDatabase = async ({database_id, filters, sorts = []}:any):Promise<any> => {
    let has_more = true;
    let cursor = null;
    let results = [];

    while (has_more) {
        let body = await constructFilterBody(filters, cursor);
        body = await constructSortBody(body, sorts);
        let response = await queryDatabase({database_id, body});
        if (response.results.length > 0) {
            has_more = response.has_more;
            cursor = response.next_cursor
            for (let result of response.results) {
                results.push(await modifyResult(result));
            }
            logger.info(`sucessfully modified results - length - ${results.length} - has_more - ${has_more}`);
        } else {
            has_more = false;
        }
    }
    return { "results": results };
}

function constructSortBody(body:any, sorts:any) {
    if (sorts.length > 0) {
        body.sorts = sorts.map(modifySort);
    }
    return body;
}

function modifySort(sort:any) {
    if (sort.type === 'last_edited_time') {
        return { timestamp: 'last_edited_time', direction: sort.direction };
    } else if (['date', 'checkbox', 'multi_select', 'select', 'relation'].includes(sort.type)) {
        return { property: sort.name, direction: sort.direction };
    } else if (sort.type === 'created_time') {
        return { timestamp: 'created_time', direction: sort.direction };
    }
}

async function constructFilterBody(filters:any, cursor:any) {
    const filtersBody:any = { filter: { and: [] } };
    if (cursor) {
        filtersBody['start_cursor'] = cursor;
    }
    filtersBody.filter.and = filters.map(modifyFilter);

    return filtersBody;
}

function modifyFilter(filter:any) {
    if (filter.type === 'last_edited_time') {
        return { timestamp: 'last_edited_time', last_edited_time: { [filter.condition]: filter.value } };
    } else if (['date', 'checkbox', 'multi_select', 'select', 'created_time', 'relation', 'status'].includes(filter.type)) {
        return { property: filter.name, [filter.type]: { [filter.condition]: filter.value } };
    }
}

async function modifyResult(result:any):Promise<any> {
    const resultBody:any = { id: result.id };
    const properties = result.properties;

    for (const prop in properties) {
        if (resultBody.hasOwnProperty(prop)) {
            resultBody[prop] = unmodifyProperty(properties[prop]);
        }
    }
    return resultBody;
}

async function queryPageBlocks(page_id:any, type:any) {
    const response = await getBlockChildren(page_id);

    if (response.results.length > 0) {
        if (type === 'parent') {
            const results:any = {};
            for (const result of response.results) {
                try {
                    const parentResult = modifyBlock(result);
                    const parentResultId = parentResult?.id;
                    const parentResultName = parentResult?.name;
                    const childResults = await queryPageBlocks(parentResultId, 'child');
                    results[parentResultName] = {
                        id: parentResultId,
                        children: childResults
                    };
                } catch (error) {
                    logger.info(`Error in ${JSON.stringify(result)}`);
                }
            }
            return results;
        } else if (type === 'child') {
            return response.results.map(result => {
                const childResult = modifyBlock(result);
                const childResultName = childResult?.name;
                return childResultName.includes('\n') ? childResultName.split('\n') : childResultName;
            }).flat();
        }
    }
    return [];
}

function modifyBlock(block:any) {
    if (block.heading_3) {
        return {
            name: block.heading_3.rich_text[0].text.content,
            id: block.has_children ? block.id : undefined
        };
    } else if (block.numbered_list_item) {
        return {
            name: block.numbered_list_item.rich_text[0].text.content,
            id: block.has_children ? block.id : undefined
        };
    } else if (block.code) {
        return {
            name: block.code.rich_text[0].text.content,
            id: block.has_children ? block.id : undefined
        };
    }
}

export const modifyNotionPage = async ({page_id, properties}:any) => {
    const body = await constructUpdateBody(properties);
    const response = await modifyPage({page_id, body});
    return modifyResult(response);
}

async function constructUpdateBody(properties:any) {
    const propertiesBody:any = {};
    for (let property of properties) {
        propertiesBody[property.name] = await modifyProperty(property);
    };
    return { properties: propertiesBody };
}

export const createNotionPage = async({database_id, properties}:any) => {
    const body = await constructCreateBody(database_id, properties);
    const response = await createPage({body});
    return modifyResult(response);
}

async function constructCreateBody(database_id:any, properties:any) {
    console.log(properties);
    const propertiesBody:any = {};
    for (let property of properties){
        propertiesBody[property.name] = await modifyProperty(property);
        console.log(propertiesBody);
    }
    return {
        parent: {
            type: 'database_id',
            database_id: database_id
        },
        properties: propertiesBody
    };
}

async function modifyProperty(property:any) {
    switch (property.type) {
        case 'text':
            return { rich_text: [{ text: { content: property.value } }] };
        case 'title':
            return { title: [{ text: { content: property.value } }] };
        case 'date':
            return { date: { start: property.value || '1900-01-01' } };
        case 'number':
            return { number: property.value };
        case 'file_url':
            return { files: [{ type: 'external', name: 'Cover', external: { url: property.value } }] };
        case 'url':
            return { url: property.value };
        case 'checkbox':
            return { checkbox: property.value };
        case 'select':
            return { select: { name: property.value } };
        case 'multi_select':
            return { multi_select: property.value.map((value:any) => ({ name: value })) };
        case 'relation':
            return { relation: property.value.map((value:any) => ({ id: value })) };
    }
}

function unmodifyProperty(prop:any) {
    switch (prop.type) {
        case 'unique_id':
            return `${prop.unique_id.prefix}-${prop.unique_id.number}`;
        case 'relation':
            return prop.relation.map((x:any) => x.id);
        case 'number':
            return prop.number;
        case 'select':
            return prop.select ? prop.select.name : null;
        case 'title':
            return prop.title[0].text.content;
        case 'rich_text':
            return prop.rich_text.length > 0 ? prop.rich_text[0].text.content : '';
        case 'rollup':
            return unmodifyProperty(prop.rollup);
        case 'people':
            return prop.people.map((x:any) => x.name);
        case 'status':
            return prop.status ? prop.status.name : null;
        case 'date':
            return prop.date ? prop.date.start : null;
        case 'last_edited_time':
            return prop.last_edited_time;
        case 'created_time':
            return prop.created_time;
        case 'multi_select':
            return prop.multi_select.map((x:any) => x.name);
        case 'array':
            return prop.array.map((x:any) => unmodifyProperty(x));
        case 'files':
            return prop.files.map((x:any) => x.name);
        case 'url':
            return prop.url;
    }
}

async function addChildrenToPage(page_id:any, children:any) {
    const body = constructChildrenBody(children);
    const response = await appendBlockChildren({page_id, body});
    return { message: 'Added the children' };
}

function constructChildrenBody(children:any) {
    const childrenBodyList = children.map((child:any) => {
        return {
            [child.type]: modifyChildrenProperty(child)
        };
    });
    return { children: childrenBodyList };
}

function modifyChildrenProperty(prop:any) {
    switch (prop.type) {
        case 'table_of_contents':
            return { color: 'default' };
        case 'callout':
            return prop.value;
        case 'embed':
            return { url: prop.value };
        default:
            return { rich_text: [{ text: { content: prop.value } }] };
    }
}

async function deletePageBlocks(page_id:any) {
    const response = await getBlockChildren(page_id);
    if (response.results.length > 0) {
        for (const result of response.results) {
            await deleteBlock(result.id);
        }
    }
    return { message: 'Deleted the children' };
}

async function getNotionPage(page_id:any) {
    const response = await getPage(page_id);
    return modifyResult(response);
}

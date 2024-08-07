'use client'
import React, { useContext, useState }  from 'react'
import { financeItems } from '../../../lib/constant'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/molecules/shadcn/Tabs'
import Overview from './_components/Overview'
import Settings from './_components/Settings'
import { useMedia } from "react-use";
import { Select, SelectContent, SelectItem, SelectTrigger } from '@repo/ui/molecules/shadcn/Select'
import { useRouter } from 'next/navigation'
import { ConnectionsContext } from '../../../providers/connections-provider'
import NotionTable from '../../../components/NotionTable'

const FinancialPage = () => {
  const isMobile = useMedia("(max-width: 1324px)", false);
  const [selectedValue, setSelectedValue] = useState('Overview')
  const router = useRouter()
  const connectionsContext = useContext(ConnectionsContext);
  const accountsDbId = connectionsContext?.notionNode?.accountsDb?.id
  const budgetPlanDbId = connectionsContext?.notionNode?.budgetPlanDb?.id
  const monthlyBudgetDbId = connectionsContext?.notionNode?.monthlyBudgetDb?.id
  const transactionsDbId = connectionsContext?.notionNode?.transactionsDb?.id
  const financialGoalsDbId = connectionsContext?.notionNode?.financialGoalsDb?.id

  const handleSelect = (value:any) => {
    setSelectedValue(value)
  }


  if (isMobile){
    return (
      <div className='flex flex-col items-center w-full my-6'>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className='my-4 mx-8 w-[200px]'>
            <div>{selectedValue}</div>
          </SelectTrigger>
          <SelectContent className='w-[200px]'>
            {financeItems.map((item:any) =>(
              <SelectItem key={item.title} value={item.title}>
                <div className='flex items-center justify-start gap-4 w-[200px]'>
                  <item.icon/>
                  <div>{item.title}</div>
                </div>
              </SelectItem>
            ))}

          </SelectContent>
        </Select>
        {selectedValue === 'Overview' && <Overview/>}
        {selectedValue === 'Account' && <NotionTable dbId={accountsDbId}/>}
        {selectedValue === 'Transactions' && <NotionTable dbId={transactionsDbId}/>}
        {selectedValue === 'Monthly Budget' && <NotionTable dbId={monthlyBudgetDbId}/>}
        {selectedValue === 'Budget Plan' && <NotionTable dbId={budgetPlanDbId}/>}
        {selectedValue === 'Financial Goals' && <NotionTable dbId={financialGoalsDbId}/>}
        {selectedValue === 'settings' && <Settings/>}
      </div>
    )
  }

  return (
    <Tabs className='w-full' defaultValue='overview'>
      <TabsList className='flex items-center justify-start flex-wrap rounded-none my-4 gap-4 bg-inherit'>
        {financeItems.map((item:any) =>(
            <TabsTrigger key={item.title} value={item.title} className='flex gap-1 border-b-2 shadow-md shadow-border/10 hover:bg-accent ' >
              <item.icon/>
              <div>{item.title}</div>
            </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value='Overview'>
        <Overview/>
      </TabsContent>
      <TabsContent value='Account'>
        <NotionTable dbId={accountsDbId}/>
      </TabsContent>
      <TabsContent value='Transactions'>
        <NotionTable dbId={transactionsDbId}/>
      </TabsContent>
      <TabsContent value='Monthly Budget'>
        <NotionTable dbId={monthlyBudgetDbId}/>
      </TabsContent>
      <TabsContent value='Budget Plan'>
        <NotionTable dbId={budgetPlanDbId}/>
      </TabsContent>
      <TabsContent value='Financial Goals'>
        <NotionTable dbId={financialGoalsDbId}/>
      </TabsContent>
      <TabsContent value='settings'>
        <Settings/>
      </TabsContent>
    </Tabs>
  )
}

export default FinancialPage
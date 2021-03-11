import React, { useEffect, useContext } from 'react';

import { ToggleContext } from '../../../dataContexts/ToggleContext';


import { listRoutes } from '../../../graphql/queries'

import { API, graphqlOperation } from 'aws-amplify';

import { sortAtoZDataByIndex } from '../../../helpers/sortDataHelpers'

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';




const ListWrapper = styled.div`
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    `

const RouteList = ({ selectedRoute, setSelectedRoute, routes, setRoutes }) => {

    let { setIsLoading } = useContext(ToggleContext)


    useEffect(() => {
        setIsLoading(true)
        fetchRoutes()
        setIsLoading(false)
    },[routes])



    const fetchRoutes = async () => {
        
        try{    
          const routeData = await API.graphql(graphqlOperation(listRoutes, {
                limit: '50'
                }))
          const routeList = routeData.data.listRoutes.items;
          sortAtoZDataByIndex(routeList,"routeStart")
          let noDelete = routeList.filter(route => route["_deleted"]!==true)
          
          setRoutes(noDelete)
          
        } catch (error){
          console.log('error on fetching Route List', error)
        }
        
      }


    const handleSelection = e => {
        setSelectedRoute(e.value)
    }
  
  return (
    
        <ListWrapper>
         
          
         <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          {routes && <DataTable value={routes} className="p-datatable-striped" 
            selection={selectedRoute} onSelectionChange={handleSelection} selectionMode="single" dataKey="id">
            <Column field="routeName" header="Routes" sortable filter filterPlaceholder="Search by name"></Column>
           
          </DataTable>}
          </ScrollPanel>
          
          
      </ListWrapper> 
               
  );
}

export default RouteList;

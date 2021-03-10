import React from 'react';

import styled from 'styled-components'
import swal from '@sweetalert/with-react';
import 'primereact/resources/themes/saga-blue/theme.css';

import { updateZone, deleteZone, createZone } from '../../../graphql/mutations'

import { Button } from 'primereact/button';

import { API, graphqlOperation } from 'aws-amplify';




const ButtonBox = styled.div`
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    width: 80%;
    margin: 5px 10px;
    padding: 5px 20px;
    `


const Buttons = ({ selectedZone, setSelectedZone }) => {


    const handleAddZone = () => {
        let zoneName
        

        swal ("Enter Zone Name:", {
            content: "input",
        })
        .then((value) => {
            zoneName = value
            const addDetails = {       
                zoneName: zoneName,
                zoneNum: 0,
                zoneFee: 0
            };
            createZne(addDetails, zoneName)
        })
         
    }
        
    const createZne = async (addDetails) => {
        try {
            await API.graphql(graphqlOperation(createZone, {input: {...addDetails}}))

        } catch (error){
            console.log('error on fetching Zone List', error)
        }
    }

       
    const updateZne = async () => {

        const updateDetails = {
            id: selectedZone["id"],
            zoneName: selectedZone["zoneName"],
            zoneNum: selectedZone["zoneNum"],
            zoneFee: selectedZone["zoneFee"],
            _version: selectedZone["_version"]
        };

        try{
          const zoneData = await API.graphql(graphqlOperation(updateZone, {input: {...updateDetails}}))
        
          swal ({
            text: `${zoneData.data.updateZone.zoneName} has been updated.`,
            icon: "success",
            buttons: false,
            timer: 2000
        })

        } catch (error){
          console.log('error on fetching Zone List', error)
        }
      }


    const deleteZoneWarn = async () => {
        swal ({
            text: " Are you sure that you would like to permanently delete this zone?",
            icon: "warning",
            buttons: ["Yes","Don't do it!"],
            dangerMode: true
        })
        .then((willDelete) => {
            if(!willDelete){
                deleteZne()
            } else {
                return
            }
        })
    }
      
                

    const deleteZne = async () => {
        
        const deleteDetails = {
            id: selectedZone["id"],
            _version: selectedZone["_version"]
        };
      
        try{
            await API.graphql(graphqlOperation(deleteZone, {input: {...deleteDetails}}));
            setSelectedZone()
        } catch (error) {
            console.log('error on fetching Zone List', error)
        }
    }

    return (
   
        <ButtonBox>
            <Button label="Add a Zone" icon="pi pi-plus" onClick={handleAddZone}
                className={"p-button-raised p-button-rounded"} /><br />
            {selectedZone && <React.Fragment><Button label="Update Zone" icon="pi pi-user-edit" onClick={updateZne}
                className={"p-button-raised p-button-rounded p-button-success"} /><br /></React.Fragment>}
            {selectedZone && <React.Fragment><Button label="Delete Zone" icon="pi pi-user-minus" onClick={deleteZoneWarn}
                className={"p-button-raised p-button-rounded p-button-warning"} /><br /><br /></React.Fragment>}
        </ButtonBox>    
  );
}

export default Buttons;

import React, { useState, useContext, useEffect, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";

import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { listCustomers } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";


import { setValue, fixValue, setPickUserValue } from "../../../helpers/formHelpers";
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";



const Info = ({ selectedUser, setSelectedUser }) => {

  let { setIsLoading } = useContext(ToggleContext);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([])
  const fullCustomers = useRef();

  useEffect(() => {
    setIsLoading(true);
    fetchLocations();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setTarget(selectedUser["subSubs"]);
  }, [selectedUser]);


  useEffect(() => {
    let parsedCustomers = [];
    if (fullCustomers.current) {
      parsedCustomers = fullCustomers.current.filter(
        (full) => !selectedUser["subSubs"].includes(full)
      );
    }
    setSource(parsedCustomers);
  }, [selectedUser]);

  const fetchLocations = async () => {
    try {
      const custData = await API.graphql(
        graphqlOperation(listCustomers, {
          limit: "500",
        })
      );
      const custList = custData.data.listCustomers.items;
      sortAtoZDataByIndex(custList, "custName");
      let noDelete = custList.filter((zone) => zone["_deleted"] !== true);
      let mappedNoDelete = noDelete.map((item) => item["custName"]);
      fullCustomers.current = mappedNoDelete;
      setSource(mappedNoDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const itemTemplate = (item) => {
    return <div>{item}</div>;
  };
  
  const onChange = (event) => {
    setSource(event.source);
    setSelectedUser(setPickUserValue(event, selectedUser));
  };


  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-map"></i> User Info
      </h2>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="userName"> Business Name</label>
          <br />
        </span>

        <InputText
          id="businessName"
          placeholder={selectedUser.businessName}
          
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
      </div>
          < br/>
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="firstName"> User First Name</label>
          <br />
        </span>
          
        <InputText
          id="firstName"
          placeholder={selectedUser.firstName}
          
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
      </div>
      <br />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="lastName"> User Last Name</label>
          <br />
        </span>
          
        <InputText
          id="lastName"
          placeholder={selectedUser.lastName}
          
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
      </div>
      <br />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="phone"> Phone</label>
          <br />
        </span>
          
        <InputText
          id="phone"
          placeholder={selectedUser.phone}
          
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
      </div>
      <br />
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="phone"> Email</label>
          <br />
        </span>
          
        <InputText
          id="email"
          placeholder={selectedUser.email}
          
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
      </div>
      <br />
      <PickList
        sourceHeader="Locations"
        targetHeader="User has Access"
        source={source}
        target={selectedUser.subSubs}
        itemTemplate={itemTemplate}
        onChange={onChange}
        sourceStyle={{ height: "250px" }}
        targetStyle={{ height: "250px" }}
      ></PickList>


    
    </React.Fragment>
  );
};

export default Info;

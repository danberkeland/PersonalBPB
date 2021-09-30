import React, { useState, useContext, useEffect, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";

import { CustomerContext } from "../../../dataContexts/CustomerContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { listCustomers } from "../../../graphql/queries";

import { API, graphqlOperation, Auth } from "aws-amplify";

import {
  setValue,
  fixValue,
  setPickUserValue,
} from "../../../helpers/formHelpers";
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

const Info = ({ selectedUser, setSelectedUser, source, setSource, target, setTarget }) => {
  const { customers, setCustLoaded } = useContext(CustomerContext);

  let { setIsLoading } = useContext(ToggleContext);
  const fullCustomers = useRef();


  useEffect(() => {
    let select = [];

    try {
      let selectSub = selectedUser["sub"];

      for (let full of customers) {
        try {
          if (full.userSubs.includes(selectSub)) {
            select.push(full.custName);
          }
        } catch {
          console.log("no userSubs");
        }
      }

      setTarget(select);
    } catch (error) {
      console.log(error);
    }
  }, [selectedUser, customers]);

  useEffect(() => {
    let parsedCustomers = [];
    if (customers) {
      parsedCustomers = customers.map(
        cust => cust.custName
      );
    }
    setSource(parsedCustomers);
  }, [selectedUser]);

  const itemTemplate = (item) => {
    return <div>{item}</div>;
  };

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
    
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
      <br />
      {selectedUser.tempUsername ?
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="firstName"> Temporary Username</label>
          <br />
        </span>

        <InputText
          id="tempUsername"
          placeholder={selectedUser.tempUsername}
          disabled
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
     
      </div> : ""}
      <br />
      {selectedUser.tempPassword ? 
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="firstName"> Temporary Password</label>
          <br />
        </span>

        <InputText
          id="tempPassword"
          placeholder={selectedUser.tempPassword}
          disabled
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedUser(setValue(e, selectedUser))
          }
          onBlur={(e) => setSelectedUser(fixValue(e, selectedUser))}
        />
        
      </div>
     
       : ""}
       <br />
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
      {selectedUser.authType !== "bpbadmin" ? (
        <PickList
          sourceHeader="Locations"
          targetHeader="User has Access"
          source={source}
          target={target}
          itemTemplate={itemTemplate}
          onChange={onChange}
          sourceStyle={{ height: "250px" }}
          targetStyle={{ height: "250px" }}
        ></PickList>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default Info;

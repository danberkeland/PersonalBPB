import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { ToggleContext } from "../../dataContexts/ToggleContext";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { promisedData } from "../../helpers/databaseFetchers";
import ComposeFreezerThaw from "./utils/composeFreezerThaw";

import styled from "styled-components";
import { calcInvoiceTotal } from "../billing/helpers";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeFreezerThaw();

function RetailBags() {
  const { setIsLoading } = useContext(ToggleContext);
  const [freezerThaw, setFreezerThaw] = useState([]);
  const [allProds, setAllProds] = useState([]);

  let delivDate = todayPlus()[0];

  useEffect(() => {
    promisedData(setIsLoading).then((database) => gatherFreezerThaw(database));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherFreezerThaw = (database) => {
    let freezerThawData = compose.returnFreezerThaw(database);
    
    setFreezerThaw(freezerThawData.allProds[0]);
    setAllProds(freezerThawData.allProds[1]);
  };

  const calcTotal = (e) => {
    return <div>{e.qty * e.packSize}</div>;
  };

  const footerGroup = (e) => {
    let total = 0;
    for (let prod of e) {
      total += prod.qty*prod.packSize;
    }
    return (
      <ColumnGroup>
        <Row>
          <Column></Column>
          <Column
            footer="Total:"
            colSpan={1}
            footerStyle={{ textAlign: "right" }}
          />
          <Column footer={total} />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Freezer Thaw {convertDatetoBPBDate(delivDate)}</h1>

        {allProds &&
          allProds.map((all) => (
            <React.Fragment>
              <h3>{all}</h3>
              <DataTable
                value={freezerThaw.filter((fil) => fil.prodName === all)}
                className="p-datatable-sm"
                footerColumnGroup={footerGroup(
                  freezerThaw.filter((fil) => fil.prodName === all)
                )}
              >
                <Column field="custName" header="Customer"></Column>
                <Column field="qty" header="Qty"></Column>
                <Column field="total" header="Total" body={e => calcTotal(e)}></Column>
              </DataTable>
            </React.Fragment>
          ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default RetailBags;

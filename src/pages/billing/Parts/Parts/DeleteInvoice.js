import React from "react";
import { Button } from "primereact/button";

import swal from "@sweetalert/with-react";

const clonedeep = require("lodash.clonedeep");


export const DeleteInvoice = (invNum, dailyInvoices, setDailyInvoices) => {

    const deleteCheck = (invNum) => {
        swal({
          text:
            " Are you sure that you would like to permanently delete this invoice?",
          icon: "warning",
          buttons: ["Yes", "Don't do it!"],
          dangerMode: true,
        }).then((willDelete) => {
          if (!willDelete) {
            deleteInvoiceFinal(invNum);
          } else {
            return;
          }
        });
      };
      
      const deleteInvoiceFinal = (invNum) => {
        let invToModify = clonedeep(dailyInvoices);
        invToModify = invToModify.filter((inv) => inv["invNum"] !== invNum);
        setDailyInvoices(invToModify);
      };
      
      
    return (
      <Button icon="pi pi-trash"
      className="p-button-outlined p-button-rounded p-button-help p-button-sm" onClick={(e) => deleteCheck(invNum)} />
    );
  };
  
  
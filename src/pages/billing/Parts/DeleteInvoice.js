import React from "react";
import { Button } from "primereact/button";

import swal from "@sweetalert/with-react";

const clonedeep = require("lodash.clonedeep");


export const DeleteInvoice = (invNum, invoices, setInvoices) => {

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
        let invToModify = clonedeep(invoices);
        invToModify = invToModify.filter((inv) => inv["invNum"] !== invNum);
        setInvoices(invToModify);
      };
      
      
    return (
      <Button icon="pi pi-times-circle" onClick={(e) => deleteCheck(invNum)} />
    );
  };
  
  
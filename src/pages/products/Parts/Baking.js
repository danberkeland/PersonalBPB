import React, { useContext, useEffect, useState } from "react";

import { ProductsContext } from "../../../dataContexts/ProductsContext";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


import {
  setValue,
  fixValue,
  setDropDownValue,
  
} from "../../../helpers/formHelpers";

const doughTypes = [
  { doughType: "Baguette" },
  { doughType: "Brioche" },
  { doughType: "French" },
  { doughType: "Focaccia" },
  { doughType: "Whole Wheat" },
  { doughType: "Croissant" },
  { doughType: "Rustic Rye" },
  { doughType: "Levain" },
  { doughType: "Multigrain" },
];

const bakedWheres = [
  { bakedWhere: "Prado" },
  { bakedWhere: "Carlton" },
  { bakedWhere: "Mixed" },
];

const Baking = ({ selectedProduct, setSelectedProduct }) => {
  const { products } = useContext(ProductsContext);

  const [ fullProducts, setFullProducts ] = useState([])

  useEffect(() => {
    let stageProducts = products.map(prod => ({depends: prod["prodName"]}))
    stageProducts.push({depends: "NONE"})
    
    setFullProducts(stageProducts)
  },[])
  
  

  

  

  

  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-user"></i> Packing Info
      </h2>
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="doughType">Dough Type</label>
        </span>
        <Dropdown
          id="doughType"
          optionLabel="doughType"
          options={doughTypes}
          onChange={(e) =>
            setSelectedProduct(setDropDownValue(e, selectedProduct))
          }
          placeholder={
            selectedProduct ? selectedProduct.doughType : "Select Dough Type"
          }
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="bakedWhere">Baked Where</label>
        </span>
        <Dropdown
          id="bakedWhere"
          optionLabel="bakedWhere"
          options={bakedWheres}
          onChange={(e) =>
            setSelectedProduct(setDropDownValue(e, selectedProduct))
          }
          placeholder={
            selectedProduct ? selectedProduct.bakedWhere : "Baked Where"
          }
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="readyTime">Guaranteed Ready (0-24)</label>
          <br />
        </span>

        <InputText
          id="readyTime"
          placeholder={selectedProduct.readyTime}
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="weight">Dough Weight (lbs.)</label>
          <br />
        </span>

        <InputText
          id="weight"
          placeholder={selectedProduct.weight}
          onKeyUp={(e) =>
            e.code === "Enter" &&
            setSelectedProduct(setValue(e, selectedProduct))
          }
          onBlur={(e) => setSelectedProduct(fixValue(e, selectedProduct))}
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="depends">Dependant Product</label>
        </span>
        <Dropdown
          id="depends"
          optionLabel="depends"
          options={fullProducts}
          onChange={(e) =>
            setSelectedProduct(setDropDownValue(e, selectedProduct))
          }
          placeholder={
            selectedProduct ? selectedProduct.depends : "Depends On"
          }
        />
      </div>
      <br />
      </React.Fragment>
  );
};

export default Baking;

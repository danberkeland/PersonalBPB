import React, { useContext, useEffect, useState } from "react";

import { ProductsContext } from "../../../dataContexts/ProductsContext";
import { ToggleContext } from "../../../dataContexts/ToggleContext";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { listDoughs } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";


import {
  setValue,
  fixValue,
  setDropDownValue,
  
} from "../../../helpers/formHelpers";





const bakedWheres = [
  { bakedWhere: "Prado" },
  { bakedWhere: "Carlton" },
  { bakedWhere: "Mixed" },
];

const Baking = ({ selectedProduct, setSelectedProduct }) => {
  let { setIsLoading } = useContext(ToggleContext);
  const [doughTypes, setDoughTypes ] = useState()
  const { products } = useContext(ProductsContext);

  const [ fullProducts, setFullProducts ] = useState([])

  useEffect(() => {
    setIsLoading(true);
    fetchDoughs();
    setIsLoading(false);
  }, []);
  
  const fetchDoughs = async () => {
    try {
      const doughData = await API.graphql(
        graphqlOperation(listDoughs, {
          limit: "50",
        })
      );
      const doughList = doughData.data.listDoughs.items;
      sortAtoZDataByIndex(doughList, "doughName");
      let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);
      let doughsToAdd = noDelete.map(no => ({doughType: no.doughName}))
      doughsToAdd.push({doughType: "NA"})
      setDoughTypes(doughsToAdd);
  
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };
  

  useEffect(() => {
    let stageProducts = products.map(prod => ({depends: prod["prodName"]}))
    stageProducts.push({depends: "NONE"})
    
    setFullProducts(stageProducts)
  },[])
  
  

  

  

  

  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-user"></i> Baking Info
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
          <label htmlFor="forBake">Name for Bakers</label>
          <br />
        </span>

        <InputText
          id="forBake"
          placeholder={selectedProduct.forBake}
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
          <label htmlFor="batchSize">Batch Size</label>
          <br />
        </span>

        <InputText
          id="batchSize"
          placeholder={selectedProduct.batchSize}
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
          <label htmlFor="bakeExtra">Bake Extra</label>
          <br />
        </span>

        <InputText
          id="bakeExtra"
          placeholder={selectedProduct.bakeExtra}
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

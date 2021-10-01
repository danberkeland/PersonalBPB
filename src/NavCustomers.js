import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { TabMenu } from "primereact/tabmenu";
import { AmplifySignOut } from "@aws-amplify/ui-react";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import styled from "styled-components";

const BackGround = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
`;

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  background-color: white;
`;

function Nav() {
  const [selectedMenu, setSelectedMenu] = useState("");

  const items = [
    
  
    {
      label: "Ordering",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        window.location = "/Ordering";
      },
    },
    
    
  ];

  return (
    <div className="card">
      <TopBar>
        <Menubar model={items} />
        <AmplifySignOut />
      </TopBar>
    </div>
  );
}

export default Nav;

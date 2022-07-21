import { useContext, useEffect } from "react";

import { ToggleContext } from "../dataContexts/ToggleContext";

const CustomerTestPage = () => {

    let { isLoading, setIsLoading } = useContext(ToggleContext);

    useEffect(() => {
      setIsLoading(false);
    }, []);

    return (
        <div>What Up?</div>
    )
}

  
export default CustomerTestPage;

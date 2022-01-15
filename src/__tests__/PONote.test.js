import React from 'react';
import { render, screen } from "@testing-library/react"

import PONote from '../pages/ordering/Parts/CurrentOrderInfoParts/PONote';
import { ToggleProvider } from "../dataContexts/ToggleContext";
import { CurrentDataProvider } from "../dataContexts/CurrentDataContext"

test('test render of PONote', async () => {
    await render(
        <CurrentDataProvider>
            <ToggleProvider>
                <PONote />
            </ToggleProvider>
        </CurrentDataProvider>
        
    )

    screen.debug()
})

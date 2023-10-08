import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from '@mantine/notifications';
import { MantineProvider, createTheme } from '@mantine/core';

import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider defaultColorScheme='dark'>
        <Notifications />
        <ModalsProvider>
            <App />
        </ModalsProvider>
    </MantineProvider>
);

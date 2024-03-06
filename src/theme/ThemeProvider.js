import React from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { fonts } from './';

const theme = {
    fonts,
};

export const ThemeProvider = ({ children }) => (
    <StyledComponentsThemeProvider theme={theme}>
        {children}
    </StyledComponentsThemeProvider>
);

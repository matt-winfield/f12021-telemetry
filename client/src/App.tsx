import { createGlobalStyle } from 'styled-components';
import PageContainer from './components/page-container';
import useLiveDataConnection from './hooks/use-live-data-connection';
import RobotoFont from './fonts/Roboto-Regular.ttf';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Roboto';
        src: local('Roboto'), url(${RobotoFont}) format('truetype');
    }

    html, body, #root {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        font-family: 'Roboto', sans-serif;
    }

    * {
        box-sizing: border-box;
    }
`;

function App() {
    useLiveDataConnection();

    return (
        <>
            <GlobalStyle />
            <PageContainer />
        </>
    );
}

export default App;

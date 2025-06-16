import { BrowserRouter } from "react-router-dom";
import RenderRouter from "./router/routes";

function App() {
    return (
        <BrowserRouter>
            <RenderRouter/>
        </BrowserRouter>
    );
}

export default App;

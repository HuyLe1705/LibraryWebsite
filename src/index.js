import React from 'react' // nạp thư viện react
import ReactDOM from "react-dom/client"

function App() {
    return (
        <div>
            <h1>Xin chào anh em F8!</h1>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
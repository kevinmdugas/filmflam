// window.global ||= window;
//
// type State = {
//     name: string,
//     count: number,
// }
//
// let state: State = {
//     name: "filmflam",
//     count: 0,
// }
//
// global.changeName = () => {
//     state.name = "Catte"
//     console.log("Changed name")
//     render(state);
// }
//
// global.increaseCount = () => {
//     state = eventHandlers.increaseCount(state);
//     render(state);
// }
//
// global.decreaseCount = () => {
//     state = eventHandlers.decreaseCount(state);
//     render(state);
// }
//
// global.emitEvent = (eventName) => {
//     let eventHandler = eventHandlers[eventName];
//     if (eventHandler) {
//         state = eventHandler(state);
//     }
//     render(state);
// }
//
// let eventHandlers = {
//     increaseCount: (oldState) => {
//         console.log("Counting");
//         return { ...oldState, count: oldState + 1 };
//     },
//     decreaseCount: (oldState) => {
//         console.log("decreasing");
//         return { ...oldState, count: oldState.count - 1 };
//     }
// }
// export function renderApp(state: State) {
//     return `<div>
//         <p onClick="changeName()">Hi from ${state.name}</p>
//         <p onClick="emitEvent('increaseCount')">You have clicked ${state.count} times.</p>
//     </div>`;
// }
//
// function render(state: State) {
//     let html = renderApp(state);
//     document.body.innerHTML = html;
// }
//
// render(state);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@css/index.css';

const rootContainer: HTMLElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootContainer);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */

import { TABLES, COLUMNS, state, createOrderData, updateDragging } from './data.js';

import { createOrderHtml, html, updateDraggingHtml, moveToColumn } from './view.js';

let title
let table
let orderElement

const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
    
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {

}
const handleDragEnd = (event) => {

    // event.preventDefault();

    // // Get the dragged order's ID from the dataTransfer object
    // const id = event.dataTransfer.getData('text/plain');

    // // Determine the column where the order was dropped
    // const targetColumn = event.target.dataset.area;

    // if (!targetColumn) {
    //     // The order was not dropped onto a valid target column
    //     return;
    // }

    // // Update the order's data to reflect the new column
    // updateOrderColumn(id, targetColumn);

    // // Update the visual representation of the order element
    // moveOrderElement(id, targetColumn);

    // // Reset the dragging state
    // updateDragging({ source: null, over: null });
}


const handleHelpToggle = (event) => {
    if (html.help.overlay.style.display === 'block') {
        html.help.overlay.style.display = 'none';
    } else {
        html.help.overlay.style.display = 'block';
    }
}
const handleAddToggle = (event) => {
    if (html.add.overlay.style.display === 'block') {
        html.add.overlay.style.display = 'none';
    } else {
        html.add.overlay.style.display = 'block';
    }
}


const item = document.querySelector('[data-order-title]')
const selectTable = document.querySelector('[data-order-table]')
const selectStatus = document.getElementsByClassName('order__value')

let orderId
const handleAddSubmit = (event) => {
    event.preventDefault();
    title = html.add.title.value
    table = html.add.table.value
    let orderData = createOrderData({ title, table, column: 'ordered' })
    orderElement = createOrderHtml(orderData)
    orderId = orderData.id;
    html.area['ordered'].appendChild(orderElement);
    html.add.overlay.style.display = 'none';
}

const handleEditToggle = (event) => {
    const { target } = event
    if (html.edit.overlay.style.display === 'block') {
        html.edit.overlay.style.display = 'none';
    } else if (target.className !== 'order') return    
        else html.edit.overlay.style.display = 'block';
}


const handleEditSubmit = (event) => {
    event.preventDefault(); 
    let newColumn = html.edit.column.value
    const id =  orderId;
    moveToColumn(id, newColumn);
    document.querySelector(`[data-id="${id}"] [data-order-title]`).textContent = html.edit.title.value;
    document.querySelector(`[data-id="${id}"] [data-order-table]`).textContent = html.edit.table.value;
    html.edit.overlay.style.display = 'none';
 
}



const handleDelete = (event) => {
    html.edit.overlay.style.display = 'none';
    document.querySelector(`[data-id="${orderId}"]`).remove();
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}


// const orderElements = document.querySelectorAll('.order');
// orderElements.forEach((element) => {
//     element.addEventListener('click', (event) => {
//         event.preventDefault();

//         // Get the order's ID from its data attribute and store it in orderId
//         orderId = element.dataset.id;
//         console.log(orderId)
//         // Populate the edit overlay with order details based on the orderId
//         // You can fetch order details and update the overlay here
//         populateEditOverlay(orderId);

//         // Show the edit overlay
//         html.edit.overlay.style.display = 'block';
//     });
// });

// function populateEditOverlay(orderId) {
//     // Fetch order details based on the orderId and update the overlay fields
//     // For example:
//     const order = fetchOrderDetails(orderId);

//     // Update the overlay fields with order details
//     html.edit.title.value = order.title;
//     html.edit.table.value = order.table;
//     html.edit.column.value = order.column;
//     // Set the data-edit-id attribute to the orderId
//     html.edit.form.querySelector('[data-edit-id]').value = orderId;
// }
// function fetchOrderDetails(orderId) {
//     // Replace this with your logic to fetch order details based on the orderId
//     // Return an object with the order details
//     return {
//         title: 'Sample Title',
//         table: 'Sample Table',
//         column: 'Sample Column',
//     };
// }
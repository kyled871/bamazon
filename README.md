# bamazon

## Instructions:
### **bamazonCustomer.js**
- When `node` runs the `bamazonCustomer.js` file, the user will be shown the available items in the corresponding MySQL database.
- The user can then choose the desired item and can select the appropriate quantity.
- If the user or the qty is invalid they will get an error message and another try to input their order.
- If the user's order is successful they will receive a success message along with the choice to place another order or exit. The quantity chosen will be subtracted from the databases amount.
## Example:
![customer](/customer.gif)


### **bamazonManager.js**
- When `node` runs the `bamazonManager.js` file, the user will be shown four options:
    - `View Products for Sale` (*Shows all available items in database*)
    - `View Low Inventory` (*Shows items in database with a QTY of 20 or less*)
    - `Add to Inventory` (*Adds QTY to selected item*)
    - `Add New Product` (*Adds new item to database*)
## Example:
![manager](/manager.gif)



## Tools Used:
This assignment showcased the ability for `node` and `inquirer` packages to communicate with **MySQL** and make changes to databases using javascript.
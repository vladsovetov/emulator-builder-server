## Main idea
Have a generic builder to build any kind of emulator which relies on some items with specific properties. As an output there should be a set of preferred characteristics depending on the items and formulas applied upon them.

----------

### Functionalities
- **Item** CRUD operations
    - Create an item
        - provide a type of an item
        - provide a set of preferred properties an item can has
        - provide a set of required properties an item should have to be active
    - Read item(s)
    - Update an item
    - Delete an item
- **Prop** CRUD operations
    - Create an item prop
    - Read prop(s)
    - Update a prop
    - Delete a prop
- **Collection** CRUD operations
    - Create a collection
        - provide IDs of items which are part of a collection
        - provide properties which gives a collection
    - Read collection(s)
    - Update a collection
    - Delete a collection
- **Panel** CRUD operations
    - Create a panels
        - provide settings of a panel
    - Read panel(s)
    - Update panel
    - Delete panel
- **User** CRUD operations
    - Create a user
    - Read user(s)
    - Update a user
    - Delete a user
- Authorization
    - signup
    - login
    - logout

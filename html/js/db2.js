/**
 * Author: Andrew Kerr
 * Date: 4/25/2023
 * Description: A javascript file that has intermediate functions to allow access to the database
 *   for the front-end without having the front-end concern itself on how using the database works. 
 */

// A collection of database functions and variables.
window.database = { vars: { error: undefined, users: [] }, };

/**
 * Aquires an array of users from the database.
 * @returns {Array<Object>} An array of objects with a 'firstname' and 'lastname' values.
 */
window.database.getUsers = () => { return window.database.vars.users; };

/**
 * Adds a user to the database (so long as one doesn't already exist).
 * @param {String} firstname The firstname of the user that is to be added.
 * @param {String} lastname The lastname of the user that is to be added.
 * @returns {Boolean} True if the user didn't exist and was created, otherwise False.
 */
window.database.addUser = async (firstname, lastname) => { 
    if(window.database.hasUser(firstname, lastname)) return false;
    var result = await window.db.newUser(firstname, lastname);
    if(result && result.length > window.database.vars.users.length) {
        window.database.vars.users.push({FirstName: firstname, LastName: lastname});
        return true;
    }
    return false;
};

/**
 * Checks the database to see if a user exists.
 * @param {String} firstname The firstname of the user to check for.
 * @param {String} lastname The lastname of the user to check for.
 * @returns {Boolean} True if the user exists, otherwise False.
 */
window.database.hasUser = (firstname, lastname) => { 
    for(var i in window.database.vars.users) {
        var user = window.database.vars.users[i];
        if(user.FirstName == firstname && user.LastName == lastname) return true;
    }
    return false;
};

/**
 * Removes a user to the database (so long as one already exists).
 * @param {String} firstname The firstname of the user that is to be removed.
 * @param {String} lastname The lastname of the user that is to be removed.
 * @returns {Boolean} True if the user did exist and was removed, otherwise False.
 */
window.database.removeUser = async(firstname, lastname) => {
    if(!window.database.hasUser(firstname, lastname)) return false;
    if(await window.db.delUser(firstname, lastname)) {
        for(var i in window.database.vars.users) {
            var user = window.database.vars.users[i];
            if(user.FirstName == firstname && user.LastName == lastname) {
                window.database.vars.users.splice(i, 1);
                return true;
            }
        }
    }
    return false;
};

/**
 * Gets all of the questions related to the provided package + category + subcategory + options.
 * @param {String} package The package name that the category will be located within.
 * @param {String} category The category name that the subcategory will be located within.
 * @param {String} subcategory The subcategory name that the options will be located within.
 * @param {String} options The options that the requested questions are marked with.
 * @returns {Array<Object> | undefined} An array of question objects from the database or undefined should any of the parameters not exist.
 */
window.database.getQuestions = (package, category, subcategory, options) => { return undefined; };

/**
 * Any function within window.database is required to set the error to undefined prior to execution and if an error ocurs (denoted by an undefined return from said function) then this function will return the reason for the error.
 * @returns {String | undefined} The last error (as a string) that one of the questions would have caused or undefined if none was found.
 */
window.database.getLastError = () => { return window.database.vars.error; };

{
    // Initializes the initial state.
    var temp = async () => {
        window.database.vars.users = await window.db.getAllUsers();
    };
    temp();
    temp = undefined;
}
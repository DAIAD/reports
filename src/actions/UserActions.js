/**
 * User Actions module.
 * User related action creators
 * 
 * @module UserActions
 */

var userAPI = require('../api/user');

const receivedProfile = function(success, errors, profile) {
  return {
    type: 'USER_RECEIVED_PROFILE',
    profile
  };
};

/**
 * Fetches profile
 *
 * @return {Promise} Resolved or rejected promise with user profile if resolved, errors if rejected
 */
const fetchProfile = function(options) {
  return function(dispatch, getState) {
    return userAPI.getProfile(options)
    .then((response) => {
      const { success, errors, profile } = response;
      
      dispatch(receivedProfile(success, errors.length?errors[0].code:null, profile));

      return response;
    })
    .catch((errors) => {
      console.error('Error caught on profile fetch:', errors);
      return errors;
      });
  };
};

module.exports = {
  fetchProfile,
};

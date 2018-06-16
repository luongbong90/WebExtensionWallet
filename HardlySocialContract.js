// HardlySocial stores one message per user.  Users can come back to update their message anytime.
// Built for Nebulas by HardlyDifficult.  youtube.com/HardlyDifficult
// License: https://github.com/hardlydifficult/HardlySocialNebulas/blob/master/LICENSE
//
// See also index.html

var HardlySocialContract = function() {
  // Data stored by the smart contract
  LocalContractStorage.defineMapProperty(this, "user_to_id")
  LocalContractStorage.defineMapProperty(this, "id_to_message")
  LocalContractStorage.defineProperty(this, "user_count")
}

HardlySocialContract.prototype = {
  // init is called once, when the contract is deployed.
  init: function() {
    this.user_count = 1; // The first id should be 1 (not 0)
  },

  // If the user is new: Add a new message to the system
  // Else: Update their existing message
  postMessage: function (new_user_message) {
    if(Blockchain.transaction.value != 0) { // Users only pay the gas fee.
        throw new Error("I don't want your money.");
    }
    
    var user_id = this.user_to_id.get(Blockchain.transaction.from);
    if(!user_id) {
      // First message from this user, assign a new ID
      user_id = this.user_count;
      this.user_count++;
      this.user_to_id.put(Blockchain.transaction.from, user_id);
    }

    this.id_to_message.put(user_id, new_user_message);
  },

  getMyMessage: function () {
    var user_id = this.user_to_id.get(Blockchain.transaction.from);
    if(user_id) {
      return this.id_to_message.get(user_id);
    }
  },

  getRandomMessage: function () {
    var random_user_id = Math.floor(Math.random() * this.user_count);
    return this.id_to_message.get(random_user_id);
  },

  getMessages: function() {
    var messages = [];
    
    for (var i = 0; i < this.user_count; i++) {
      var message = this.id_to_message.get(i);
      messages.push(message);
    }

    return messages
  },

  getUserCount: function() {
    return this.user_count
  },
}

module.exports = HardlySocialContract

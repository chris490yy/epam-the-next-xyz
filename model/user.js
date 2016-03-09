var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {
    type:　String,
    required: true,
    unique: true
    },
  password: String,
  receive: {type: Boolean, default: false}
});

//User is the collection name in mongoDB
//mongoose.model('User', UserSchema);

UserSchema.method('validPassword', function(password, callback) {

    if (password == this.password) {
      return true;
    } else {
      return false;
    }
});


module.exports = mongoose.model('User', UserSchema);
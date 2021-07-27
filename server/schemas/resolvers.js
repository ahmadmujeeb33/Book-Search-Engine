const { AuthenticationError } = require('apollo-server-express');
const { Book,User } = require('../models');
const { signToken } = require('../utils/auth');



const resolvers = {

    Query: {

        me: async (parent, args, context) => {
            if (context.user) {
            return Profile.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },

    },


    Mutation: {

        login: async (parent, { email, password }) => {
            const profile = await Profile.findOne({ email });
      
            if (!profile) {
              throw new AuthenticationError('No profile with this email found!');
            }
      
            const correctPw = await profile.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect password!');
            }
      
            const token = signToken(profile);
            return { token, profile };
        },

        
        addUser: async (parent, {username, email, password}) =>{
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, profile };
        },

        saveBook: async (parent, {bookInfo}) =>{
            if(context.user){
                return User.findOneAndUpdate(
                    { _id: context.user._id},
                    {
                      $addToSet: { savedBooks: bookInfo },
                    },
                    {
                      new: true,
                      runValidators: true,
                    }


                )
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent,{ bookId },context ) =>{
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true });
            }
            throw new AuthenticationError('You need to be logged in!');
        }

    }



}


module.exports = resolvers;
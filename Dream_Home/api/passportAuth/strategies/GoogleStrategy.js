require('dotenv').config();
const passport = require('passport');
const User = require('../../database/models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Making a Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CLIENT_URL,
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //Checking for the user that it exist in the database or not
                const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || 'No email';
                let user = await User.findOne({email : email});

                if (!user) {
                    // Access the user details from the profile object
                    const displayId = `${profile.id || profile._json.sub || profile.sub || 'No id'}`;
                    const displayName = profile.displayName || profile._json.name || profile.name || 'No display name';
                    const picture = (profile.photos && profile.photos[0] && profile.photos[0].value) || 'No picture';

                    //Creating a new user and save the details of the user in the database
                    user = await User.create({
                        googleId: displayId,
                        name: displayName,
                        email: email,
                        avatar: picture,
                    })
                    user = await user.save();
                }
                done(null, user);
            } catch (error) {
                done(error, null)
            }
        }
    )
)